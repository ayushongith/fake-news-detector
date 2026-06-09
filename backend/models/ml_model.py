import os
import joblib
from loguru import logger
from config import settings


class ModelManager:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance.pipeline = None
        return cls._instance

    def load(self, model_path: str = None):
        path = model_path or settings.MODEL_PATH
        if not os.path.exists(path):
            logger.warning(f"Model file not found at {path}")
            self.pipeline = None
            return
        self.pipeline = joblib.load(path)
        logger.info(f"Model loaded from {path}")

    def is_loaded(self) -> bool:
        return self.pipeline is not None

    def get_pipeline(self):
        return self.pipeline


def load_model():
    manager = ModelManager()
    manager.load()
    return manager
