use chrono::Utc;
use serde_json::json;
use uuid::Uuid;

use crate::helpers::{app::TestApp, auth::create_test_user};

#[tokio::test]
async fn test_create_email() {
    let app = TestApp::new().await;
    let user = create_test_user(&app.pool).await;
    let token = app.generate_token(&user);

    let recipient = create_test_user(&app.pool).await;
    let request = json!({
        "recipient_ids": [recipient.id],
        "subject": "Test Email",
        "content": "This is a test email",
        "attachments": null,
        "schedule_time": null
    });

    let response = app
        .client
        .post("/emails")
        .header("Authorization", format!("Bearer {}", token))
        .json(&request)
        .send()
        .await;

    assert!(response.status().is_success());
    let email = response.json::<serde_json::Value>().await;
    assert_eq!(email["subject"], "Test Email");
    assert_eq!(email["content"], "This is a test email");
}

#[tokio::test]
async fn test_get_email() {
    let app = TestApp::new().await;
    let user = create_test_user(&app.pool).await;
    let token = app.generate_token(&user);

    // Create a test email
    let recipient = create_test_user(&app.pool).await;
    let email = app.create_test_email(&user, &recipient).await;

    let response = app
        .client
        .get(&format!("/emails/{}", email.id))
        .header("Authorization", format!("Bearer {}", token))
        .send()
        .await;

    assert!(response.status().is_success());
    let fetched_email = response.json::<serde_json::Value>().await;
    assert_eq!(fetched_email["id"], email.id.to_string());
}

#[tokio::test]
async fn test_list_emails() {
    let app = TestApp::new().await;
    let user = create_test_user(&app.pool).await;
    let token = app.generate_token(&user);

    // Create multiple test emails
    let recipient = create_test_user(&app.pool).await;
    for _ in 0..3 {
        app.create_test_email(&user, &recipient).await;
    }

    let response = app
        .client
        .get("/emails")
        .header("Authorization", format!("Bearer {}", token))
        .send()
        .await;

    assert!(response.status().is_success());
    let emails = response.json::<Vec<serde_json::Value>>().await;
    assert_eq!(emails.len(), 3);
}

#[tokio::test]
async fn test_update_email() {
    let app = TestApp::new().await;
    let user = create_test_user(&app.pool).await;
    let token = app.generate_token(&user);

    // Create a test email
    let recipient = create_test_user(&app.pool).await;
    let email = app.create_test_email(&user, &recipient).await;

    let update = json!({
        "subject": "Updated Subject",
        "content": "Updated content"
    });

    let response = app
        .client
        .put(&format!("/emails/{}", email.id))
        .header("Authorization", format!("Bearer {}", token))
        .json(&update)
        .send()
        .await;

    assert!(response.status().is_success());
    let updated_email = response.json::<serde_json::Value>().await;
    assert_eq!(updated_email["subject"], "Updated Subject");
    assert_eq!(updated_email["content"], "Updated content");
}

#[tokio::test]
async fn test_delete_email() {
    let app = TestApp::new().await;
    let user = create_test_user(&app.pool).await;
    let token = app.generate_token(&user);

    // Create a test email
    let recipient = create_test_user(&app.pool).await;
    let email = app.create_test_email(&user, &recipient).await;

    let response = app
        .client
        .delete(&format!("/emails/{}", email.id))
        .header("Authorization", format!("Bearer {}", token))
        .send()
        .await;

    assert!(response.status().is_success());

    // Verify email is deleted
    let get_response = app
        .client
        .get(&format!("/emails/{}", email.id))
        .header("Authorization", format!("Bearer {}", token))
        .send()
        .await;

    assert_eq!(get_response.status(), 404);
}

#[tokio::test]
async fn test_email_metrics() {
    let app = TestApp::new().await;
    let user = create_test_user(&app.pool).await;
    let token = app.generate_token(&user);

    // Create some test emails
    let recipient = create_test_user(&app.pool).await;
    for _ in 0..5 {
        app.create_test_email(&user, &recipient).await;
    }

    let now = Utc::now();
    let start_date = now.checked_sub_signed(chrono::Duration::days(1)).unwrap();
    let end_date = now;

    let response = app
        .client
        .get("/emails/metrics")
        .header("Authorization", format!("Bearer {}", token))
        .query(&[
            ("start_date", start_date.to_rfc3339()),
            ("end_date", end_date.to_rfc3339()),
        ])
        .send()
        .await;

    assert!(response.status().is_success());
    let metrics = response.json::<serde_json::Value>().await;
    assert_eq!(metrics["total_sent"], 5);
}

#[tokio::test]
async fn test_email_templates() {
    let app = TestApp::new().await;
    let user = create_test_user(&app.pool).await;
    let token = app.generate_token(&user);

    // Create a template
    let template_request = json!({
        "name": "Welcome Email",
        "subject": "Welcome to OrionTel",
        "content": "Hello {name}, welcome to our platform!",
        "variables": {
            "name": "string"
        }
    });

    let response = app
        .client
        .post("/email-templates")
        .header("Authorization", format!("Bearer {}", token))
        .json(&template_request)
        .send()
        .await;

    assert!(response.status().is_success());
    let template = response.json::<serde_json::Value>().await;
    assert_eq!(template["name"], "Welcome Email");

    // List templates
    let response = app
        .client
        .get("/email-templates")
        .header("Authorization", format!("Bearer {}", token))
        .send()
        .await;

    assert!(response.status().is_success());
    let templates = response.json::<Vec<serde_json::Value>>().await;
    assert_eq!(templates.len(), 1);
} 