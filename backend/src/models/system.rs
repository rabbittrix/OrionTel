use serde::{Deserialize, Serialize};
use sqlx::types::JsonValue;
use uuid::Uuid;
use chrono::{DateTime, Utc};

#[derive(Debug, Serialize, Deserialize)]
pub struct SystemMetrics {
    pub id: Uuid,
    pub cpu_usage: f64,
    pub ram_usage: f64,
    pub swap_usage: f64,
    pub disk_usage: JsonValue,
    pub timestamp: DateTime<Utc>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct DiskUsage {
    pub total: i64,
    pub used: i64,
    pub free: i64,
    pub mount_point: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct SystemStatus {
    pub metrics: SystemMetrics,
    pub uptime: i64,
    pub load_average: Vec<f64>,
    pub process_count: i32,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct SystemPreference {
    pub id: Uuid,
    pub category: String,
    pub key: String,
    pub value: JsonValue,
    pub updated_at: DateTime<Utc>,
}

impl SystemMetrics {
    pub fn new(
        cpu_usage: f64,
        ram_usage: f64,
        swap_usage: f64,
        disk_usage: JsonValue,
    ) -> Self {
        Self {
            id: Uuid::new_v4(),
            cpu_usage,
            ram_usage,
            swap_usage,
            disk_usage,
            timestamp: Utc::now(),
        }
    }
} 