#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

#[tauri::command]
fn client_ping(url: &str) -> Result<String, String> {
    let response = reqwest::blocking::get(url).map_err(|e| e.to_string())?;
    response.text().map_err(|e| e.to_string())
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![client_ping])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
