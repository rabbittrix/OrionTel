use axum::Router;
use reqwest::Client;
use sqlx::PgPool;
use uuid::Uuid;
use chrono::{DateTime, Duration, Utc};
use serde_json::json;

use crate::models::{
    auth::{Claims, User},
    email::Email,
    calendar::{CreateEventRequest, EventResponse, EventType, ReminderRequest, ReminderType},
};

pub struct TestApp {
    pub address: String,
    pub client: Client,
    pub pool: PgPool,
    pub jwt_secret: String,
}

impl TestApp {
    pub async fn new() -> Self {
        // Set up test database
        let database_url = std::env::var("TEST_DATABASE_URL")
            .unwrap_or_else(|_| "postgres://oriontel:oriontel@localhost:5432/oriontel_test".into());
        
        let pool = PgPool::connect(&database_url)
            .await
            .expect("Failed to connect to test database");

        // Clean up database
        sqlx::query!("TRUNCATE TABLE users, emails, email_templates CASCADE")
            .execute(&pool)
            .await
            .expect("Failed to clean test database");

        // Set up test JWT secret
        let jwt_secret = "test_secret".to_string();
        std::env::set_var("JWT_SECRET", &jwt_secret);

        // Set up test SMTP configuration
        std::env::set_var("SMTP_HOST", "localhost");
        std::env::set_var("SMTP_PORT", "2525");
        std::env::set_var("SMTP_USERNAME", "test");
        std::env::set_var("SMTP_PASSWORD", "test");
        std::env::set_var("SMTP_FROM_ADDRESS", "test@example.com");

        Self {
            address: format!("http://127.0.0.1:{}", port),
            client: Client::new(),
            pool,
            jwt_secret,
        }
    }

    pub fn generate_token(&self, user: &User) -> String {
        create_token(user, &self.jwt_secret).unwrap()
    }

    pub async fn create_test_email(&self, sender: &User, recipient: &User) -> Email {
        sqlx::query_as!(
            Email,
            r#"
            INSERT INTO emails (sender_id, recipient_ids, subject, content, status)
            VALUES ($1, $2, $3, $4, 'draft')
            RETURNING id, sender_id, recipient_ids, subject, content, attachments, status as "status: _", sent_at
            "#,
            sender.id,
            &vec![recipient.id],
            "Test Subject",
            "Test Content",
        )
        .fetch_one(&self.pool)
        .await
        .expect("Failed to create test email")
    }

    pub async fn create_test_event(&self, creator: &User) -> EventResponse {
        let start_time = Utc::now() + Duration::hours(1);
        let end_time = start_time + Duration::hours(2);
        self.create_test_event_with_time(creator, start_time, end_time).await
    }

    pub async fn create_test_event_with_time(
        &self,
        creator: &User,
        start_time: DateTime<Utc>,
        end_time: DateTime<Utc>,
    ) -> EventResponse {
        self.create_test_event_with_type(creator, start_time, end_time, EventType::Meeting).await
    }

    pub async fn create_test_event_with_type(
        &self,
        creator: &User,
        start_time: DateTime<Utc>,
        end_time: DateTime<Utc>,
        event_type: EventType,
    ) -> EventResponse {
        let request = CreateEventRequest {
            title: "Test Event".to_string(),
            description: Some("Test Description".to_string()),
            start_time,
            end_time,
            attendees: vec![Uuid::new_v4()],
            location: Some("Test Location".to_string()),
            event_type,
            recurrence: Some(json!({
                "frequency": "weekly",
                "interval": 1,
                "until": (start_time + Duration::days(30)).to_rfc3339()
            })),
            reminders: vec![ReminderRequest {
                reminder_type: ReminderType::Email,
                remind_before: Duration::minutes(15),
            }],
            metadata: Some(json!({
                "test_key": "test_value"
            })),
        };

        let token = self.generate_token(creator);

        let response = self
            .client
            .post(&format!("{}/events", &self.address))
            .header("Authorization", format!("Bearer {}", token))
            .json(&request)
            .send()
            .await
            .unwrap();

        assert_eq!(response.status(), 200);
        response.json::<EventResponse>().await.unwrap()
    }
} 