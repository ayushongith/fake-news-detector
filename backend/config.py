import os
from pydantic_settings import BaseSettings
from typing import Optional

BACKEND_DIR = os.path.dirname(os.path.abspath(__file__))


class Settings(BaseSettings):
    DATABASE_URL: str = ""
    SECRET_KEY: str = "change-this-secret-key-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    MODEL_PATH: str = os.path.join(BACKEND_DIR, "models", "best_model.pkl")
    METRICS_PATH: str = os.path.join(BACKEND_DIR, "models", "evaluation_results.json")
    RATE_LIMIT: str = "10/minute"

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

    def get_database_url(self) -> str:
        if self.DATABASE_URL:
            return self.DATABASE_URL
        sqlite_path = os.path.join(BACKEND_DIR, "fake_news.db")
        return f"sqlite:///{sqlite_path}"


settings = Settings()
