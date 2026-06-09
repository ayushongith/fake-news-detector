import re
import string
from typing import List, Dict, Any, Tuple

import numpy as np
import nltk
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
from loguru import logger

from models.ml_model import ModelManager

_lemmatizer = WordNetLemmatizer()


def _ensure_nltk_data():
    for resource in ["stopwords", "wordnet", "punkt", "punkt_tab"]:
        try:
            if resource in ("punkt", "punkt_tab"):
                nltk.data.find(f"tokenizers/{resource}")
            else:
                nltk.data.find(f"corpora/{resource}")
        except LookupError:
            nltk.download(resource, quiet=True)


_ensure_nltk_data()
_stop_words = set(stopwords.words("english"))


def preprocess_text(text: str) -> str:
    text = text.lower()
    text = re.sub(f"[{re.escape(string.punctuation)}]", "", text)
    tokens = nltk.word_tokenize(text)
    tokens = [t for t in tokens if t not in _stop_words]
    tokens = [_lemmatizer.lemmatize(t) for t in tokens]
    return " ".join(tokens)


LABEL_MAP = {"0": "Real", "1": "Fake", 0: "Real", 1: "Fake"}

def predict_article(text: str) -> Tuple[str, float, Dict[str, float]]:
    manager = ModelManager()
    pipeline = manager.get_pipeline()
    if pipeline is None:
        raise RuntimeError("Model not loaded. Call /api/health first.")

    processed = preprocess_text(text)
    proba = pipeline.predict_proba([processed])[0]
    classes = pipeline.classes_
    prob_dist = {LABEL_MAP.get(str(c), str(c)): float(p) for c, p in zip(classes, proba)}
    pred_idx = int(np.argmax(proba))
    raw_pred = classes[pred_idx]
    prediction = LABEL_MAP.get(str(raw_pred), str(raw_pred))
    confidence = float(proba[pred_idx])
    return prediction, confidence, prob_dist


def get_shap_values(text: str) -> List[Dict[str, Any]]:
    manager = ModelManager()
    pipeline = manager.get_pipeline()
    if pipeline is None:
        raise RuntimeError("Model not loaded.")

    processed = preprocess_text(text)
    vectorizer = pipeline.named_steps.get("vectorizer") or pipeline.named_steps.get("tfidf")
    classifier = pipeline.named_steps.get("classifier") or list(pipeline.named_steps.values())[-1]

    if vectorizer is None:
        return []

    X = vectorizer.transform([processed])
    feature_names = vectorizer.get_feature_names_out()
    x_arr = X.toarray()[0]

    try:
        import shap
        if hasattr(classifier, "coef_"):
            coef = classifier.coef_
            if coef.shape[0] > 1:
                coef = coef[1]
            else:
                coef = coef[0]
            shap_array = x_arr * coef
        elif hasattr(classifier, "feature_log_prob_"):
            log_prob_diff = classifier.feature_log_prob_[1] - classifier.feature_log_prob_[0]
            shap_array = x_arr * log_prob_diff
        else:
            try:
                explainer = shap.Explainer(classifier, X)
                shap_vals = explainer(X)
                shap_array = shap_vals.values[0]
                if len(shap_array.shape) > 1 and shap_array.shape[1] == 2:
                    shap_array = shap_array[:, 1]
            except Exception:
                background = X[:1] if X.shape[0] > 0 else X
                explainer = shap.KernelExplainer(classifier.predict_proba, background)
                shap_vals = explainer.shap_values(X, nsamples=50, l1_reg=False)
                if isinstance(shap_vals, list) and len(shap_vals) > 1:
                    shap_array = shap_vals[1][0]
                elif isinstance(shap_vals, list):
                    shap_array = shap_vals[0][0]
                else:
                    shap_array = shap_vals[0]

        shap_array = np.asarray(shap_array).flatten()
        nonzero_mask = np.abs(shap_array) > 1e-10
        indices = np.where(nonzero_mask)[0]
        sorted_idx = indices[np.argsort(np.abs(shap_array[indices]))[::-1]][:20]
        result = []
        for idx in sorted_idx:
            if idx < len(feature_names):
                result.append({
                    "word": feature_names[idx],
                    "shap_value": float(shap_array[idx]),
                })
        return result
    except Exception as e:
        logger.warning(f"SHAP computation failed: {e}")
        return []


def extract_suspicious_words(text: str, shap_values: List[Dict[str, Any]]) -> List[str]:
    threshold = 0.01
    words = []
    for item in shap_values:
        if abs(item["shap_value"]) > threshold:
            words.append(item["word"])
    return words[:20]
