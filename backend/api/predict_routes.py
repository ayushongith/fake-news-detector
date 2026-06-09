from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from sqlalchemy.orm import Session

from database import get_db
from schemas import PredictRequest, PredictResponse
from services.predictor import predict_article, get_shap_values, extract_suspicious_words
from services.history import save_prediction
from services.metrics_service import get_model_metrics
from models.ml_model import ModelManager

router = APIRouter(prefix="/api", tags=["predict"])


@router.post("/predict", response_model=PredictResponse)
def predict(payload: PredictRequest, db: Session = Depends(get_db)):
    try:
        prediction, confidence, prob_dist = predict_article(payload.article_text)
    except RuntimeError as e:
        raise HTTPException(status_code=503, detail=str(e))
    shap_vals = get_shap_values(payload.article_text)
    susp_words = extract_suspicious_words(payload.article_text, shap_vals)

    save_prediction(
        db=db,
        user_id=payload.user_id,
        article_text=payload.article_text,
        prediction=prediction,
        confidence=confidence,
        prob_dist=prob_dist,
        shap_vals=shap_vals,
        susp_words=susp_words,
    )

    return PredictResponse(
        prediction=prediction,
        confidence=confidence,
        probability_distribution=prob_dist,
        shap_values=shap_vals,
        suspicious_words=susp_words,
    )


@router.post("/upload", response_model=PredictResponse)
def upload(file: UploadFile = File(...), db: Session = Depends(get_db)):
    if not file.filename.endswith(".txt"):
        raise HTTPException(status_code=400, detail="Only .txt files allowed")
    content = file.file.read().decode("utf-8")
    if not content.strip():
        raise HTTPException(status_code=400, detail="File is empty")
    try:
        prediction, confidence, prob_dist = predict_article(content)
    except RuntimeError as e:
        raise HTTPException(status_code=503, detail=str(e))
    shap_vals = get_shap_values(content)
    susp_words = extract_suspicious_words(content, shap_vals)

    save_prediction(
        db=db,
        user_id=None,
        article_text=content,
        prediction=prediction,
        confidence=confidence,
        prob_dist=prob_dist,
        shap_vals=shap_vals,
        susp_words=susp_words,
    )

    return PredictResponse(
        prediction=prediction,
        confidence=confidence,
        probability_distribution=prob_dist,
        shap_values=shap_vals,
        suspicious_words=susp_words,
    )


@router.get("/model-info")
def model_info():
    manager = ModelManager()
    if not manager.is_loaded():
        raise HTTPException(status_code=503, detail="Model not loaded")
    pipeline = manager.get_pipeline()
    classifier = list(pipeline.named_steps.values())[-1]
    vectorizer = pipeline.named_steps.get("vectorizer")
    metrics = get_model_metrics()
    return {
        "model_name": type(classifier).__name__,
        "model_type": type(classifier).__name__,
        "version": "1.0.0",
        "classes": list(pipeline.classes_),
        "loaded": True,
        "metrics": metrics,
        "features": len(vectorizer.get_feature_names_out()) if vectorizer else 0,
    }
