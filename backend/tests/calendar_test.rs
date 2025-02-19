use chrono::{Duration, Utc};
use serde_json::json;
use uuid::Uuid;

mod helpers;
use helpers::{app::TestApp, auth::create_test_user};

use oriontel_backend::models::calendar::{
    CreateEventRequest, EventStatus, EventType, ReminderRequest, ReminderType,
    UpdateEventRequest,
};

#[tokio::test]
async fn test_create_event() {
    let app = TestApp::new().await;
    let user = create_test_user(&app.pool).await;
    let token = app.generate_token(&user);

    let start_time = Utc::now() + Duration::hours(1);
    let end_time = start_time + Duration::hours(2);

    let request = CreateEventRequest {
        title: "Team Meeting".to_string(),
        description: Some("Weekly team sync".to_string()),
        start_time,
        end_time,
        attendees: vec![Uuid::new_v4()],
        location: Some("Conference Room A".to_string()),
        event_type: EventType::Meeting,
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
            "agenda": ["Project updates", "Action items"],
            "required_resources": ["Projector"]
        })),
    };

    let response = app
        .client
        .post(&format!("{}/events", &app.address))
        .header("Authorization", format!("Bearer {}", token))
        .json(&request)
        .send()
        .await
        .unwrap();

    assert_eq!(response.status(), 200);

    let event = response.json::<oriontel_backend::models::calendar::EventResponse>().await.unwrap();
    assert_eq!(event.event.title, request.title);
    assert_eq!(event.event.description, request.description);
    assert_eq!(event.event.start_time, request.start_time);
    assert_eq!(event.event.end_time, request.end_time);
    assert_eq!(event.event.location, request.location);
    assert_eq!(event.event.event_type, request.event_type);
    assert_eq!(event.event.creator_id, user.id);
    assert_eq!(event.creator.id, user.id);
    assert_eq!(event.creator.username, user.username);
    assert_eq!(event.creator.email, user.email);
}

#[tokio::test]
async fn test_get_event() {
    let app = TestApp::new().await;
    let user = create_test_user(&app.pool).await;
    let token = app.generate_token(&user);

    // Create an event first
    let event = app.create_test_event(&user).await;

    let response = app
        .client
        .get(&format!("{}/events/{}", &app.address, event.event.id))
        .header("Authorization", format!("Bearer {}", token))
        .send()
        .await
        .unwrap();

    assert_eq!(response.status(), 200);

    let fetched_event = response.json::<oriontel_backend::models::calendar::EventResponse>().await.unwrap();
    assert_eq!(fetched_event.event.id, event.event.id);
    assert_eq!(fetched_event.event.title, event.event.title);
}

#[tokio::test]
async fn test_list_events() {
    let app = TestApp::new().await;
    let user = create_test_user(&app.pool).await;
    let token = app.generate_token(&user);

    // Create multiple events
    let start_base = Utc::now();
    for i in 0..3 {
        let start_time = start_base + Duration::hours(i * 2);
        let end_time = start_time + Duration::hours(1);
        app.create_test_event_with_time(&user, start_time, end_time).await;
    }

    let response = app
        .client
        .get(&format!(
            "{}/events?start_date={}&end_date={}",
            &app.address,
            start_base.to_rfc3339(),
            (start_base + Duration::hours(6)).to_rfc3339()
        ))
        .header("Authorization", format!("Bearer {}", token))
        .send()
        .await
        .unwrap();

    assert_eq!(response.status(), 200);

    let events = response.json::<Vec<oriontel_backend::models::calendar::EventResponse>>().await.unwrap();
    assert_eq!(events.len(), 3);
}

#[tokio::test]
async fn test_update_event() {
    let app = TestApp::new().await;
    let user = create_test_user(&app.pool).await;
    let token = app.generate_token(&user);

    // Create an event first
    let event = app.create_test_event(&user).await;

    let update_request = UpdateEventRequest {
        title: Some("Updated Meeting".to_string()),
        description: Some("Updated description".to_string()),
        start_time: None,
        end_time: None,
        attendees: None,
        location: Some("Updated location".to_string()),
        event_type: None,
        status: Some(EventStatus::Rescheduled),
        recurrence: None,
        reminders: None,
        metadata: None,
    };

    let response = app
        .client
        .put(&format!("{}/events/{}", &app.address, event.event.id))
        .header("Authorization", format!("Bearer {}", token))
        .json(&update_request)
        .send()
        .await
        .unwrap();

    assert_eq!(response.status(), 200);

    let updated_event = response.json::<oriontel_backend::models::calendar::EventResponse>().await.unwrap();
    assert_eq!(updated_event.event.id, event.event.id);
    assert_eq!(updated_event.event.title, update_request.title.unwrap());
    assert_eq!(updated_event.event.description, update_request.description);
    assert_eq!(updated_event.event.location, update_request.location);
    assert_eq!(updated_event.event.status, update_request.status.unwrap());
}

#[tokio::test]
async fn test_delete_event() {
    let app = TestApp::new().await;
    let user = create_test_user(&app.pool).await;
    let token = app.generate_token(&user);

    // Create an event first
    let event = app.create_test_event(&user).await;

    let response = app
        .client
        .delete(&format!("{}/events/{}", &app.address, event.event.id))
        .header("Authorization", format!("Bearer {}", token))
        .send()
        .await
        .unwrap();

    assert_eq!(response.status(), 200);

    // Verify the event is deleted
    let get_response = app
        .client
        .get(&format!("{}/events/{}", &app.address, event.event.id))
        .header("Authorization", format!("Bearer {}", token))
        .send()
        .await
        .unwrap();

    assert_eq!(get_response.status(), 404);
}

#[tokio::test]
async fn test_get_metrics() {
    let app = TestApp::new().await;
    let user = create_test_user(&app.pool).await;
    let token = app.generate_token(&user);

    // Create events of different types
    let start_base = Utc::now();
    for i in 0..3 {
        let start_time = start_base + Duration::hours(i * 2);
        let end_time = start_time + Duration::hours(1);
        app.create_test_event_with_type(
            &user,
            start_time,
            end_time,
            if i % 2 == 0 { EventType::Meeting } else { EventType::Task },
        ).await;
    }

    let response = app
        .client
        .get(&format!(
            "{}/events/metrics?start_date={}&end_date={}",
            &app.address,
            start_base.to_rfc3339(),
            (start_base + Duration::hours(6)).to_rfc3339()
        ))
        .header("Authorization", format!("Bearer {}", token))
        .send()
        .await
        .unwrap();

    assert_eq!(response.status(), 200);

    let metrics = response.json::<oriontel_backend::models::calendar::CalendarMetrics>().await.unwrap();
    assert_eq!(metrics.total_events, 3);
    assert!(metrics.events_by_type.get("meeting").is_some());
    assert!(metrics.events_by_type.get("task").is_some());
} 