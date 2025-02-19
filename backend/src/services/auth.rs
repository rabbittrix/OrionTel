use bcrypt::{hash, verify, DEFAULT_COST};
use chrono::{Duration, Utc};
use jsonwebtoken::{encode, EncodingKey, Header};
use sqlx::PgPool;
use uuid::Uuid;

use crate::{
    error::AppError,
    models::auth::{AuthResponse, Claims, LoginRequest, RegisterRequest, User, UserRole},
};

pub struct AuthService {
    pool: PgPool,
    jwt_secret: String,
}

impl AuthService {
    pub fn new(pool: PgPool) -> Self {
        let jwt_secret = std::env::var("JWT_SECRET").expect("JWT_SECRET must be set");
        Self { pool, jwt_secret }
    }

    pub async fn register(&self, request: RegisterRequest) -> Result<AuthResponse, AppError> {
        // Check if user already exists
        let existing_user = sqlx::query!(
            r#"
            SELECT id FROM users
            WHERE username = $1 OR email = $2
            "#,
            request.username,
            request.email
        )
        .fetch_optional(&self.pool)
        .await?;

        if existing_user.is_some() {
            return Err(AppError::Validation("User already exists".into()));
        }

        // Hash password
        let password_hash = hash(request.password.as_bytes(), DEFAULT_COST)
            .map_err(|e| AppError::Internal(format!("Password hashing error: {}", e)))?;

        // Create user
        let user = sqlx::query_as!(
            User,
            r#"
            INSERT INTO users (username, email, password_hash, role)
            VALUES ($1, $2, $3, $4)
            RETURNING id, username, email, password_hash, role as "role: UserRole", created_at, updated_at
            "#,
            request.username,
            request.email,
            password_hash,
            request.role as UserRole,
        )
        .fetch_one(&self.pool)
        .await?;

        // Generate JWT token
        let token = self.generate_token(&user)?;

        Ok(AuthResponse { token, user })
    }

    pub async fn login(&self, request: LoginRequest) -> Result<AuthResponse, AppError> {
        let user = sqlx::query_as!(
            User,
            r#"
            SELECT id, username, email, password_hash, role as "role: UserRole", created_at, updated_at
            FROM users
            WHERE username = $1
            "#,
            request.username
        )
        .fetch_optional(&self.pool)
        .await?
        .ok_or_else(|| AppError::Auth("Invalid credentials".into()))?;

        // Verify password
        let valid = verify(request.password.as_bytes(), &user.password_hash)
            .map_err(|e| AppError::Internal(format!("Password verification error: {}", e)))?;

        if !valid {
            return Err(AppError::Auth("Invalid credentials".into()));
        }

        // Generate JWT token
        let token = self.generate_token(&user)?;

        Ok(AuthResponse { token, user })
    }

    fn generate_token(&self, user: &User) -> Result<String, AppError> {
        let expiration = Utc::now()
            .checked_add_signed(Duration::hours(24))
            .expect("Invalid timestamp")
            .timestamp();

        let claims = Claims {
            sub: user.id,
            username: user.username.clone(),
            role: user.role.clone(),
            exp: expiration,
        };

        encode(
            &Header::default(),
            &claims,
            &EncodingKey::from_secret(self.jwt_secret.as_bytes()),
        )
        .map_err(|e| AppError::Internal(format!("Token generation error: {}", e)))
    }
} 