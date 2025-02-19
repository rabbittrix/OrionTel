use serde::{Deserialize, Serialize};
use sqlx::types::JsonValue;
use uuid::Uuid;
use chrono::{DateTime, Utc};
use validator::Validate;

#[derive(Debug, Serialize, Deserialize)]
pub struct PbxExtension {
    pub id: Uuid,
    pub extension_number: String,
    pub name: String,
    pub extension_type: ExtensionType,
    pub config_data: JsonValue,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "lowercase")]
pub enum ExtensionType {
    Sip,
    Iax,
    Custom,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct CallRecord {
    pub id: Uuid,
    pub caller_id: String,
    pub recipient_id: String,
    pub start_time: DateTime<Utc>,
    pub end_time: Option<DateTime<Utc>>,
    pub duration: Option<i32>,
    pub status: CallStatus,
    pub recording_path: Option<String>,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "lowercase")]
pub enum CallStatus {
    Active,
    Completed,
    Failed,
    Busy,
    NoAnswer,
}

#[derive(Debug, Serialize, Deserialize, Validate)]
pub struct CreateExtensionRequest {
    #[validate(length(min = 3, max = 20))]
    pub extension_number: String,
    #[validate(length(min = 1, max = 100))]
    pub name: String,
    pub extension_type: ExtensionType,
    pub config_data: JsonValue,
}

#[derive(Debug, Serialize, Deserialize, Validate)]
pub struct UpdateExtensionRequest {
    #[validate(length(min = 1, max = 100))]
    pub name: Option<String>,
    pub extension_type: Option<ExtensionType>,
    pub config_data: Option<JsonValue>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct CreateCallRecordRequest {
    pub caller_id: String,
    pub recipient_id: String,
    pub start_time: DateTime<Utc>,
    pub status: CallStatus,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct UpdateCallRecordRequest {
    pub end_time: DateTime<Utc>,
    pub duration: i32,
    pub status: CallStatus,
    pub recording_path: Option<String>,
} 