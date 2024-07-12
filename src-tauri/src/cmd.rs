use httparse;
use httparse::Request;
use std::{
    borrow::Cow,
    io::{Read, Write},
    net::{SocketAddr, TcpListener, TcpStream},
    sync::{Arc, Mutex},
};
use lazy_static::lazy_static;
use tauri::async_runtime::JoinHandle;
use tauri::async_runtime::spawn;


const EXIT: [u8; 4] = [1, 3, 3, 7];

lazy_static! {
    static ref SET_TOKEN: Arc<Mutex<Option<String>>> = Arc::new(Mutex::new(None));
    static ref TASK_HANDLE: Arc<Mutex<Option<JoinHandle<()>>>> = Arc::new(Mutex::new(None));
}

/// OAuth configuration struct.
#[derive(Default, serde::Deserialize)]
pub struct OauthConfig {
    /// An array of hard-coded ports the server should try to bind to.
    /// This should only be used if your OAuth provider does not accept wildcard localhost addresses.
    ///
    /// Default: Asks the system for a free port.
    pub ports: Option<Vec<u16>>,
    /// Optional static HTML string sent to the user after being redirected.
    /// Keep it self-contained and as small as possible.
    ///
    /// Default: `"<html><body>Please return to the app.</body></html>"`.
    pub response: Option<Cow<'static, str>>,
}

/// Starts the OAuth server with the provided configuration.
pub fn start_with_config(
    config: OauthConfig,
) -> Result<u16, std::io::Error> {
    let listener = match config.ports {
        Some(ports) => TcpListener::bind(
            ports
                .iter()
                .map(|p| SocketAddr::from(([127, 0, 0, 1], *p)))
                .collect::<Vec<SocketAddr>>()
                .as_slice(),
        ),
        None => TcpListener::bind(SocketAddr::from(([127, 0, 0, 1], 0))),
    }?;

    let port = listener.local_addr()?.port();

    let handle = tauri::async_runtime::spawn(async move {
        for conn in listener.incoming() {
            match conn {
                Ok(conn) => {
                    if let Some(url) = handle_connection(conn, config.response.as_deref(), port) {
                        // Using an empty string to communicate that a shutdown was requested.
                        if !url.is_empty() {
                            // Set global URL
                            let mut token = SET_TOKEN.lock().unwrap();
                            *token = Some(url);
                        }
                        // Exit the loop to stop the server
                        break;
                    }
                }
                Err(err) => {
                    println!("Error reading incoming connection: {}", err.to_string());
                }
            }
        }
    });

    let mut task_handle = TASK_HANDLE.lock().unwrap();
    *task_handle = Some(handle);

    Ok(port)
}

fn handle_connection(mut conn: TcpStream, response: Option<&str>, port: u16) -> Option<String> {
    let mut buffer = [0; 4048];
    if let Err(io_err) = conn.read(&mut buffer) {
        println!("Error reading incoming connection: {}", io_err.to_string());
    };

    let mut headers = [httparse::EMPTY_HEADER; 16];
    let mut request = httparse::Request::new(&mut headers);
    request.parse(&buffer).ok()?;

    let path = request.path.unwrap_or_default();

    if path == "/exit" {
        return Some(String::new());
    };

    let mut is_localhost = false;

    for header in &headers {
        if header.name == "Full-Url" {
            return Some(String::from_utf8_lossy(header.value).to_string());
        } else if header.name == "Host" {
            is_localhost = String::from_utf8_lossy(header.value).starts_with("localhost");
        }
    }
    if path == "/cb" {
        println!(
            "Client fetched callback path but the request didn't contain the expected header."
        );
    }

    let script = format!(
        r#"<script>fetch("http://{}:{}/cb",{{headers:{{"Full-Url":window.location.href}}}})</script>"#,
        if is_localhost {
            "localhost"
        } else {
            "127.0.0.1"
        },
        port
    );
    let response = match response {
        Some(s) if s.contains("<head>") => s.replace("<head>", &format!("<head>{}", script)),
        Some(s) if s.contains("<body>") => {
            s.replace("<body>", &format!("<head>{}</head><body>", script))
        }
        Some(s) => {
            println!(
                "`response` does not contain a body or head element. Prepending a head element..."
            );
            format!("<head>{}</head>{}", script, s)
        }
        None => format!(
            "<html><head>{}</head><body>Please return to the app.</body></html>",
            script
        ),
    };

    // TODO: Test if unwrapping here is safe (enough).
    conn.write_all(
        format!(
            "HTTP/1.1 200 OK\r\nContent-Length: {}\r\n\r\n{}",
            response.len(),
            response
        )
        .as_bytes(),
    )
    .unwrap();
    conn.flush().unwrap();

    None
}

/// Cancels the currently running server task.
pub async fn cancel_listen() -> Result<(), String> {
    let mut task_handle = TASK_HANDLE.lock().unwrap();
    if let Some(handle) = task_handle.take() {
        handle.abort();
        Ok(())
    } else {
        Err("No running server to cancel.".to_string())
    }
}

#[tauri::command]
pub fn oauth_start(app: tauri::AppHandle, config: Option<OauthConfig>) -> Result<u16, String> {
    let config = config.unwrap_or_default();
    // Clean up the global token
    SET_TOKEN.lock().unwrap().take();

    start_with_config(config).map_err(|err| err.to_string())
}

#[tauri::command]
pub async fn oauth_cancel() -> Result<(), String> {
    cancel_listen().await
}

#[tauri::command]
pub fn oauth_check() -> Result<Option<String>, String> {
    // Retrieve global token
    let token = SET_TOKEN.lock().map_err(|e| e.to_string())?;
    Ok(token.clone())
}
