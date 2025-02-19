use axum::{
    async_trait,
    extract::{FromRequestParts, TypedHeader},
    headers::{authorization::Bearer, Authorization},
    http::request::Parts,
    RequestPartsExt,
};
use jsonwebtoken::{decode, DecodingKey, Validation};

use crate::{
    error::AppError,
    models::auth::{Claims, UserRole},
};

pub struct AuthUser {
    pub user_id: uuid::Uuid,
    pub username: String,
    pub role: UserRole,
}

#[async_trait]
impl<S> FromRequestParts<S> for AuthUser
where
    S: Send + Sync,
{
    type Rejection = AppError;

    async fn from_request_parts(parts: &mut Parts, _state: &S) -> Result<Self, Self::Rejection> {
        // Extract the token from the authorization header
        let TypedHeader(Authorization(bearer)) = parts
            .extract::<TypedHeader<Authorization<Bearer>>>()
            .await
            .map_err(|_| AppError::Auth("Missing authorization header".into()))?;

        // Decode the token
        let jwt_secret = std::env::var("JWT_SECRET").expect("JWT_SECRET must be set");
        let token_data = decode::<Claims>(
            bearer.token(),
            &DecodingKey::from_secret(jwt_secret.as_bytes()),
            &Validation::default(),
        )
        .map_err(|_| AppError::Auth("Invalid token".into()))?;

        let claims = token_data.claims;

        // Check if the token is expired
        let current_time = chrono::Utc::now().timestamp();
        if claims.exp < current_time {
            return Err(AppError::Auth("Token expired".into()));
        }

        Ok(AuthUser {
            user_id: claims.sub,
            username: claims.username,
            role: claims.role,
        })
    }
}

pub async fn require_auth<B>(
    auth_user: Result<AuthUser, AppError>,
    request: axum::http::Request<B>,
    next: axum::middleware::Next<B>,
) -> Result<axum::response::Response, AppError> {
    auth_user?;
    Ok(next.run(request).await)
}

pub async fn require_admin<B>(
    auth_user: Result<AuthUser, AppError>,
    request: axum::http::Request<B>,
    next: axum::middleware::Next<B>,
) -> Result<axum::response::Response, AppError> {
    let user = auth_user?;
    if user.role != UserRole::Admin {
        return Err(AppError::Auth("Admin access required".into()));
    }
    Ok(next.run(request).await)
} 