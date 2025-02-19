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
    middleware::auth::{require_auth, AuthUser},
    models::email::{
        CreateEmailRequest, CreateTemplateRequest, Email, EmailMetrics,
        EmailTemplate, UpdateEmailRequest,
    },
    services::email::EmailService,
};

pub fn router() -> Router<PgPool> {
    Router::new()
        .route(
            "/emails",
            post(create_email)
                .get(list_emails)
                .route_layer(axum::middleware::from_fn(require_auth))
        )
        .route(
            "/emails/:id",
            get(get_email)
                .put(update_email)
                .delete(delete_email)
                .route_layer(axum::middleware::from_fn(require_auth))
        )
        .route(
            "/emails/metrics",
            get(get_metrics)
                .route_layer(axum::middleware::from_fn(require_auth))
        )
        .route(
            "/email-templates",
            post(create_template)
                .get(list_templates)
                .route_layer(axum::middleware::from_fn(require_auth))
        )
        .route(
            "/email-templates/:id",
            get(get_template)
                .route_layer(axum::middleware::from_fn(require_auth))
        )
}

async fn create_email(
    State(pool): State<PgPool>,
    auth_user: AuthUser,
    Json(request): Json<CreateEmailRequest>,
) -> Result<Json<Email>, AppError> {
    request.validate()?;
    let service = EmailService::new(pool)?;
    let email = service.create_email(&auth_user, request).await?;
    Ok(Json(email))
}

async fn get_email(
    State(pool): State<PgPool>,
    auth_user: AuthUser,
    Path(id): Path<Uuid>,
) -> Result<Json<Email>, AppError> {
    let service = EmailService::new(pool)?;
    let email = service.get_email(id).await?;
    
    // Check if user has access to this email
    if email.sender_id != auth_user.user_id && !email.recipient_ids.contains(&auth_user.user_id) {
        return Err(AppError::Auth("Access denied".into()));
    }

    Ok(Json(email))
}

#[derive(Debug, Deserialize)]
struct ListEmailsQuery {
    limit: Option<i64>,
    offset: Option<i64>,
}

async fn list_emails(
    State(pool): State<PgPool>,
    auth_user: AuthUser,
    Query(query): Query<ListEmailsQuery>,
) -> Result<Json<Vec<Email>>, AppError> {
    let service = EmailService::new(pool)?;
    let emails = service
        .list_emails(
            auth_user.user_id,
            query.limit.unwrap_or(100),
            query.offset.unwrap_or(0),
        )
        .await?;
    Ok(Json(emails))
}

async fn update_email(
    State(pool): State<PgPool>,
    auth_user: AuthUser,
    Path(id): Path<Uuid>,
    Json(request): Json<UpdateEmailRequest>,
) -> Result<Json<Email>, AppError> {
    request.validate()?;
    let service = EmailService::new(pool)?;
    
    // Check if user owns this email
    let email = service.get_email(id).await?;
    if email.sender_id != auth_user.user_id {
        return Err(AppError::Auth("Access denied".into()));
    }

    let updated_email = service.update_email(id, request).await?;
    Ok(Json(updated_email))
}

async fn delete_email(
    State(pool): State<PgPool>,
    auth_user: AuthUser,
    Path(id): Path<Uuid>,
) -> Result<(), AppError> {
    let service = EmailService::new(pool)?;
    
    // Check if user owns this email
    let email = service.get_email(id).await?;
    if email.sender_id != auth_user.user_id {
        return Err(AppError::Auth("Access denied".into()));
    }

    service.delete_email(id).await?;
    Ok(())
}

#[derive(Debug, Deserialize)]
struct MetricsQuery {
    start_date: DateTime<Utc>,
    end_date: DateTime<Utc>,
}

async fn get_metrics(
    State(pool): State<PgPool>,
    Query(query): Query<MetricsQuery>,
) -> Result<Json<EmailMetrics>, AppError> {
    let service = EmailService::new(pool)?;
    let metrics = service.get_metrics(query.start_date, query.end_date).await?;
    Ok(Json(metrics))
}

async fn create_template(
    State(pool): State<PgPool>,
    Json(request): Json<CreateTemplateRequest>,
) -> Result<Json<EmailTemplate>, AppError> {
    request.validate()?;
    let service = EmailService::new(pool)?;
    let template = service.create_template(request).await?;
    Ok(Json(template))
}

async fn get_template(
    State(pool): State<PgPool>,
    Path(id): Path<Uuid>,
) -> Result<Json<EmailTemplate>, AppError> {
    let service = EmailService::new(pool)?;
    let template = service.get_template(id).await?;
    Ok(Json(template))
}

async fn list_templates(
    State(pool): State<PgPool>,
) -> Result<Json<Vec<EmailTemplate>>, AppError> {
    let service = EmailService::new(pool)?;
    let templates = service.list_templates().await?;
    Ok(Json(templates))
} 