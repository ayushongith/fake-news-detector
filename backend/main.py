import sys
import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from loguru import logger
import nltk

from database import engine, Base
from models.ml_model import load_model
from config import settings

from api.auth_routes import router as auth_router
from api.predict_routes import router as predict_router
from api.history_routes import router as history_router
from api.metrics_routes import router as metrics_router

logger.remove()
logger.add(sys.stdout, level="INFO")

limiter = Limiter(key_func=get_remote_address)

app = FastAPI(title="Fake News Detector API", version="1.0.0")

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(predict_router)
app.include_router(history_router)
app.include_router(metrics_router)


@app.on_event("startup")
def on_startup():
    logger.info("Creating database tables...")
    Base.metadata.create_all(bind=engine)

    logger.info("Loading ML model...")
    load_model()

    logger.info("Downloading NLTK data...")
    for resource in ["stopwords", "wordnet", "punkt", "punkt_tab"]:
        try:
            if resource == "punkt_tab":
                nltk.data.find(f"tokenizers/{resource}")
            elif resource == "punkt":
                nltk.data.find(f"tokenizers/{resource}")
            else:
                nltk.data.find(f"corpora/{resource}")
        except LookupError:
            nltk.download(resource, quiet=True)

    logger.info("Startup complete.")


@app.get("/api/health")
def health():
    from models.ml_model import ModelManager
    manager = ModelManager()
    return {
        "status": "healthy",
        "model_loaded": manager.is_loaded(),
    }
