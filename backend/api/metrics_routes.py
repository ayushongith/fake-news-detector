from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from services.metrics_service import (
    get_model_metrics,
    get_prediction_trends,
    get_class_distribution,
    get_common_terms,
)
from services.history import get_all_predictions

router = APIRouter(prefix="/api/metrics", tags=["metrics"])


@router.get("")
def metrics():
    return get_model_metrics()


@router.get("/trends")
def trends(db: Session = Depends(get_db)):
    return get_prediction_trends(db)


@router.get("/distribution")
def distribution(db: Session = Depends(get_db)):
    return get_class_distribution(db)


@router.get("/common-terms")
def common_terms(db: Session = Depends(get_db)):
    predictions = get_all_predictions(db, limit=500)
    return get_common_terms(predictions)
