use sqlx::PgPool;
use uuid::Uuid;

use crate::models::{
    auth::User,
    email::{Email, EmailStatus, EmailTemplate},
};

pub async fn create_test_template(pool: &PgPool) -> EmailTemplate {
    sqlx::query_as!(
        EmailTemplate,
        r#"
        INSERT INTO email_templates (name, subject, content, variables)
        VALUES ($1, $2, $3, $4)
        RETURNING id, name, subject, content, variables, created_at, updated_at
        "#,
        "Test Template",
        "Test Subject",
        "Hello {name}!",
        serde_json::json!({"name": "string"}),
    )
    .fetch_one(pool)
    .await
    .expect("Failed to create test template")
}

pub async fn create_test_draft_email(pool: &PgPool, sender: &User, recipient: &User) -> Email {
    sqlx::query_as!(
        Email,
        r#"
        INSERT INTO emails (sender_id, recipient_ids, subject, content, status)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id, sender_id, recipient_ids, subject, content, attachments, status as "status: EmailStatus", sent_at
        "#,
        sender.id,
        &vec![recipient.id],
        "Test Draft",
        "Draft content",
        EmailStatus::Draft as EmailStatus,
    )
    .fetch_one(pool)
    .await
    .expect("Failed to create test draft email")
}

pub async fn create_test_sent_email(pool: &PgPool, sender: &User, recipient: &User) -> Email {
    sqlx::query_as!(
        Email,
        r#"
        INSERT INTO emails (sender_id, recipient_ids, subject, content, status)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id, sender_id, recipient_ids, subject, content, attachments, status as "status: EmailStatus", sent_at
        "#,
        sender.id,
        &vec![recipient.id],
        "Test Sent",
        "Sent content",
        EmailStatus::Sent as EmailStatus,
    )
    .fetch_one(pool)
    .await
    .expect("Failed to create test sent email")
}

pub async fn create_test_scheduled_email(
    pool: &PgPool,
    sender: &User,
    recipient: &User,
    schedule_time: chrono::DateTime<chrono::Utc>,
) -> Email {
    sqlx::query_as!(
        Email,
        r#"
        INSERT INTO emails (sender_id, recipient_ids, subject, content, status, sent_at)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id, sender_id, recipient_ids, subject, content, attachments, status as "status: EmailStatus", sent_at
        "#,
        sender.id,
        &vec![recipient.id],
        "Test Scheduled",
        "Scheduled content",
        EmailStatus::Scheduled as EmailStatus,
        schedule_time,
    )
    .fetch_one(pool)
    .await
    .expect("Failed to create test scheduled email")
} 