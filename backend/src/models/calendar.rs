use serde::{Deserialize, Serialize};
use sqlx::types::JsonValue;
use uuid::Uuid;
use chrono::{DateTime, Duration, Utc};
use validator::Validate;

#[derive(Debug, Clone, Serialize, Deserialize, sqlx::Type)]
#[sqlx(type_name = "event_type", rename_all = "lowercase")]
pub enum EventType {
    Meeting,
    Appointment,
    Reminder,
    Task,
    Other,
}

#[derive(Debug, Clone, Serialize, Deserialize, sqlx::Type)]
#[sqlx(type_name = "event_status", rename_all = "lowercase")]
pub enum EventStatus {
    Scheduled,
    Cancelled,
    Completed,
    Rescheduled,
}

#[derive(Debug, Clone, Serialize, Deserialize, sqlx::Type)]
#[sqlx(type_name = "reminder_type", rename_all = "lowercase")]
pub enum ReminderType {
    Email,
    Notification,
    SMS,
}

#[derive(Debug, Clone, Serialize, Deserialize, sqlx::Type)]
#[sqlx(type_name = "reminder_status", rename_all = "lowercase")]
pub enum ReminderStatus {
    Pending,
    Sent,
    Failed,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CalendarEvent {
    pub id: Uuid,
    pub title: String,
    pub description: Option<String>,
    pub start_time: DateTime<Utc>,
    pub end_time: DateTime<Utc>,
    pub creator_id: Uuid,
    pub attendees: Vec<Uuid>,
    pub location: Option<String>,
    pub event_type: EventType,
    pub status: EventStatus,
    pub recurrence: Option<JsonValue>,
    pub reminders: Vec<Uuid>,
    pub metadata: Option<JsonValue>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Reminder {
    pub id: Uuid,
    pub event_id: Uuid,
    pub remind_at: DateTime<Utc>,
    pub reminder_type: ReminderType,
    pub status: ReminderStatus,
}

#[derive(Debug, Clone, Serialize, Deserialize, Validate)]
pub struct CreateEventRequest {
    #[validate(length(min = 1, max = 255))]
    pub title: String,
    pub description: Option<String>,
    #[validate]
    pub start_time: DateTime<Utc>,
    #[validate]
    pub end_time: DateTime<Utc>,
    pub attendees: Vec<Uuid>,
    pub location: Option<String>,
    pub event_type: EventType,
    pub recurrence: Option<JsonValue>,
    pub reminders: Vec<ReminderRequest>,
    pub metadata: Option<JsonValue>,
}

#[derive(Debug, Clone, Serialize, Deserialize, Validate)]
pub struct UpdateEventRequest {
    #[validate(length(min = 1, max = 255))]
    pub title: Option<String>,
    pub description: Option<String>,
    #[validate]
    pub start_time: Option<DateTime<Utc>>,
    #[validate]
    pub end_time: Option<DateTime<Utc>>,
    pub attendees: Option<Vec<Uuid>>,
    pub location: Option<String>,
    pub event_type: Option<EventType>,
    pub status: Option<EventStatus>,
    pub recurrence: Option<JsonValue>,
    pub reminders: Option<Vec<ReminderRequest>>,
    pub metadata: Option<JsonValue>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ReminderRequest {
    pub reminder_type: ReminderType,
    pub remind_before: Duration,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct UserInfo {
    pub id: Uuid,
    pub username: String,
    pub email: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct EventResponse {
    pub event: CalendarEvent,
    pub creator: UserInfo,
    pub attendees: Vec<UserInfo>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct EventConflict {
    pub existing_event: CalendarEvent,
    pub conflict_type: ConflictType,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum ConflictType {
    Overlap,
    Adjacent,
    Recurring,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CalendarMetrics {
    pub total_events: i64,
    pub total_attendees: i64,
    pub events_by_type: JsonValue,
    pub events_by_status: JsonValue,
    pub period_start: DateTime<Utc>,
    pub period_end: DateTime<Utc>,
} 