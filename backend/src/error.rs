use axum::{
    response::{IntoResponse, Response},
    http::StatusCode,
    Json,
};
use serde_json::json;
use thiserror::Error;

#[derive(Error, Debug)]
pub enum AppError {
    #[error("Database error: {0}")]
    Database(#[from] sqlx::Error),

    #[error("Authentication error: {0}")]
    Auth(String),

    #[error("Validation error: {0}")]
    Validation(String),

    #[error("Not found: {0}")]
    NotFound(String),

    #[error("Internal server error: {0}")]
    Internal(String),
}

impl IntoResponse for AppError {
    fn into_response(self) -> Response {
        let (status, error_message) = match self {
            AppError::Database(ref e) => (
                StatusCode::INTERNAL_SERVER_ERROR,
                format!("Database error: {}", e),
            ),
            AppError::Auth(ref message) => (
                StatusCode::UNAUTHORIZED,
                message.clone(),
            ),
            AppError::Validation(ref message) => (
                StatusCode::BAD_REQUEST,
                message.clone(),
            ),
            AppError::NotFound(ref message) => (
                StatusCode::NOT_FOUND,
                message.clone(),
            ),
            AppError::Internal(ref message) => (
                StatusCode::INTERNAL_SERVER_ERROR,
                message.clone(),
            ),
        };

        let body = Json(json!({
            "error": {
                "message": error_message,
                "code": status.as_u16()
            }
        }));

        (status, body).into_response()
    }
} 