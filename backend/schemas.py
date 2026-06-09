from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel


class PredictRequest(BaseModel):
    article_text: str
    user_id: Optional[int] = None


class PredictResponse(BaseModel):
    prediction: str
    confidence: float
    probability_distribution: Dict[str, float]
    shap_values: List[Dict[str, Any]]
    suspicious_words: List[str]


class UserCreate(BaseModel):
    email: str
    password: str


class UserResponse(BaseModel):
    id: int
    email: str
    created_at: datetime

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    email: Optional[str] = None


class HistoryResponse(BaseModel):
    id: int
    article_text: str
    prediction: str
    confidence: float
    created_at: datetime

    class Config:
        from_attributes = True
