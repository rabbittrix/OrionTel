use sqlx::PgPool;
use uuid::Uuid;
use chrono::Utc;

use crate::{
    error::AppError,
    models::pbx::{
        CallRecord, CallStatus, CreateCallRecordRequest, CreateExtensionRequest,
        PbxExtension, UpdateCallRecordRequest, UpdateExtensionRequest,
    },
};

pub struct PbxService {
    pool: PgPool,
}

impl PbxService {
    pub fn new(pool: PgPool) -> Self {
        Self { pool }
    }

    // Extension management
    pub async fn create_extension(
        &self,
        request: CreateExtensionRequest,
    ) -> Result<PbxExtension, AppError> {
        let extension = sqlx::query_as!(
            PbxExtension,
            r#"
            INSERT INTO pbx_extensions (extension_number, name, type, config_data)
            VALUES ($1, $2, $3, $4)
            RETURNING id, extension_number, name, type as "extension_type: _", config_data, created_at, updated_at
            "#,
            request.extension_number,
            request.name,
            request.extension_type as _,
            request.config_data,
        )
        .fetch_one(&self.pool)
        .await?;

        Ok(extension)
    }

    pub async fn get_extension(&self, id: Uuid) -> Result<PbxExtension, AppError> {
        let extension = sqlx::query_as!(
            PbxExtension,
            r#"
            SELECT id, extension_number, name, type as "extension_type: _", config_data, created_at, updated_at
            FROM pbx_extensions
            WHERE id = $1
            "#,
            id
        )
        .fetch_optional(&self.pool)
        .await?
        .ok_or_else(|| AppError::NotFound("Extension not found".into()))?;

        Ok(extension)
    }

    pub async fn list_extensions(&self) -> Result<Vec<PbxExtension>, AppError> {
        let extensions = sqlx::query_as!(
            PbxExtension,
            r#"
            SELECT id, extension_number, name, type as "extension_type: _", config_data, created_at, updated_at
            FROM pbx_extensions
            ORDER BY extension_number
            "#
        )
        .fetch_all(&self.pool)
        .await?;

        Ok(extensions)
    }

    pub async fn update_extension(
        &self,
        id: Uuid,
        request: UpdateExtensionRequest,
    ) -> Result<PbxExtension, AppError> {
        let extension = sqlx::query_as!(
            PbxExtension,
            r#"
            UPDATE pbx_extensions
            SET 
                name = COALESCE($1, name),
                type = COALESCE($2, type),
                config_data = COALESCE($3, config_data),
                updated_at = $4
            WHERE id = $5
            RETURNING id, extension_number, name, type as "extension_type: _", config_data, created_at, updated_at
            "#,
            request.name,
            request.extension_type as _,
            request.config_data,
            Utc::now(),
            id
        )
        .fetch_optional(&self.pool)
        .await?
        .ok_or_else(|| AppError::NotFound("Extension not found".into()))?;

        Ok(extension)
    }

    pub async fn delete_extension(&self, id: Uuid) -> Result<(), AppError> {
        let result = sqlx::query!(
            r#"
            DELETE FROM pbx_extensions
            WHERE id = $1
            "#,
            id
        )
        .execute(&self.pool)
        .await?;

        if result.rows_affected() == 0 {
            return Err(AppError::NotFound("Extension not found".into()));
        }

        Ok(())
    }

    // Call record management
    pub async fn create_call_record(
        &self,
        request: CreateCallRecordRequest,
    ) -> Result<CallRecord, AppError> {
        let record = sqlx::query_as!(
            CallRecord,
            r#"
            INSERT INTO call_records (caller_id, recipient_id, start_time, status)
            VALUES ($1, $2, $3, $4)
            RETURNING id, caller_id, recipient_id, start_time, end_time, duration, status as "status: _", recording_path, created_at
            "#,
            request.caller_id,
            request.recipient_id,
            request.start_time,
            request.status as _,
        )
        .fetch_one(&self.pool)
        .await?;

        Ok(record)
    }

    pub async fn update_call_record(
        &self,
        id: Uuid,
        request: UpdateCallRecordRequest,
    ) -> Result<CallRecord, AppError> {
        let record = sqlx::query_as!(
            CallRecord,
            r#"
            UPDATE call_records
            SET 
                end_time = $1,
                duration = $2,
                status = $3,
                recording_path = $4
            WHERE id = $5
            RETURNING id, caller_id, recipient_id, start_time, end_time, duration, status as "status: _", recording_path, created_at
            "#,
            request.end_time,
            request.duration,
            request.status as _,
            request.recording_path,
            id
        )
        .fetch_optional(&self.pool)
        .await?
        .ok_or_else(|| AppError::NotFound("Call record not found".into()))?;

        Ok(record)
    }

    pub async fn get_call_record(&self, id: Uuid) -> Result<CallRecord, AppError> {
        let record = sqlx::query_as!(
            CallRecord,
            r#"
            SELECT id, caller_id, recipient_id, start_time, end_time, duration, status as "status: _", recording_path, created_at
            FROM call_records
            WHERE id = $1
            "#,
            id
        )
        .fetch_optional(&self.pool)
        .await?
        .ok_or_else(|| AppError::NotFound("Call record not found".into()))?;

        Ok(record)
    }

    pub async fn list_call_records(
        &self,
        limit: i64,
        offset: i64,
    ) -> Result<Vec<CallRecord>, AppError> {
        let records = sqlx::query_as!(
            CallRecord,
            r#"
            SELECT id, caller_id, recipient_id, start_time, end_time, duration, status as "status: _", recording_path, created_at
            FROM call_records
            ORDER BY start_time DESC
            LIMIT $1 OFFSET $2
            "#,
            limit,
            offset
        )
        .fetch_all(&self.pool)
        .await?;

        Ok(records)
    }

    pub async fn get_active_calls(&self) -> Result<Vec<CallRecord>, AppError> {
        let records = sqlx::query_as!(
            CallRecord,
            r#"
            SELECT id, caller_id, recipient_id, start_time, end_time, duration, status as "status: _", recording_path, created_at
            FROM call_records
            WHERE status = 'active'
            ORDER BY start_time DESC
            "#
        )
        .fetch_all(&self.pool)
        .await?;

        Ok(records)
    }
} 