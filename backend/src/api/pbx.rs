use axum::{
    extract::{Path, Query, State},
    routing::{get, post, put, delete},
    Json, Router,
};
use serde::Deserialize;
use sqlx::PgPool;
use uuid::Uuid;

use crate::{
    error::AppError,
    middleware::auth::{require_auth, require_admin, AuthUser},
    models::pbx::{
        CallRecord, CreateCallRecordRequest, CreateExtensionRequest,
        PbxExtension, UpdateCallRecordRequest, UpdateExtensionRequest,
    },
    services::pbx::PbxService,
};

pub fn router() -> Router<PgPool> {
    Router::new()
        .route(
            "/extensions",
            post(create_extension)
                .route_layer(axum::middleware::from_fn(require_admin))
        )
        .route(
            "/extensions/:id",
            get(get_extension)
                .put(update_extension)
                .delete(delete_extension)
                .route_layer(axum::middleware::from_fn(require_auth))
        )
        .route(
            "/extensions",
            get(list_extensions)
                .route_layer(axum::middleware::from_fn(require_auth))
        )
        .route(
            "/calls",
            post(create_call_record)
                .route_layer(axum::middleware::from_fn(require_auth))
        )
        .route(
            "/calls/:id",
            get(get_call_record)
                .put(update_call_record)
                .route_layer(axum::middleware::from_fn(require_auth))
        )
        .route(
            "/calls",
            get(list_call_records)
                .route_layer(axum::middleware::from_fn(require_auth))
        )
        .route(
            "/calls/active",
            get(get_active_calls)
                .route_layer(axum::middleware::from_fn(require_auth))
        )
}

// Extension endpoints
async fn create_extension(
    State(pool): State<PgPool>,
    Json(request): Json<CreateExtensionRequest>,
) -> Result<Json<PbxExtension>, AppError> {
    request.validate()?;
    let service = PbxService::new(pool);
    let extension = service.create_extension(request).await?;
    Ok(Json(extension))
}

async fn get_extension(
    State(pool): State<PgPool>,
    Path(id): Path<Uuid>,
) -> Result<Json<PbxExtension>, AppError> {
    let service = PbxService::new(pool);
    let extension = service.get_extension(id).await?;
    Ok(Json(extension))
}

async fn list_extensions(
    State(pool): State<PgPool>,
) -> Result<Json<Vec<PbxExtension>>, AppError> {
    let service = PbxService::new(pool);
    let extensions = service.list_extensions().await?;
    Ok(Json(extensions))
}

async fn update_extension(
    State(pool): State<PgPool>,
    Path(id): Path<Uuid>,
    Json(request): Json<UpdateExtensionRequest>,
) -> Result<Json<PbxExtension>, AppError> {
    request.validate()?;
    let service = PbxService::new(pool);
    let extension = service.update_extension(id, request).await?;
    Ok(Json(extension))
}

async fn delete_extension(
    State(pool): State<PgPool>,
    Path(id): Path<Uuid>,
) -> Result<(), AppError> {
    let service = PbxService::new(pool);
    service.delete_extension(id).await?;
    Ok(())
}

// Call record endpoints
#[derive(Debug, Deserialize)]
struct ListCallRecordsQuery {
    limit: Option<i64>,
    offset: Option<i64>,
}

async fn create_call_record(
    State(pool): State<PgPool>,
    Json(request): Json<CreateCallRecordRequest>,
) -> Result<Json<CallRecord>, AppError> {
    let service = PbxService::new(pool);
    let record = service.create_call_record(request).await?;
    Ok(Json(record))
}

async fn get_call_record(
    State(pool): State<PgPool>,
    Path(id): Path<Uuid>,
) -> Result<Json<CallRecord>, AppError> {
    let service = PbxService::new(pool);
    let record = service.get_call_record(id).await?;
    Ok(Json(record))
}

async fn update_call_record(
    State(pool): State<PgPool>,
    Path(id): Path<Uuid>,
    Json(request): Json<UpdateCallRecordRequest>,
) -> Result<Json<CallRecord>, AppError> {
    let service = PbxService::new(pool);
    let record = service.update_call_record(id, request).await?;
    Ok(Json(record))
}

async fn list_call_records(
    State(pool): State<PgPool>,
    Query(query): Query<ListCallRecordsQuery>,
) -> Result<Json<Vec<CallRecord>>, AppError> {
    let service = PbxService::new(pool);
    let records = service
        .list_call_records(query.limit.unwrap_or(100), query.offset.unwrap_or(0))
        .await?;
    Ok(Json(records))
}

async fn get_active_calls(
    State(pool): State<PgPool>,
) -> Result<Json<Vec<CallRecord>>, AppError> {
    let service = PbxService::new(pool);
    let records = service.get_active_calls().await?;
    Ok(Json(records))
} 