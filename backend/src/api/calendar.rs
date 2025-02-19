use axum::{
    extract::{Path, Query, State},
    routing::{get, post, put, delete},
    Json, Router,
};
use chrono::{DateTime, Utc};
use serde::Deserialize;
use sqlx::PgPool;
use uuid::Uuid;

use crate::{
    error::AppError,
    models::calendar::{
        CalendarMetrics, CreateEventRequest, EventResponse, UpdateEventRequest,
    },
    services::calendar::CalendarService,
    auth::AuthUser,
};

pub fn router() -> Router<PgPool> {
    Router::new()
        .route("/events", post(create_event))
        .route("/events", get(list_events))
        .route("/events/:id", get(get_event))
        .route("/events/:id", put(update_event))
        .route("/events/:id", delete(delete_event))
        .route("/events/metrics", get(get_metrics))
}

async fn create_event(
    State(pool): State<PgPool>,
    auth_user: AuthUser,
    Json(request): Json<CreateEventRequest>,
) -> Result<Json<EventResponse>, AppError> {
    let service = CalendarService::new(pool);
    let response = service.create_event(&auth_user.into(), request).await?;
    Ok(Json(response))
}

async fn get_event(
    State(pool): State<PgPool>,
    Path(id): Path<Uuid>,
) -> Result<Json<EventResponse>, AppError> {
    let service = CalendarService::new(pool);
    let response = service.get_event(id).await?;
    Ok(Json(response))
}

#[derive(Debug, Deserialize)]
struct ListEventsQuery {
    start_date: DateTime<Utc>,
    end_date: DateTime<Utc>,
}

async fn list_events(
    State(pool): State<PgPool>,
    auth_user: AuthUser,
    Query(query): Query<ListEventsQuery>,
) -> Result<Json<Vec<EventResponse>>, AppError> {
    let service = CalendarService::new(pool);
    let response = service
        .list_events(auth_user.id, query.start_date, query.end_date)
        .await?;
    Ok(Json(response))
}

async fn update_event(
    State(pool): State<PgPool>,
    Path(id): Path<Uuid>,
    Json(request): Json<UpdateEventRequest>,
) -> Result<Json<EventResponse>, AppError> {
    let service = CalendarService::new(pool);
    let response = service.update_event(id, request).await?;
    Ok(Json(response))
}

async fn delete_event(
    State(pool): State<PgPool>,
    Path(id): Path<Uuid>,
) -> Result<(), AppError> {
    let service = CalendarService::new(pool);
    service.delete_event(id).await
}

#[derive(Debug, Deserialize)]
struct MetricsQuery {
    start_date: DateTime<Utc>,
    end_date: DateTime<Utc>,
}

async fn get_metrics(
    State(pool): State<PgPool>,
    Query(query): Query<MetricsQuery>,
) -> Result<Json<CalendarMetrics>, AppError> {
    let service = CalendarService::new(pool);
    let response = service.get_metrics(query.start_date, query.end_date).await?;
    Ok(Json(response))
} 