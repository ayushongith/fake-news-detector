from sqlalchemy import Column, Integer, String, Text, Float, DateTime, ForeignKey, JSON
from sqlalchemy.sql import func
from database import Base


class Prediction(Base):
    __tablename__ = "predictions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    article_text = Column(Text, nullable=False)
    prediction = Column(String(50), nullable=False)
    confidence = Column(Float, nullable=False)
    probability_distribution = Column(JSON, nullable=True)
    shap_values = Column(JSON, nullable=True)
    suspicious_words = Column(JSON, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
