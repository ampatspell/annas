#!/bin/bash

DISPLAY=:0 chromium \
  --kiosk \
  --start-fullscreen \
  --autoplay-policy=no-user-gesture-required \
  --disable-infobars \
  --noerrdialogs \
  --app="http://localhost:3000"
