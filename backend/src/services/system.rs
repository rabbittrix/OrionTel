use sqlx::PgPool;
use uuid::Uuid;
use serde_json::json;

use crate::{
    models::system::{SystemMetrics, SystemStatus, SystemPreference},
    error::AppError,
};

pub struct SystemService {
    pool: PgPool,
}

impl SystemService {
    pub fn new(pool: PgPool) -> Self {
        Self { pool }
    }

    pub async fn get_latest_metrics(&self) -> Result<SystemMetrics, AppError> {
        let metrics = sqlx::query_as!(
            SystemMetrics,
            r#"
            SELECT id, cpu_usage, ram_usage, swap_usage, disk_usage, timestamp
            FROM system_metrics
            ORDER BY timestamp DESC
            LIMIT 1
            "#
        )
        .fetch_one(&self.pool)
        .await?;

        Ok(metrics)
    }

    pub async fn store_metrics(&self, metrics: SystemMetrics) -> Result<SystemMetrics, AppError> {
        let stored_metrics = sqlx::query_as!(
            SystemMetrics,
            r#"
            INSERT INTO system_metrics (id, cpu_usage, ram_usage, swap_usage, disk_usage, timestamp)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id, cpu_usage, ram_usage, swap_usage, disk_usage, timestamp
            "#,
            metrics.id,
            metrics.cpu_usage,
            metrics.ram_usage,
            metrics.swap_usage,
            metrics.disk_usage,
            metrics.timestamp,
        )
        .fetch_one(&self.pool)
        .await?;

        Ok(stored_metrics)
    }

    pub async fn get_system_status(&self) -> Result<SystemStatus, AppError> {
        let metrics = self.get_latest_metrics().await?;
        
        // In a real implementation, these would come from actual system calls
        let status = SystemStatus {
            metrics,
            uptime: 0, // TODO: Implement actual system uptime
            load_average: vec![0.0, 0.0, 0.0], // TODO: Implement actual load average
            process_count: 0, // TODO: Implement actual process count
        };

        Ok(status)
    }

    pub async fn get_preferences(&self) -> Result<Vec<SystemPreference>, AppError> {
        let preferences = sqlx::query_as!(
            SystemPreference,
            r#"
            SELECT id, category, key, value, updated_at
            FROM system_preferences
            ORDER BY category, key
            "#
        )
        .fetch_all(&self.pool)
        .await?;

        Ok(preferences)
    }

    pub async fn update_preference(&self, preference: SystemPreference) -> Result<SystemPreference, AppError> {
        let updated_preference = sqlx::query_as!(
            SystemPreference,
            r#"
            INSERT INTO system_preferences (id, category, key, value, updated_at)
            VALUES ($1, $2, $3, $4, $5)
            ON CONFLICT (category, key)
            DO UPDATE SET
                value = EXCLUDED.value,
                updated_at = CURRENT_TIMESTAMP
            RETURNING id, category, key, value, updated_at
            "#,
            preference.id,
            preference.category,
            preference.key,
            preference.value,
            preference.updated_at,
        )
        .fetch_one(&self.pool)
        .await?;

        Ok(updated_preference)
    }
} 