#!/bin/bash
cd backend
python training/run_training.py
uvicorn main:app --host 0.0.0.0 --port $PORT
