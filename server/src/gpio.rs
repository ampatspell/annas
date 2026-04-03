use std::sync::Arc;

use tokio::sync::broadcast::{Sender, channel};

#[derive(Clone, Debug, Copy)]
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
    use rpi_pal::gpio::{Gpio, Trigger};
    use std::time::Duration;

    for (pin, name) in [(4, Pin::Left), (6, Pin::Right)] {
        let tx = tx.clone();
        let mut input = Gpio::new().unwrap().get(pin).unwrap().into_input_pullup();
        println!("{pin} {name:?}");
        input
            .set_async_interrupt(
                Trigger::FallingEdge,
                Some(Duration::from_millis(50)),
                move |event| {
                    println!("{name:?} {event:?}");
                    tx.send(ChannelMessage::GPIO {
                        gpio: GPIO { pin: name },
                    })
                    .unwrap();
                },
            )
            .unwrap();
    }
}

#[cfg(not(target_os = "linux"))]
pub fn create_gpio_with_channel(_tx: &Sender<ChannelMessage>) {}

pub fn create_gpio() -> Arc<Sender<ChannelMessage>> {
    let (tx, _) = channel::<ChannelMessage>(16);
    let tx = Arc::new(tx);

    create_gpio_with_channel(&tx);

    tx
}
