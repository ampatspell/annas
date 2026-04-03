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
pub fn create_gpio_with_channel(tx: &Sender<ChannelMessage>) {}

#[cfg(not(target_os = "linux"))]
pub fn create_gpio_with_channel(_tx: &Sender<ChannelMessage>) {}

pub fn create_gpio() -> Sender<ChannelMessage> {
    let (tx, _) = channel::<ChannelMessage>(16);
    create_gpio_with_channel(&tx);

    tx
}
