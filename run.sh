#!/bin/bash

DISPLAY=:0 chromium \
  --kiosk \
  --start-fullscreen \
  --autoplay-policy=no-user-gesture-required \
  "http://localhost:5173"
