#!/bin/bash
set -e
python -m nltk.downloader punkt_tab stopwords -q
python training/train.py
python -m uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}
