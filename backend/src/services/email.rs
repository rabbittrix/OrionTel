use lettre::{
    transport::smtp::authentication::Credentials,
    AsyncSmtpTransport, AsyncTransport, Message, Tokio1Executor,
};
use sqlx::PgPool;
use uuid::Uuid;
use chrono::Utc;

use crate::{
    error::AppError,
    models::{
        auth::User,
        email::{
            CreateEmailRequest, CreateTemplateRequest, Email, EmailMetrics,
            EmailStatus, EmailTemplate, UpdateEmailRequest,
        },
    },
};

pub struct EmailService {
    pool: PgPool,
    smtp_transport: AsyncSmtpTransport<Tokio1Executor>,
}

impl EmailService {
    pub fn new(pool: PgPool) -> Result<Self, AppError> {
        let smtp_host = std::env::var("SMTP_HOST").expect("SMTP_HOST must be set");
        let smtp_port = std::env::var("SMTP_PORT")
            .expect("SMTP_PORT must be set")
            .parse::<u16>()
            .expect("SMTP_PORT must be a number");
        let smtp_username = std::env::var("SMTP_USERNAME").expect("SMTP_USERNAME must be set");
        let smtp_password = std::env::var("SMTP_PASSWORD").expect("SMTP_PASSWORD must be set");

        let creds = Credentials::new(smtp_username, smtp_password);
        let transport = AsyncSmtpTransport::<Tokio1Executor>::relay(&smtp_host)
            .map_err(|e| AppError::Internal(format!("SMTP configuration error: {}", e)))?
            .port(smtp_port)
            .credentials(creds)
            .build();

        Ok(Self {
            pool,
            smtp_transport: transport,
        })
    }

