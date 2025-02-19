use bcrypt::{hash, DEFAULT_COST};
use sqlx::PgPool;
use uuid::Uuid;

use crate::models::auth::{User, UserRole};

pub async fn create_test_user(pool: &PgPool) -> User {
    let username = format!("test_user_{}", Uuid::new_v4());
    let email = format!("{}@example.com", username);
    let password_hash = hash("password123", DEFAULT_COST).unwrap();

    sqlx::query_as!(
        User,
        r#"
        INSERT INTO users (username, email, password_hash, role)
        VALUES ($1, $2, $3, $4)
        RETURNING id, username, email, password_hash, role as "role: UserRole", created_at, updated_at
        "#,
        username,
        email,
        password_hash,
        UserRole::User as UserRole,
    )
    .fetch_one(pool)
    .await
    .expect("Failed to create test user")
}

pub async fn create_test_admin(pool: &PgPool) -> User {
    let username = format!("test_admin_{}", Uuid::new_v4());
    let email = format!("{}@example.com", username);
    let password_hash = hash("password123", DEFAULT_COST).unwrap();

    sqlx::query_as!(
        User,
        r#"
        INSERT INTO users (username, email, password_hash, role)
        VALUES ($1, $2, $3, $4)
        RETURNING id, username, email, password_hash, role as "role: UserRole", created_at, updated_at
        "#,
        username,
        email,
        password_hash,
        UserRole::Admin as UserRole,
    )
    .fetch_one(pool)
    .await
    .expect("Failed to create test admin")
} 