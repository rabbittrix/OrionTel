use axum::{
    extract::State,
    routing::{get, post},
    Json, Router,
};
use sqlx::PgPool;

use crate::{
    error::AppError,
    middleware::auth::{require_auth, AuthUser},
    models::auth::{AuthResponse, LoginRequest, RegisterRequest},
    services::auth::AuthService,
};

pub fn router() -> Router<PgPool> {
    Router::new()
        .route("/auth/register", post(register))
        .route("/auth/login", post(login))
        .route("/auth/me", get(me).route_layer(axum::middleware::from_fn(require_auth)))
}

async fn register(
    State(pool): State<PgPool>,
    Json(request): Json<RegisterRequest>,
) -> Result<Json<AuthResponse>, AppError> {
    request.validate()?;
    let service = AuthService::new(pool);
    let response = service.register(request).await?;
    Ok(Json(response))
}

async fn login(
    State(pool): State<PgPool>,
    Json(request): Json<LoginRequest>,
) -> Result<Json<AuthResponse>, AppError> {
    request.validate()?;
    let service = AuthService::new(pool);
    let response = service.login(request).await?;
    Ok(Json(response))
}

async fn me(auth_user: AuthUser) -> Result<Json<AuthUser>, AppError> {
    Ok(Json(auth_user))
} 