#!/bin/bash
# Start actions server in background
python -m rasa_sdk --actions actions --port 5055 &

# Start rasa server in foreground on port 7860
rasa run --enable-api --cors "*" --port 7860 -i 0.0.0.0