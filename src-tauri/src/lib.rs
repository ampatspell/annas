use std::fs::read_dir;

use actix_files::Files;
use actix_web::{get, App, HttpResponse, HttpServer, Responder};

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[get("/")]
async fn hello() -> impl Responder {
    let paths = read_dir("../videos").unwrap();
    let names = paths
        .into_iter()
        .map(|f| f.unwrap().file_name().display().to_string())
        .collect::<Vec<String>>();

    let json = serde_json::to_string_pretty(&names).unwrap();

    HttpResponse::Ok()
        .content_type("application/json")
        .body(json)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            #[cfg(debug_assertions)] // only include this code on debug builds
            {
                use tauri::Manager;
                let window = app.get_webview_window("main").unwrap();
                window.open_devtools();
            }

            tauri::async_runtime::spawn(
                HttpServer::new(|| {
                    App::new().service(hello).service(
                        Files::new("/videos", "../videos")
                            .show_files_listing()
                            .use_last_modified(true),
                    )
                })
                .bind(("127.0.0.1", 9000))
                .unwrap()
                .run(),
            );
            Ok(())
        })
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
