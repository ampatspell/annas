use std::sync::Arc;

use axum::{
    Json, Router,
    extract::{
        Path, State, WebSocketUpgrade,
        ws::{Message, WebSocket},
    },
    http::{
        HeaderValue,
        header::{AUTHORIZATION, CONTENT_TYPE},
    },
    response::IntoResponse,
    routing::{any, get},
};
use axum_extra::{TypedHeader, headers::Range};
use tokio::{net::TcpListener, sync::broadcast::Sender};
use tower_http::cors::{Any, CorsLayer};

use crate::{
    gpio::{ChannelMessage, create_gpio},
    video::{get_video_stream, load_videos},
};

pub mod gpio;
pub mod video;

#[derive(Clone)]
struct AppState {
    tx: Arc<Sender<ChannelMessage>>,
}

impl AppState {}

async fn index() -> Json<Vec<String>> {
    let videos = load_videos();
    Json(videos)
}

async fn get_video(Path(id): Path<String>, range: Option<TypedHeader<Range>>) -> impl IntoResponse {
    let res = get_video_stream(id, range).await;
    res
}

async fn handle_websocket(mut socket: WebSocket, state: AppState) {
    let mut rx = state.tx.subscribe();

    let text = Message::Text(format!("Hey there").into());
    match socket.send(text).await {
        Err(error) => println!("Error sending welcome {error}"),
        _ => {}
    }

    loop {
        let message = rx.recv().await;
        match message {
            Ok(message) => match message {
                ChannelMessage::GPIO { gpio } => {
                    let pin = gpio.pin;
                    let text = Message::Text(format!("GPIO {pin:?}").into());
                    match socket.send(text).await {
                        Err(error) => println!("Error sending message {error}"),
                        _ => {}
                    }
                }
            },
            Err(_) => {
                println!("Error receiving message");
            }
        }
    }
}

async fn websocket(ws: WebSocketUpgrade, State(state): State<AppState>) -> impl IntoResponse {
    ws.on_upgrade(move |socket| handle_websocket(socket, state))
}

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt::init();

    let tx = create_gpio();

    let cors_layer = CorsLayer::new()
        .allow_methods(Any)
        .allow_origin("*".parse::<HeaderValue>().unwrap())
        .allow_headers([AUTHORIZATION, CONTENT_TYPE]);

    let app = Router::new()
        .route("/", get(index))
        .route("/videos/{id}", get(get_video))
        .route("/ws", any(websocket))
        .layer(cors_layer)
        .with_state(AppState { tx });

    let listener = TcpListener::bind("0.0.0.0:3000").await.unwrap();
    println!("Listening on {:?}", listener.local_addr().unwrap());
    axum::serve(listener, app).await.unwrap();
}
