from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from database import get_db
from models.prediction import Prediction
from models.user import User
from schemas import HistoryResponse
from services.history import get_user_history
from services.auth import get_current_user

router = APIRouter(prefix="/api/history", tags=["history"])


@router.get("", response_model=list[HistoryResponse])
def history(
    limit: int = 50,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return get_user_history(db, current_user.id, limit)


@router.delete("/{prediction_id}")
def delete_history(
    prediction_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    pred = db.query(Prediction).filter(Prediction.id == prediction_id).first()
    if not pred:
        raise HTTPException(status_code=404, detail="Prediction not found")
    if pred.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this prediction")
    db.delete(pred)
    db.commit()
    return {"detail": "Prediction deleted"}
