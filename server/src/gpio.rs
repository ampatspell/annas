use std::sync::Arc;

use tokio::sync::broadcast::{Sender, channel};

#[derive(Clone, Debug)]
pub enum Pin {
    Left,
    Right,
}

#[derive(Clone, Debug)]
pub struct GPIO {
    pub pin: Pin,
}

#[derive(Clone, Debug)]
pub enum ChannelMessage {
    GPIO { gpio: GPIO },
}

#[cfg(target_os = "linux")]
pub fn create_gpio_with_channel(tx: &Arc<Sender<ChannelMessage>>) {
    use std::thread;

    let tx = tx.clone();

    thread::spawn(move || {
        use std::time::Duration;

        use rpi_pal::gpio::{Gpio, Trigger};
        let mut left = Gpio::new().unwrap().get(4).unwrap().into_input_pulldown();
        left.set_async_interrupt(
            Trigger::FallingEdge,
            Some(Duration::from_millis(50)),
            move |event| {
                println!("Left {event:?}");
                tx.send(ChannelMessage::GPIO {
                    gpio: GPIO { pin: Pin::Left },
                })
                .unwrap();
            },
        )
        .unwrap();
    })
    .join()
    .unwrap();
}

#[cfg(not(target_os = "linux"))]
pub fn create_gpio_with_channel(_tx: &Sender<ChannelMessage>) {}

pub fn create_gpio() -> Arc<Sender<ChannelMessage>> {
    let (tx, _) = channel::<ChannelMessage>(16);
    let tx = Arc::new(tx);

    create_gpio_with_channel(&tx);

    tx
}
