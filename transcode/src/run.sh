#!/bin/sh

echo "$1 -> $2"

ffmpeg -i $1 -vf "scale=1280:720:-1" -c:v libx264 -crf 23 -an $2
