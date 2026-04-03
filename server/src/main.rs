use axum::{
    Json, Router,
    extract::Path,
    http::{
        HeaderValue, StatusCode,
        header::{self, AUTHORIZATION, CONTENT_TYPE},
    },
    response::IntoResponse,
    routing::get,
};
use axum_extra::{TypedHeader, headers::Range};
use axum_range::{KnownSize, Ranged};
use std::fs::read_dir;
use tokio::fs::File;
use tower_http::cors::{Any, CorsLayer};

fn load_videos() -> Vec<String> {
    let paths = read_dir("../videos").unwrap();
    let names = paths
        .into_iter()
        .map(|f| f.unwrap().file_name().display().to_string())
        .collect::<Vec<String>>();

    names
}

pub async fn get_video_stream(id: String, range: Option<TypedHeader<Range>>) -> impl IntoResponse {
    let path = format!("../videos/{id}");

    let file = match File::open(&path).await {
        Ok(file) => file,
        Err(err) => return Err((StatusCode::NOT_FOUND, format!("File not found: {}", err))),
    };

    let content_type = match mime_guess::from_path(&path).first_raw() {
        Some(mime) => mime,
        None => {
            return Err((
                StatusCode::BAD_REQUEST,
                "MIME Type couldn't be determined".to_string(),
            ));
        }
    };

    let body = KnownSize::file(file).await.unwrap();
    let range = range.map(|TypedHeader(range)| range);

    Ok((
        [(header::CONTENT_TYPE, content_type)],
        Ranged::new(range, body),
    ))
}

async fn index() -> Json<Vec<String>> {
    let videos = load_videos();
    Json(videos)
}

async fn get_video(Path(id): Path<String>, range: Option<TypedHeader<Range>>) -> impl IntoResponse {
    let res = get_video_stream(id, range).await;
    res
}

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt::init();

    let cors_layer = CorsLayer::new()
        .allow_methods(Any)
        .allow_origin("*".parse::<HeaderValue>().unwrap())
        .allow_headers([AUTHORIZATION, CONTENT_TYPE]);

    let app = Router::new()
        .route("/", get(index))
        .route("/videos/{id}", get(get_video))
        .layer(cors_layer);

    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000").await.unwrap();
    axum::serve(listener, app).await.unwrap();
}
