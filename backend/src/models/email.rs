use serde::{Deserialize, Serialize};
use sqlx::types::JsonValue;
use uuid::Uuid;
use chrono::{DateTime, Utc};
use validator::Validate;

#[derive(Debug, Serialize, Deserialize)]
pub struct Email {
    pub id: Uuid,
    pub sender_id: Uuid,
    pub recipient_ids: Vec<Uuid>,
    pub subject: String,
    pub content: String,
    pub attachments: Option<JsonValue>,
    pub status: EmailStatus,
    pub sent_at: DateTime<Utc>,
}

#[derive(Debug, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "lowercase")]
pub enum EmailStatus {
    Draft,
    Sent,
    Failed,
    Scheduled,
}

#[derive(Debug, Serialize, Deserialize, Validate)]
pub struct CreateEmailRequest {
    pub recipient_ids: Vec<Uuid>,
    #[validate(length(min = 1, max = 255))]
    pub subject: String,
    #[validate(length(min = 1))]
    pub content: String,
    pub attachments: Option<JsonValue>,
    pub schedule_time: Option<DateTime<Utc>>,
}

#[derive(Debug, Serialize, Deserialize, Validate)]
pub struct UpdateEmailRequest {
    pub recipient_ids: Option<Vec<Uuid>>,
    #[validate(length(min = 1, max = 255))]
    pub subject: Option<String>,
    #[validate(length(min = 1))]
    pub content: Option<String>,
    pub attachments: Option<JsonValue>,
    pub schedule_time: Option<DateTime<Utc>>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct EmailAttachment {
    pub filename: String,
    pub content_type: String,
    pub size: i64,
    pub path: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct EmailMetrics {
    pub total_sent: i64,
    pub total_failed: i64,
    pub average_delivery_time: f64,
    pub period_start: DateTime<Utc>,
    pub period_end: DateTime<Utc>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct EmailTemplate {
    pub id: Uuid,
    pub name: String,
    pub subject: String,
    pub content: String,
    pub variables: JsonValue,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Serialize, Deserialize, Validate)]
pub struct CreateTemplateRequest {
    #[validate(length(min = 1, max = 100))]
    pub name: String,
    #[validate(length(min = 1, max = 255))]
    pub subject: String,
    #[validate(length(min = 1))]
    pub content: String,
    pub variables: JsonValue,
} 