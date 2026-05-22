#!/bin/bash
cd "$(dirname "$0")"
echo "Starting E-Commerce Backend Server..."
python -m uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
