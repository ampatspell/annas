#[cfg(target_os = "linux")]
pub fn create_webcam() {
    use std::{
        process::Command,
        thread::{self, spawn},
        time::Duration,
    };
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

#[cfg(not(target_os = "linux"))]
pub fn create_webcam() {}
