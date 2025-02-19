# Build stage
FROM rust:1.76 as builder

WORKDIR /usr/src/app
COPY . .

# Install build dependencies
RUN apt-get update && apt-get install -y \
    pkg-config \
    libssl-dev \
    && rm -rf /var/lib/apt/lists/*

# Build the application
RUN cargo build --release

# Runtime stage
FROM debian:bookworm-slim

WORKDIR /usr/local/bin

# Install runtime dependencies
RUN apt-get update && apt-get install -y \
    ca-certificates \
    libssl3 \
    && rm -rf /var/lib/apt/lists/*

# Copy the built binary
COPY --from=builder /usr/src/app/target/release/oriontel-backend .

# Copy configuration files
COPY --from=builder /usr/src/app/.env .

# Expose the port the app runs on
EXPOSE 8080

# Run the binary
CMD ["./oriontel-backend"] 