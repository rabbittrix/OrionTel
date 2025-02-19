use axum::{
    extract::State,
    routing::{get, post},
    Json, Router,
};
use sqlx::PgPool;
use uuid::Uuid;

use crate::{
    models::system::{SystemMetrics, SystemStatus, SystemPreference},
    error::AppError,
    services::system::SystemService,
};

pub fn router() -> Router<PgPool> {
    Router::new()
        .route("/metrics", get(get_system_metrics))
        .route("/metrics", post(store_system_metrics))
        .route("/status", get(get_system_status))
        .route("/preferences", get(get_system_preferences))
        .route("/preferences", post(update_system_preferences))
}

async fn get_system_metrics(
    State(pool): State<PgPool>,
) -> Result<Json<SystemMetrics>, AppError> {
    let service = SystemService::new(pool);
    let metrics = service.get_latest_metrics().await?;
    Ok(Json(metrics))
}

async fn store_system_metrics(
    State(pool): State<PgPool>,
    Json(metrics): Json<SystemMetrics>,
) -> Result<Json<SystemMetrics>, AppError> {
    let service = SystemService::new(pool);
    let stored_metrics = service.store_metrics(metrics).await?;
    Ok(Json(stored_metrics))
}

async fn get_system_status(
    State(pool): State<PgPool>,
) -> Result<Json<SystemStatus>, AppError> {
    let service = SystemService::new(pool);
    let status = service.get_system_status().await?;
    Ok(Json(status))
}

async fn get_system_preferences(
    State(pool): State<PgPool>,
) -> Result<Json<Vec<SystemPreference>>, AppError> {
    let service = SystemService::new(pool);
    let preferences = service.get_preferences().await?;
    Ok(Json(preferences))
}

async fn update_system_preferences(
    State(pool): State<PgPool>,
    Json(preference): Json<SystemPreference>,
) -> Result<Json<SystemPreference>, AppError> {
    let service = SystemService::new(pool);
    let updated_preference = service.update_preference(preference).await?;
    Ok(Json(updated_preference))
} 