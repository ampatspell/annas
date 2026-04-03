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
    use std::thread;

    let tx = tx.clone();

    thread::spawn(move || {
        use rpi_pal::gpio::InputPin;
        use std::cell::OnceCell;

        thread_local! {
            static PINS: OnceCell<Vec<InputPin>> = OnceCell::new();
        }

        let pins: Vec<InputPin> = [(4, Pin::Left), (6, Pin::Right)]
            .iter()
            .map(|pair| {
                let pin = pair.0;
                let name = pair.1;
                let tx = tx.clone();
                let mut input = Gpio::new().unwrap().get(pin).unwrap().into_input_pullup();
                println!("{pin} {name:?}");
                input
                    .set_async_interrupt(Trigger::FallingEdge, None, move |event| {
                        println!("{name:?} {event:?}");
                        let message = ChannelMessage::GPIO {
                            gpio: GPIO { pin: name },
                        };
                        match tx.send(message) {
                            Ok(_) => println!("Sent"),
                            Err(err) => println!("Failed to send {err}"),
                        };
                    })
                    .unwrap();

                input
            })
            .collect();

        PINS.with(|cell| {
            cell.set(pins).unwrap();
        });

        thread::park();
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
