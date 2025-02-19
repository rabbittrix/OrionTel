# OrionTel Backend

The OrionTel backend is a robust telecommunications system built with Rust, providing PBX management, call tracking, and system monitoring capabilities.

## Features

- User authentication and authorization
- PBX extension management
- Call record tracking
- System resource monitoring
- RESTful API with comprehensive documentation
- PostgreSQL database integration
- Docker containerization

## Prerequisites

- Rust 1.76 or later
- PostgreSQL 16 or later
- Docker and Docker Compose (for containerized deployment)

## Development Setup

1. Clone the repository:
```bash
git clone https://github.com/your-org/oriontel.git
cd oriontel/backend
```

2. Create a `.env` file:
```bash
cp .env.example .env
```

3. Update the environment variables in `.env`:
```env
DATABASE_URL=postgres://oriontel:oriontel@localhost:5432/oriontel
JWT_SECRET=your-secret-key
RUST_LOG=info
```

4. Install development dependencies:
```bash
# Install PostgreSQL (Ubuntu/Debian)
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib

# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

5. Set up the database:
```bash
# Create database and user
sudo -u postgres psql
postgres=# CREATE USER oriontel WITH PASSWORD 'oriontel';
postgres=# CREATE DATABASE oriontel;
postgres=# GRANT ALL PRIVILEGES ON DATABASE oriontel TO oriontel;

# Apply database schema
psql -U oriontel -d oriontel -f database/schema.sql
```

6. Build and run the project:
```bash
# Development build
cargo build

# Run with hot reloading
cargo watch -x run

# Run tests
cargo test
```

## Docker Deployment

1. Build and run with Docker Compose:
```bash
docker-compose up --build
```

2. The services will be available at:
- Backend API: http://localhost:8080
- PostgreSQL: localhost:5432

## Project Structure

```
backend/
├── src/
│   ├── api/           # API endpoints
│   ├── models/        # Data models
│   ├── services/      # Business logic
│   ├── middleware/    # Request middleware
│   ├── error.rs       # Error handling
│   └── main.rs        # Application entry point
├── database/
│   └── schema.sql     # Database schema
├── tests/             # Integration tests
├── Cargo.toml         # Project dependencies
├── Dockerfile         # Container configuration
└── API.md            # API documentation
```

## API Documentation

See [API.md](API.md) for detailed API documentation.

## Testing

Run the test suite:
```bash
# Run all tests
cargo test

# Run specific test
cargo test test_name

# Run with logging
RUST_LOG=debug cargo test
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 