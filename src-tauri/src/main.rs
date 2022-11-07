#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use serde::Serialize;

#[derive(Serialize)]
struct PingResponse {
    status: String,
    text: String,
    url: String,
}

impl PingResponse {
    fn new(status: String, text: String, url: String) -> Self {
        PingResponse { status, text, url }
    }
}

#[tauri::command]
fn client_ping(url: &str) -> Result<PingResponse, String> {
    let response = reqwest::blocking::get(url).map_err(|e| e.to_string())?;

    let status = response.status().to_string();
    let url = response.url().to_string();
    let text = response.text().map_err(|e| e.to_string())?;
    Ok(PingResponse::new(status, text, url))
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![client_ping])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
