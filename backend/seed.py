"""Seed script to populate the database with sample users and predictions."""
import sys
import os
import random
from datetime import datetime, timedelta

sys.path.insert(0, os.path.dirname(__file__))

from database import engine, SessionLocal, Base
from models.user import User
from models.prediction import Prediction
from services.auth import hash_password

FAKE_ARTICLES = [
    ("Breaking: Scientists discover cure for all diseases", "Real"),
    ("You won't believe what this celebrity did next! Shocking!", "Fake"),
    ("Government announces new climate policy effective next year", "Real"),
    ("Aliens found on Mars, NASA confirms secretly", "Fake"),
    ("Stock market reaches all-time high amid economic recovery", "Real"),
    ("This simple trick can make you a millionaire overnight", "Fake"),
    ("New study shows exercise improves mental health significantly", "Real"),
    ("Famous actor secretly working for underground criminal network", "Fake"),
    ("Tech company releases new AI tool for healthcare diagnostics", "Real"),
    ("Miracle pill cures all cancers, big pharma doesn't want you to know", "Fake"),
    ("Researchers develop new battery technology with 10x capacity", "Real"),
    ("World leaders meet to discuss global peace treaty", "Real"),
    ("Shocking: Common household item causing cancer, says hidden report", "Fake"),
    ("Education reform bill passes senate with bipartisan support", "Real"),
    ("Vaccines contain microchips for government tracking, expert reveals", "Fake"),
]

SEED_USERS = [
    {"email": "alice@example.com", "password": "password123"},
    {"email": "bob@example.com", "password": "password456"},
]


def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    for u in SEED_USERS:
        existing = db.query(User).filter(User.email == u["email"]).first()
        if not existing:
            user = User(email=u["email"], password_hash=hash_password(u["password"]))
            db.add(user)
            db.flush()

    db.commit()
    users = db.query(User).all()

    for article_text, label in FAKE_ARTICLES:
        user = random.choice(users) if random.random() > 0.3 and users else None
        confidence = round(random.uniform(0.75, 0.99), 4)
        prob_dist = (
            {"Real": confidence, "Fake": round(1 - confidence, 4)}
            if label == "Real"
            else {"Fake": confidence, "Real": round(1 - confidence, 4)}
        )
        pred = Prediction(
            user_id=user.id if user else None,
            article_text=article_text,
            prediction=label,
            confidence=confidence,
            probability_distribution=prob_dist,
            shap_values=[
                {"word": "example", "shap_value": 0.05},
                {"word": "test", "shap_value": -0.03},
            ],
            suspicious_words=["example"] if label == "Fake" else [],
            created_at=datetime.utcnow() - timedelta(hours=random.randint(1, 720)),
        )
        db.add(pred)

    db.commit()
    db.close()
    print("Seed data inserted successfully.")


if __name__ == "__main__":
    seed()
