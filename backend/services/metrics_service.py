import json
import os
from collections import Counter
from datetime import datetime, timedelta
from typing import List, Dict, Any

import numpy as np
from sqlalchemy.orm import Session
from sqlalchemy import func

from config import settings
from models.prediction import Prediction


def get_model_metrics() -> Dict[str, Any]:
    path = settings.METRICS_PATH
    if not os.path.exists(path):
        return {"error": "Metrics file not found"}
    with open(path, "r") as f:
        return json.load(f)


def get_prediction_trends(db: Session) -> List[Dict[str, Any]]:
    from sqlalchemy import case
    results = (
        db.query(
            func.date(Prediction.created_at).label("date"),
            func.count(Prediction.id).label("count"),
            func.sum(case((Prediction.prediction.ilike("real"), 1), else_=0)).label("real_count"),
            func.sum(case((Prediction.prediction.ilike("fake"), 1), else_=0)).label("fake_count"),
        )
        .group_by(func.date(Prediction.created_at))
        .order_by(func.date(Prediction.created_at))
        .all()
    )
    return [
        {
            "date": str(r.date),
            "count": r.count,
            "real_count": r.real_count or 0,
            "fake_count": r.fake_count or 0,
        }
        for r in results
    ]


def get_class_distribution(db: Session) -> List[Dict[str, Any]]:
    results = (
        db.query(Prediction.prediction, func.count(Prediction.id).label("count"))
        .group_by(Prediction.prediction)
        .all()
    )
    return [
        {
            "name": r.prediction.capitalize() if r.prediction else "Unknown",
            "value": r.count,
        }
        for r in results
    ]


def get_common_terms(predictions: List[Prediction], top_n: int = 20) -> List[Dict[str, Any]]:
    from services.predictor import preprocess_text
    all_text = " ".join(p.article_text for p in predictions if p.article_text)
    tokens = preprocess_text(all_text).split()
    common = [{"text": w, "value": c} for w, c in Counter(tokens).most_common(top_n)]
    return common
