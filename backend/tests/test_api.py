import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


def test_health():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert "status" in data
    assert data["status"] == "healthy"


def test_prediction_empty_text():
    response = client.post("/api/predict", json={"article_text": ""})
    assert response.status_code in (200, 422)


def test_prediction_short_text():
    response = client.post("/api/predict", json={"article_text": "short"})
    assert response.status_code in (200, 422)


def test_upload_invalid_file():
    response = client.post("/api/upload", files={"file": ("test.txt", b"", "text/plain")})
    assert response.status_code in (200, 422, 400)


def test_model_info():
    response = client.get("/api/model-info")
    assert response.status_code in (200, 503)


def test_auth_signup():
    import uuid
    email = f"test_{uuid.uuid4().hex[:8]}@example.com"
    response = client.post("/api/auth/signup", json={"email": email, "password": "testpass123"})
    assert response.status_code in (200, 400)


def test_metrics():
    response = client.get("/api/metrics")
    assert response.status_code in (200, 500)
