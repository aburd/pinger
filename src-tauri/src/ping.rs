use crate::config::Config;
use serde::{Deserialize, Serialize};
use std::convert::TryFrom;
use std::fs::{File, OpenOptions};
use std::io::{Read, Write};

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

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct PingItem {
    id: usize,
    name: String,
    url: String,
    interval_ms: u64,
    timeout_m: f64,
}

impl PingItem {
    pub fn save(&self, config: &Config) -> Result<(), String> {
        let items: Vec<_> = PingItem::load_all(config)?;
        let new_items: Vec<_> = items
            .iter()
            .map(|i| {
                if i.id == self.id {
                    self.to_owned()
                } else {
                    i.to_owned()
                }
            })
            .collect();
        PingItem::write_all(&new_items)?;
        Ok(())
    }
}

impl PingItem {
    fn new(id: usize) -> Self {
        PingItem {
            id,
            name: id.to_string(),
            url: "http://".to_string(),
            interval_ms: 1000,
            timeout_m: 0.1,
        }
    }

    pub fn write_all(items: &[PingItem]) -> Result<(), String> {
        let config = Config::load()?;
        let mut f = PingItem::ping_file_write(&config)?;
        let s = serde_json::to_string(items).map_err(|e| e.to_string())?;
        f.write_all(s.as_bytes()).map_err(|e| e.to_string())?;
        Ok(())
    }

    pub fn load_all(c: &Config) -> Result<Vec<PingItem>, String> {
        if let Ok(mut f) = Self::ping_file_read(c) {
            let mut buf = String::new();
            f.read_to_string(&mut buf).map_err(|e| e.to_string())?;
            return serde_json::from_str::<Vec<PingItem>>(&buf).map_err(|e| e.to_string());
        }
        Self::init_pings_json_file(c)
    }

    fn init_pings_json_file(c: &Config) -> Result<Vec<PingItem>, String> {
        let mut f = File::create(c.app_dir.join("pings.json"))
            .map_err(|e| format!("Could not create file: {}", e))?;
        let empty_items: Vec<PingItem> = vec![];
        let s = serde_json::to_string(&empty_items).map_err(|e| e.to_string())?;
        f.write_all(s.as_bytes()).map_err(|e| e.to_string())?;
        Ok(empty_items)
    }

    pub fn add_one(config: &Config) -> Result<PingItem, String> {
        let mut items: Vec<_> = PingItem::load_all(config)?;
        let ping_item = PingItem::new(items.len());
        items.push(ping_item.clone());
        PingItem::write_all(&items)?;

        Ok(ping_item)
    }

    fn ping_file_read(config: &Config) -> Result<File, String> {
        let p = config.app_dir.join("pings.json");
        OpenOptions::new()
            .read(true)
            .open(p)
            .map_err(|e| format!("error opening file: {}", e))
    }

    fn ping_file_write(config: &Config) -> Result<File, String> {
        let p = config.app_dir.join("pings.json");
        OpenOptions::new()
            .write(true)
            .create(true)
            .truncate(true)
            .open(p)
            .map_err(|e| e.to_string())
    }
}

impl TryFrom<&str> for PingItem {
    type Error = String;

    fn try_from(s: &str) -> Result<Self, Self::Error> {
        serde_json::from_str(s).map_err(|e| e.to_string())
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
pub fn ping_update(ping: PingItem) -> Result<(), String> {
    let c = Config::load()?;
    ping.save(&c)?;
    Ok(())
}

#[tauri::command]
pub fn ping_get_all() -> Result<Vec<PingItem>, String> {
    let c = Config::load()?;
    PingItem::load_all(&c)
}

#[tauri::command]
pub fn ping_new() -> Result<PingItem, String> {
    let c = Config::load()?;
    PingItem::add_one(&c).map_err(|e| {
        eprintln!("Error making new ping: {}", e);
        e
    })
}
