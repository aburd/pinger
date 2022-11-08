use crate::config::Config;
use serde::{Deserialize, Serialize};

#[derive(Serialize)]
pub struct PingResponse {
    status: String,
    text: String,
    url: String,
}

impl PingResponse {
    fn new(status: String, text: String, url: String) -> Self {
        PingResponse { status, text, url }
    }
}

#[derive(Serialize, Deserialize)]
pub struct PingItem {
    id: usize,
    name: String,
    url: String,
    interval_ms: u64,
    timeout_m: f64,
}

impl PingItem {
    pub fn save(config: &Config) -> Result<(), String> {
        unimplemented!("Not implemented")
    }

    pub fn load(config: &Config) -> Result<(), String> {
        unimplemented!("Not implemented")
    }
}

#[tauri::command]
pub fn ping_client(url: &str) -> Result<PingResponse, String> {
    let response = reqwest::blocking::get(url).map_err(|e| e.to_string())?;

    let status = response.status().to_string();
    let url = response.url().to_string();
    let text = response.text().map_err(|e| e.to_string())?;
    Ok(PingResponse::new(status, text, url))
}

#[tauri::command]
pub fn update() -> Result<(), String> {
    unimplemented!("update ping items")
}

#[tauri::command]
pub fn get() -> Result<(), String> {
    unimplemented!("get ping items")
}
