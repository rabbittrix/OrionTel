# Use the official Rust image as the base
FROM rust:1.69

# Set the working directory
WORKDIR /app

# Copy the Cargo manifest
COPY Cargo.toml .

# Copy the source code
COPY src ./src

# Build the application
RUN cargo build --release

# Expose the port
EXPOSE 9000

# Run the application
CMD ["cargo", "run", "--release"]