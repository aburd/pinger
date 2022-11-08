#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod config;
mod ping;

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            ping::ping_client,
            ping::ping_get_all,
            ping::ping_update,
            ping::ping_new
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
