# OrionTel Backend API Documentation

## Authentication

### Register a new user
```http
POST /auth/register
Content-Type: application/json

{
    "username": "string",
    "email": "string",
    "password": "string",
    "role": "admin|manager|user"
}
```

### Login
```http
POST /auth/login
Content-Type: application/json

{
    "username": "string",
    "password": "string"
}
```

### Get current user
```http
GET /auth/me
Authorization: Bearer <token>
```

## System Monitoring

### Get system metrics
```http
GET /metrics
Authorization: Bearer <token>

Response:
{
    "cpu_usage": float,
    "ram_usage": float,
    "swap_usage": float,
    "disk_usage": {
        "total": integer,
        "used": integer,
        "free": integer,
        "mount_point": string
    }
}
```

### Store system metrics
```http
POST /metrics
Authorization: Bearer <token>
Content-Type: application/json

{
    "cpu_usage": float,
    "ram_usage": float,
    "swap_usage": float,
    "disk_usage": object
}
```

### Get system status
```http
GET /status
Authorization: Bearer <token>

Response:
{
    "metrics": object,
    "uptime": integer,
    "load_average": [float],
    "process_count": integer
}
```

## PBX Management

### Create extension
```http
POST /extensions
Authorization: Bearer <token>
Content-Type: application/json

{
    "extension_number": "string",
    "name": "string",
    "extension_type": "sip|iax|custom",
    "config_data": object
}
```

### Get extension
```http
GET /extensions/:id
Authorization: Bearer <token>
```

### List extensions
```http
GET /extensions
Authorization: Bearer <token>
```

### Update extension
```http
PUT /extensions/:id
Authorization: Bearer <token>
Content-Type: application/json

{
    "name": "string",
    "extension_type": "sip|iax|custom",
    "config_data": object
}
```

### Delete extension
```http
DELETE /extensions/:id
Authorization: Bearer <token>
```

## Call Management

### Create call record
```http
POST /calls
Authorization: Bearer <token>
Content-Type: application/json

{
    "caller_id": "string",
    "recipient_id": "string",
    "start_time": "datetime",
    "status": "active|completed|failed|busy|noanswer"
}
```

### Get call record
```http
GET /calls/:id
Authorization: Bearer <token>
```

### Update call record
```http
PUT /calls/:id
Authorization: Bearer <token>
Content-Type: application/json

{
    "end_time": "datetime",
    "duration": integer,
    "status": "completed|failed|busy|noanswer",
    "recording_path": "string"
}
```

### List call records
```http
GET /calls?limit=100&offset=0
Authorization: Bearer <token>
```

### Get active calls
```http
GET /calls/active
Authorization: Bearer <token>
```

## Response Formats

### Success Response
```json
{
    "data": object|array,
    "meta": {
        "timestamp": "datetime",
        "version": "string"
    }
}
```

### Error Response
```json
{
    "error": {
        "message": "string",
        "code": integer
    }
}
```

## Authentication

All endpoints except `/auth/login` and `/auth/register` require authentication using JWT tokens.
Include the token in the Authorization header as follows:

```http
Authorization: Bearer <your_jwt_token>
```

## Rate Limiting

The API implements rate limiting to prevent abuse:
- 100 requests per minute for authenticated users
- 20 requests per minute for unauthenticated users

## Pagination

List endpoints support pagination using `limit` and `offset` query parameters:
- `limit`: Maximum number of items to return (default: 100)
- `offset`: Number of items to skip (default: 0)

## Versioning

The API version is included in all response headers:
```http
X-API-Version: 1.0
``` 