use chrono::{DateTime, Duration, Utc};
use sqlx::PgPool;
use uuid::Uuid;

use crate::{
    error::AppError,
    models::{
        auth::User,
        calendar::{
            CalendarEvent, CalendarMetrics, CreateEventRequest, EventConflict,
            EventResponse, EventStatus, EventType, Reminder, ReminderRequest,
            ReminderStatus, UpdateEventRequest, UserInfo,
        },
    },
    services::email::EmailService,
};

pub struct CalendarService {
    pool: PgPool,
}

impl CalendarService {
    pub fn new(pool: PgPool) -> Self {
        Self { pool }
    }

    pub async fn create_event(
        &self,
        creator: &User,
        request: CreateEventRequest,
    ) -> Result<EventResponse, AppError> {
        // Check for conflicts
        let conflicts = self
            .check_conflicts(creator.id, &request.start_time, &request.end_time)
            .await?;
        if !conflicts.is_empty() {
            return Err(AppError::Validation(format!(
                "Event conflicts with {} existing events",
                conflicts.len()
            )));
        }

        // Create event
        let event = sqlx::query_as!(
            CalendarEvent,
            r#"
            INSERT INTO calendar_events (
                title, description, start_time, end_time, creator_id,
                attendees, location, event_type, status, recurrence,
                metadata
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
            RETURNING id, title, description, start_time, end_time, creator_id,
                      attendees, location, event_type as "event_type: EventType",
                      status as "status: EventStatus", recurrence, reminders,
                      metadata, created_at, updated_at
            "#,
            request.title,
            request.description,
            request.start_time,
            request.end_time,
            creator.id,
            &request.attendees,
            request.location,
            request.event_type as EventType,
            EventStatus::Scheduled as EventStatus,
            request.recurrence,
            request.metadata,
        )
        .fetch_one(&self.pool)
        .await?;

        // Create reminders
        for reminder in request.reminders {
            self.create_reminder(&event, reminder).await?;
        }

        // Send notifications to attendees
        self.notify_attendees(&event, "New event invitation").await?;

        // Get full event response
        self.get_event_response(&event).await
    }

    async fn create_reminder(
        &self,
        event: &CalendarEvent,
        request: ReminderRequest,
    ) -> Result<Reminder, AppError> {
        let remind_at = event.start_time - request.remind_before;

        let reminder = sqlx::query_as!(
            Reminder,
            r#"
            INSERT INTO event_reminders (event_id, remind_at, reminder_type, status)
            VALUES ($1, $2, $3, $4)
            RETURNING id, event_id, remind_at, reminder_type as "reminder_type: _",
                      status as "status: _"
            "#,
            event.id,
            remind_at,
            request.reminder_type as _,
            ReminderStatus::Pending as ReminderStatus,
        )
        .fetch_one(&self.pool)
        .await?;

        Ok(reminder)
    }

    pub async fn get_event(&self, id: Uuid) -> Result<EventResponse, AppError> {
        let event = sqlx::query_as!(
            CalendarEvent,
            r#"
            SELECT id, title, description, start_time, end_time, creator_id,
                   attendees, location, event_type as "event_type: EventType",
                   status as "status: EventStatus", recurrence, reminders,
                   metadata, created_at, updated_at
            FROM calendar_events
            WHERE id = $1
            "#,
            id
        )
        .fetch_optional(&self.pool)
        .await?
        .ok_or_else(|| AppError::NotFound("Event not found".into()))?;

        self.get_event_response(&event).await
    }

    pub async fn list_events(
        &self,
        user_id: Uuid,
        start_date: DateTime<Utc>,
        end_date: DateTime<Utc>,
    ) -> Result<Vec<EventResponse>, AppError> {
        let events = sqlx::query_as!(
            CalendarEvent,
            r#"
            SELECT id, title, description, start_time, end_time, creator_id,
                   attendees, location, event_type as "event_type: EventType",
                   status as "status: EventStatus", recurrence, reminders,
                   metadata, created_at, updated_at
            FROM calendar_events
            WHERE (creator_id = $1 OR $1 = ANY(attendees))
            AND start_time BETWEEN $2 AND $3
            ORDER BY start_time
            "#,
            user_id,
            start_date,
            end_date
        )
        .fetch_all(&self.pool)
        .await?;

        let mut responses = Vec::new();
        for event in events {
            responses.push(self.get_event_response(&event).await?);
        }

        Ok(responses)
    }

    pub async fn update_event(
        &self,
        id: Uuid,
        request: UpdateEventRequest,
    ) -> Result<EventResponse, AppError> {
        let event = sqlx::query_as!(
            CalendarEvent,
            r#"
            UPDATE calendar_events
            SET title = COALESCE($1, title),
                description = COALESCE($2, description),
                start_time = COALESCE($3, start_time),
                end_time = COALESCE($4, end_time),
                attendees = COALESCE($5, attendees),
                location = COALESCE($6, location),
                event_type = COALESCE($7, event_type),
                status = COALESCE($8, status),
                recurrence = COALESCE($9, recurrence),
                metadata = COALESCE($10, metadata),
                updated_at = NOW()
            WHERE id = $11
            RETURNING id, title, description, start_time, end_time, creator_id,
                      attendees, location, event_type as "event_type: EventType",
                      status as "status: EventStatus", recurrence, reminders,
                      metadata, created_at, updated_at
            "#,
            request.title,
            request.description,
            request.start_time,
            request.end_time,
            request.attendees.as_ref().map(|v| v as _),
            request.location,
            request.event_type as _,
            request.status as _,
            request.recurrence,
            request.metadata,
            id
        )
        .fetch_optional(&self.pool)
        .await?
        .ok_or_else(|| AppError::NotFound("Event not found".into()))?;

        // Update reminders if provided
        if let Some(reminders) = request.reminders {
            // Delete existing reminders
            sqlx::query!("DELETE FROM event_reminders WHERE event_id = $1", id)
                .execute(&self.pool)
                .await?;

            // Create new reminders
            for reminder in reminders {
                self.create_reminder(&event, reminder).await?;
            }
        }

        // Notify attendees about the update
        self.notify_attendees(&event, "Event updated").await?;

        self.get_event_response(&event).await
    }

    pub async fn delete_event(&self, id: Uuid) -> Result<(), AppError> {
        let result = sqlx::query!("DELETE FROM calendar_events WHERE id = $1", id)
            .execute(&self.pool)
            .await?;

        if result.rows_affected() == 0 {
            return Err(AppError::NotFound("Event not found".into()));
        }

        Ok(())
    }

    async fn get_event_response(&self, event: &CalendarEvent) -> Result<EventResponse, AppError> {
        // Get creator info
        let creator = sqlx::query_as!(
            UserInfo,
            r#"
            SELECT id, username, email
            FROM users
            WHERE id = $1
            "#,
            event.creator_id
        )
        .fetch_one(&self.pool)
        .await?;

        // Get attendee info
        let attendees = sqlx::query_as!(
            UserInfo,
            r#"
            SELECT id, username, email
            FROM users
            WHERE id = ANY($1)
            "#,
            &event.attendees
        )
        .fetch_all(&self.pool)
        .await?;

        Ok(EventResponse {
            event: event.clone(),
            creator,
            attendees,
        })
    }

    async fn check_conflicts(
        &self,
        user_id: Uuid,
        start_time: &DateTime<Utc>,
        end_time: &DateTime<Utc>,
    ) -> Result<Vec<EventConflict>, AppError> {
        let events = sqlx::query_as!(
            CalendarEvent,
            r#"
            SELECT id, title, description, start_time, end_time, creator_id,
                   attendees, location, event_type as "event_type: EventType",
                   status as "status: EventStatus", recurrence, reminders,
                   metadata, created_at, updated_at
            FROM calendar_events
            WHERE (creator_id = $1 OR $1 = ANY(attendees))
            AND status != 'cancelled'
            AND (
                (start_time, end_time) OVERLAPS ($2, $3)
                OR (
                    recurrence IS NOT NULL
                    AND start_time <= $3
                    AND (recurrence->>'until' IS NULL OR (recurrence->>'until')::timestamptz >= $2)
                )
            )
            "#,
            user_id,
            start_time,
            end_time
        )
        .fetch_all(&self.pool)
        .await?;

        Ok(events
            .into_iter()
            .map(|event| EventConflict {
                existing_event: event,
                conflict_type: if event.recurrence.is_some() {
                    crate::models::calendar::ConflictType::Recurring
                } else if event.start_time == *end_time || event.end_time == *start_time {
                    crate::models::calendar::ConflictType::Adjacent
                } else {
                    crate::models::calendar::ConflictType::Overlap
                },
            })
            .collect())
    }

    async fn notify_attendees(&self, event: &CalendarEvent, subject: &str) -> Result<(), AppError> {
        let email_service = EmailService::new(self.pool.clone())?;

        // Get creator info for the email
        let creator = sqlx::query!(
            r#"
            SELECT username, email FROM users WHERE id = $1
            "#,
            event.creator_id
        )
        .fetch_one(&self.pool)
        .await?;

        // Create email content
        let content = format!(
            "Event: {}\nOrganizer: {}\nWhen: {} to {}\nLocation: {}\n\n{}",
            event.title,
            creator.username,
            event.start_time,
            event.end_time,
            event.location.as_deref().unwrap_or("Not specified"),
            event.description.as_deref().unwrap_or("")
        );

        // Send email to each attendee
        for attendee_id in &event.attendees {
            let request = crate::models::email::CreateEmailRequest {
                recipient_ids: vec![*attendee_id],
                subject: subject.to_string(),
                content,
                attachments: None,
                schedule_time: None,
            };

            let creator_user = User {
                id: event.creator_id,
                username: creator.username.clone(),
                email: creator.email.clone(),
                password_hash: String::new(), // Not needed for sending email
                role: crate::models::auth::UserRole::User,
                created_at: Utc::now(),
                updated_at: Utc::now(),
            };

            email_service.create_email(&creator_user, request).await?;
        }

        Ok(())
    }

    pub async fn get_metrics(
        &self,
        start_date: DateTime<Utc>,
        end_date: DateTime<Utc>,
    ) -> Result<CalendarMetrics, AppError> {
        let metrics = sqlx::query!(
            r#"
            SELECT
                COUNT(*) as "total_events!",
                (SELECT COUNT(DISTINCT unnest(attendees))) as "total_attendees!",
                jsonb_object_agg(event_type, count) as "events_by_type",
                jsonb_object_agg(status, count) as "events_by_status"
            FROM (
                SELECT
                    event_type::text,
                    status::text,
                    COUNT(*) as count
                FROM calendar_events
                WHERE start_time BETWEEN $1 AND $2
                GROUP BY event_type, status
            ) t
            "#,
            start_date,
            end_date
        )
        .fetch_one(&self.pool)
        .await?;

        Ok(CalendarMetrics {
            total_events: metrics.total_events,
            total_attendees: metrics.total_attendees,
            events_by_type: metrics.events_by_type.unwrap_or_default(),
            events_by_status: metrics.events_by_status.unwrap_or_default(),
            period_start: start_date,
            period_end: end_date,
        })
    }
} 