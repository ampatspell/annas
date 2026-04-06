#!/bin/bash

# --kiosk \
DISPLAY=:0 chromium \
  --start-fullscreen \
  --autoplay-policy=no-user-gesture-required \
  --disable-infobars \
  --noerrdialogs \
  --app="http://localhost:3000"
