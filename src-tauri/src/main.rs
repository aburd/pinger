#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod config;
mod ping;

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![ping::client_ping])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
