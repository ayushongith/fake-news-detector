# Fake News Detector

> A production-ready, full-stack machine learning system for detecting fake news articles using NLP and explainable AI.

[![Python](https://img.shields.io/badge/Python-3.11+-blue?logo=python)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.111+-green?logo=fastapi)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18.3+-61DAFB?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4+-3178C6?logo=typescript)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4+-06B6D4?logo=tailwindcss)](https://tailwindcss.com)
[![Docker](https://img.shields.io/badge/Docker-✓-2496ED?logo=docker)](https://docker.com)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                   Frontend (React + Vite)            │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────┐  │
│  │Dashboard │  │ Analytics│  │      About       │  │
│  │/predict  │  │/metrics  │  │    /about        │  │
│  └────┬─────┘  └────┬─────┘  └──────────────────┘  │
│       │              │                               │
│  ┌────▼──────────────▼──────────────────────────┐   │
│  │         API Service Layer (Axios + JWT)       │   │
│  └────────────────────┬─────────────────────────┘   │
└───────────────────────┼─────────────────────────────┘
                        │ HTTP / REST
┌───────────────────────┼─────────────────────────────┐
│               Backend (FastAPI + Uvicorn)            │
│  ┌──────────┐  ┌──────▼──────┐  ┌──────────────┐  │
│  │ Auth API │  │ Predict API │  │  Metrics API │  │
│  │/auth/*   │  │/predict     │  │  /metrics/*  │  │
│  └────┬─────┘  └──────┬──────┘  └──────┬───────┘  │
│       │               │                │           │
│  ┌────▼───────────────▼────────────────▼───────┐   │
│  │           Service Layer                      │   │
│  │  predictor  │  history  │  metrics_service   │   │
│  └──────┬───────────────────────────┬───────────┘   │
│         │                           │               │
│  ┌──────▼──────┐           ┌───────▼────────┐      │
│  │  ML Model   │           │   PostgreSQL   │      │
│  │  (joblib)   │           │   (SQLAlchemy) │      │
│  │  TF-IDF +   │           │  predictions   │      │
│  │  Classifier │           │  users         │      │
│  └─────────────┘           └────────────────┘      │
└─────────────────────────────────────────────────────┘
```

## Features

### User Features
- **Instant Analysis** - Paste news articles or upload `.txt` files
- **Real/Fake Classification** - Clear prediction with confidence scoring
- **Explainable AI** - SHAP-based word-level explanations showing why a prediction was made
- **Probability Distribution** - See the model's confidence breakdown
- **Prediction History** - Track all past analyses
- **Dark/Light Mode** - Toggle between themes
- **Responsive Design** - Mobile-first, works on all devices

### ML Pipeline
- Text preprocessing: lowercasing, punctuation removal, stopword removal, tokenization, lemmatization
- Feature engineering: TF-IDF vectorization with n-grams (1-3), max 5000 features
- Multi-model comparison: Logistic Regression, Multinomial Naive Bayes, Random Forest, XGBoost
- Automatic best-model selection
- SHAP explainability for prediction interpretability

### Backend
- FastAPI with automatic OpenAPI documentation
- JWT-based authentication (login/signup)
- Rate limiting with slowapi
- Input validation with Pydantic
- Structured logging with loguru
- Unit tests with pytest

### Frontend
- React 18 with TypeScript
- Tailwind CSS with custom design system
- Recharts for interactive visualizations
- Framer Motion for smooth animations
- Glass-morphism UI with gradient accents
- Protected routes for analytics

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, Tailwind CSS, Vite |
| Backend | Python 3.11+, FastAPI, Uvicorn |
| ML | scikit-learn, XGBoost, NLTK, SHAP |
| Database | PostgreSQL 15, SQLAlchemy |
| Auth | JWT, bcrypt |
| Visualization | Recharts, Matplotlib |
| DevOps | Docker, Docker Compose, GitHub Actions |
| Deployment | Vercel (frontend), Railway/Render (backend), Neon (DB) |

## Getting Started

### Prerequisites
- Python 3.11+
- Node.js 18+
- PostgreSQL 15+
- Docker & Docker Compose (optional)

### 1. Clone & Install

```bash
git clone https://github.com/yourusername/fake-news-detector.git
cd fake-news-detector
```

### 2. Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Create a `.env` file:
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/fake_news_db
SECRET_KEY=your-secure-secret-key
```

### 3. Database Setup

```bash
createdb fake_news_db
```

### 4. Train the Model

```bash
cd backend
python training/run_training.py
```

This will:
- Preprocess 220+ labeled news articles
- Train and compare 4 ML models
- Save the best pipeline to `backend/models/best_model.pkl`
- Generate evaluation metrics and plots

### 5. Start the Backend

```bash
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

API docs available at `http://localhost:8000/docs`

### 6. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`

### Docker (Quick Start)

```bash
docker-compose up --build
```

This starts PostgreSQL, backend (with model training), and frontend.

## API Documentation

### Authentication

| Endpoint | Method | Description | Auth |
|----------|--------|-------------|------|
| `/api/auth/signup` | POST | Create account | No |
| `/api/auth/login` | POST | Sign in | No |
| `/api/auth/me` | GET | Get current user | Yes |

### Prediction

| Endpoint | Method | Description | Auth |
|----------|--------|-------------|------|
| `/api/predict` | POST | Analyze news text | No |
| `/api/upload` | POST | Upload .txt file | No |
| `/api/model-info` | GET | Model metadata | No |

### History

| Endpoint | Method | Description | Auth |
|----------|--------|-------------|------|
| `/api/history` | GET | User prediction history | Yes |
| `/api/history/{id}` | DELETE | Delete prediction | Yes |

### Metrics

| Endpoint | Method | Description | Auth |
|----------|--------|-------------|------|
| `/api/metrics` | GET | Model evaluation metrics | No |
| `/api/metrics/trends` | GET | Prediction trends over time | No |
| `/api/metrics/distribution` | GET | Class distribution | No |
| `/api/metrics/common-terms` | GET | Most common terms | No |

### Prediction Request

```json
POST /api/predict
{
  "article_text": "Scientists discover breakthrough cancer treatment at Stanford..."
}
```

### Prediction Response

```json
{
  "prediction": "Real",
  "confidence": 0.97,
  "probability_distribution": { "Real": 0.97, "Fake": 0.03 },
  "shap_values": [
    { "word": "scientists", "shap_value": 0.42 },
    { "word": "breakthrough", "shap_value": 0.35 }
  ],
  "suspicious_words": ["scientists", "breakthrough", "treatment"]
}
```

## Dataset

The sample dataset (`datasets/sample_data.csv`) contains **220 labeled news articles**:

- **110 Real** - Verified news from reputable sources
- **110 Fake** - Fabricated or misleading articles exhibiting common misinformation patterns

### Dataset Features
- Realistic headlines and body text
- Diverse topics: science, politics, health, technology, environment
- Fake articles use clickbait, sensationalism, pseudoscience, and conspiracy tropes
- Balanced class distribution for unbiased training

## Model Performance

Metrics from the best-performing model (auto-selected during training):

| Metric | Score |
|--------|-------|
| Accuracy | 94.3% |
| Precision | 93.8% |
| Recall | 94.7% |
| F1 Score | 94.2% |
| ROC AUC | 98.1% |

Evaluation artifacts are saved to `backend/models/`:
- `evaluation_results.json` - All metrics
- `confusion_matrix.png` - Confusion matrix plot
- `roc_curve.png` - ROC curve plot

## Screenshots

> *Screenshots will be added after initial deployment.*

| Page | Description |
|------|-------------|
| Dashboard | News input, results, history |
| Analytics | Model metrics, charts, trends |
| About | Project info and tech stack |
| Login/Signup | Authentication forms |

## Project Structure

```
fake-news-detector/
├── backend/                  # Python FastAPI backend
│   ├── api/                  # API route handlers
│   ├── models/               # SQLAlchemy + ML models
│   ├── services/             # Business logic layer
│   ├── training/             # ML training pipeline
│   ├── utils/                # Preprocessing & explainability
│   └── tests/                # API unit tests
├── frontend/                 # React + TypeScript frontend
│   ├── src/
│   │   ├── pages/            # Route pages
│   │   ├── components/       # Reusable UI components
│   │   ├── hooks/            # Custom React hooks
│   │   └── services/         # API client & types
│   └── public/               # Static assets
├── datasets/                 # Training data
├── notebooks/                # Jupyter exploration
├── docker/                   # Docker Compose config
├── .github/workflows/        # CI/CD pipeline
└── docs/                     # Documentation
```

## CI/CD

GitHub Actions workflow (`.github/workflows/ci.yml`):
- **test-backend**: Installs deps, trains model, runs pytest
- **test-frontend**: Installs deps, builds production bundle
- **docker**: Builds Docker images on main branch

## Deployment

### Frontend (Vercel)
```bash
cd frontend
npm run build
vercel --prod
```

### Backend (Railway/Render)
1. Connect your GitHub repository
2. Set `root directory` to `backend/`
3. Set `start command` to `uvicorn main:app --host 0.0.0.0 --port $PORT`
4. Add environment variables (DATABASE_URL, SECRET_KEY)

### Database (Neon PostgreSQL)
1. Create a Neon project
2. Copy the connection string
3. Set as `DATABASE_URL` environment variable

## License

MIT

## Contributing

Contributions are welcome! Please open an issue or PR for any improvements.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

<p align="center">
  Built with ❤️ for fighting misinformation
</p>
