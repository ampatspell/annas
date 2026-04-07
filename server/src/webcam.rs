use std::{
    process::Command,
    thread::{self, spawn},
    time::Duration,
};

pub fn create_webcam() {
    spawn(|| {
        loop {
            let _ = Command::new("python3")
                .env("PATH", "/usr/bin")
                .arg("src/server.py")
                .output()
                .unwrap();

            thread::sleep(Duration::from_millis(10000));
        }
    });
}
