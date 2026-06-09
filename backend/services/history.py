from typing import Optional, List, Dict, Any

from sqlalchemy.orm import Session

from models.prediction import Prediction


def save_prediction(
    db: Session,
    user_id: Optional[int],
    article_text: str,
    prediction: str,
    confidence: float,
    prob_dist: Dict[str, float],
    shap_vals: List[Dict[str, Any]],
    susp_words: List[str],
) -> Prediction:
    pred = Prediction(
        user_id=user_id,
        article_text=article_text[:1000],
        prediction=prediction,
        confidence=confidence,
        probability_distribution=prob_dist,
        shap_values=shap_vals,
        suspicious_words=susp_words,
    )
    db.add(pred)
    db.commit()
    db.refresh(pred)
    return pred


def get_user_history(db: Session, user_id: int, limit: int = 50) -> List[Prediction]:
    return (
        db.query(Prediction)
        .filter(Prediction.user_id == user_id)
        .order_by(Prediction.created_at.desc())
        .limit(limit)
        .all()
    )


def get_all_predictions(db: Session, limit: int = 100) -> List[Prediction]:
    return (
        db.query(Prediction)
        .order_by(Prediction.created_at.desc())
        .limit(limit)
        .all()
    )