    pub async fn create_email(
        &self,
        sender: &User,
        request: CreateEmailRequest,
    ) -> Result<Email, AppError> {
        let status = if request.schedule_time.is_some() {
            EmailStatus::Scheduled
        } else {
            EmailStatus::Draft
        };

        let email = sqlx::query_as!(
            Email,
            r#"
            INSERT INTO emails (sender_id, recipient_ids, subject, content, attachments, status, sent_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING id, sender_id, recipient_ids, subject, content, attachments, status as "status: EmailStatus", sent_at
            "#,
            sender.id,
            &request.recipient_ids,
            request.subject,
            request.content,
            request.attachments,
            status as EmailStatus,
            request.schedule_time.unwrap_or_else(Utc::now),
        )
        .fetch_one(&self.pool)
        .await?;

        if request.schedule_time.is_none() {
            self.send_email(&email).await?;
        }

        Ok(email)
    }

    async fn send_email(&self, email: &Email) -> Result<(), AppError> {
        // Get recipient email addresses
        let recipients = sqlx::query!(
            r#"
            SELECT email FROM users
            WHERE id = ANY($1)
            "#,
            &email.recipient_ids
        )
        .fetch_all(&self.pool)
        .await?;

        let from_address = std::env::var("SMTP_FROM_ADDRESS").expect("SMTP_FROM_ADDRESS must be set");
        let message = Message::builder()
            .from(from_address.parse().unwrap())
            .to(recipients
                .iter()
                .map(|r| r.email.parse().unwrap())
                .collect::<Vec<_>>())
            .subject(&email.subject)
            .body(email.content.clone())
            .map_err(|e| AppError::Internal(format!("Email creation error: {}", e)))?;

        self.smtp_transport
            .send(message)
            .await
            .map_err(|e| AppError::Internal(format!("Email sending error: {}", e)))?;

        // Update email status
        sqlx::query!(
            r#"
            UPDATE emails
            SET status = $1
            WHERE id = $2
            "#,
            EmailStatus::Sent as EmailStatus,
            email.id
        )
        .execute(&self.pool)
        .await?;

        Ok(())
    }

    pub async fn get_email(&self, id: Uuid) -> Result<Email, AppError> {
        let email = sqlx::query_as!(
            Email,
            r#"
            SELECT id, sender_id, recipient_ids, subject, content, attachments, status as "status: EmailStatus", sent_at
            FROM emails
            WHERE id = $1
            "#,
            id
        )
        .fetch_optional(&self.pool)
        .await?
        .ok_or_else(|| AppError::NotFound("Email not found".into()))?;

        Ok(email)
    }

    pub async fn list_emails(
        &self,
        user_id: Uuid,
        limit: i64,
        offset: i64,
    ) -> Result<Vec<Email>, AppError> {
        let emails = sqlx::query_as!(
            Email,
            r#"
            SELECT id, sender_id, recipient_ids, subject, content, attachments, status as "status: EmailStatus", sent_at
            FROM emails
            WHERE sender_id = $1 OR $1 = ANY(recipient_ids)
            ORDER BY sent_at DESC
            LIMIT $2 OFFSET $3
            "#,
            user_id,
            limit,
            offset
        )
        .fetch_all(&self.pool)
        .await?;

        Ok(emails)
    }

    pub async fn update_email(
        &self,
        id: Uuid,
        request: UpdateEmailRequest,
    ) -> Result<Email, AppError> {
        let email = sqlx::query_as!(
            Email,
            r#"
            UPDATE emails
            SET 
                recipient_ids = COALESCE($1, recipient_ids),
                subject = COALESCE($2, subject),
                content = COALESCE($3, content),
                attachments = COALESCE($4, attachments),
                sent_at = COALESCE($5, sent_at)
            WHERE id = $6 AND status = 'draft'
            RETURNING id, sender_id, recipient_ids, subject, content, attachments, status as "status: EmailStatus", sent_at
            "#,
            request.recipient_ids.as_deref(),
            request.subject,
            request.content,
            request.attachments,
            request.schedule_time,
            id
        )
        .fetch_optional(&self.pool)
        .await?
        .ok_or_else(|| AppError::NotFound("Email not found or not in draft status".into()))?;

        Ok(email)
    }

    pub async fn delete_email(&self, id: Uuid) -> Result<(), AppError> {
        let result = sqlx::query!(
            r#"
            DELETE FROM emails
            WHERE id = $1 AND status = 'draft'
            "#,
            id
        )
        .execute(&self.pool)
        .await?;

        if result.rows_affected() == 0 {
            return Err(AppError::NotFound(
                "Email not found or not in draft status".into(),
            ));
        }

        Ok(())
    }

    pub async fn get_metrics(
        &self,
        start_date: DateTime<Utc>,
        end_date: DateTime<Utc>,
    ) -> Result<EmailMetrics, AppError> {
        let metrics = sqlx::query!(
            r#"
            SELECT 
                COUNT(*) FILTER (WHERE status = 'sent') as "total_sent!",
                COUNT(*) FILTER (WHERE status = 'failed') as "total_failed!",
                AVG(EXTRACT(EPOCH FROM (updated_at - created_at))) as "avg_delivery_time!"
            FROM emails
            WHERE sent_at BETWEEN $1 AND $2
            "#,
            start_date,
            end_date
        )
        .fetch_one(&self.pool)
        .await?;

        Ok(EmailMetrics {
            total_sent: metrics.total_sent,
            total_failed: metrics.total_failed,
            average_delivery_time: metrics.avg_delivery_time,
            period_start: start_date,
            period_end: end_date,
        })
    }

    // Template management
    pub async fn create_template(
        &self,
        request: CreateTemplateRequest,
    ) -> Result<EmailTemplate, AppError> {
        let template = sqlx::query_as!(
            EmailTemplate,
            r#"
            INSERT INTO email_templates (name, subject, content, variables)
            VALUES ($1, $2, $3, $4)
            RETURNING id, name, subject, content, variables, created_at, updated_at
            "#,
            request.name,
            request.subject,
            request.content,
            request.variables
        )
        .fetch_one(&self.pool)
        .await?;

        Ok(template)
    }

    pub async fn get_template(&self, id: Uuid) -> Result<EmailTemplate, AppError> {
        let template = sqlx::query_as!(
            EmailTemplate,
            r#"
            SELECT id, name, subject, content, variables, created_at, updated_at
            FROM email_templates
            WHERE id = $1
            "#,
            id
        )
        .fetch_optional(&self.pool)
        .await?
        .ok_or_else(|| AppError::NotFound("Template not found".into()))?;

        Ok(template)
    }

    pub async fn list_templates(&self) -> Result<Vec<EmailTemplate>, AppError> {
        let templates = sqlx::query_as!(
            EmailTemplate,
            r#"
            SELECT id, name, subject, content, variables, created_at, updated_at
            FROM email_templates
            ORDER BY name
            "#
        )
        .fetch_all(&self.pool)
        .await?;

        Ok(templates)
    }
} 