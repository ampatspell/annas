use axum::{
    http::{StatusCode, header},
    response::IntoResponse,
};
use axum_extra::{TypedHeader, headers::Range};
use axum_range::{KnownSize, Ranged};
use std::fs::read_dir;
use tokio::fs::File;

pub fn load_videos() -> Vec<String> {
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
