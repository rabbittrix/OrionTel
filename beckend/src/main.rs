use chrono;
use env_logger;
use log::{error, info};
use tokio::io::{AsyncReadExt, AsyncWriteExt};
use tokio::net::TcpListener;

fn log_call(addr: &str, message: &str) {
    let timestamp = chrono::Local::now().format("%Y-%m-%d %H:%M:%S");
    info!("[{}] Received call from {}: {}", timestamp, addr, message);
}

#[tokio::main]
async fn main() {
    // Initialize logger
    env_logger::init();

    info!("Starting OrionTel Backend...");

    // Bind the server to localhost:9000
    let listener = match TcpListener::bind("127.0.0.1:9000").await {
        Ok(listener) => listener,
        Err(e) => {
            error!("Failed to bind to port: {}", e);
            return; // Exit gracefully if binding fails
        }
    };

    info!("Listening on 127.0.0.1:9000");

    loop {
        match listener.accept().await {
            Ok((mut socket, addr)) => {
                info!("New connection from {}", addr);

                tokio::spawn(async move {
                    let mut buffer = [0; 1024];

                    // Read data from the socket
                    match socket.read(&mut buffer).await {
                        Ok(n) if n == 0 => return,
                        Ok(n) => {
                            let message = String::from_utf8_lossy(&buffer[..n]);
                            info!("Received message: {}", message);
                            log_call(&addr.to_string(), &message);

                            // Simple routing logic
                            if message.trim() == "call:123" {
                                let response = "Call routed to extension 123\n";
                                if let Err(e) = socket.write_all(response.as_bytes()).await {
                                    error!("Failed to write to socket: {}", e);
                                }
                            } else {
                                let response = "Unknown command\n";
                                if let Err(e) = socket.write_all(response.as_bytes()).await {
                                    error!("Failed to write to socket: {}", e);
                                }
                            }
                        }
                        Err(e) => {
                            error!("Failed to read from socket: {}", e);
                        }
                    }
                });
            }
            Err(e) => {
                error!("Error accepting connection: {}", e);
            }
        }
    }
}
