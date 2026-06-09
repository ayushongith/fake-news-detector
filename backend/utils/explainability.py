import os
import numpy as np
import joblib


MODEL_PATH = os.path.join(os.path.dirname(__file__), '..', 'models', 'best_model.pkl')
FEATURE_NAMES_PATH = os.path.join(os.path.dirname(__file__), '..', 'models', 'feature_names.pkl')


def load_model_pipeline():
    return joblib.load(MODEL_PATH)


def load_feature_names():
    return joblib.load(FEATURE_NAMES_PATH)


def explain_prediction(text, model_pipeline, feature_names, num_features=15):
    vectorizer = model_pipeline.named_steps['vectorizer']
    classifier = model_pipeline.named_steps['classifier']

    features = vectorizer.transform([text]).toarray()

    if hasattr(classifier, 'coef_'):
        coef = classifier.coef_[0] if classifier.coef_.shape[0] == 1 else classifier.coef_[1]
        shap_values = features[0] * coef
    else:
        try:
            import shap
            explainer = shap.TreeExplainer(classifier)
            shap_values = explainer.shap_values(features)[0]
            if len(shap_values.shape) > 1 and shap_values.shape[1] > 1:
                shap_values = shap_values[:, 1]
        except ImportError:
            if hasattr(classifier, 'feature_importances_'):
                shap_values = features[0] * classifier.feature_importances_
            else:
                shap_values = features[0]

    word_effects = []
    for i, val in enumerate(shap_values):
        if abs(val) > 0.001:
            word_effects.append({
                'word': feature_names[i] if i < len(feature_names) else f'feature_{i}',
                'shap_value': float(val),
                'impact_type': 'positive' if val > 0 else 'negative'
            })

    word_effects.sort(key=lambda x: abs(x['shap_value']), reverse=True)
    return word_effects[:num_features]


def extract_suspicious_words(word_effects, threshold=0.01):
    return [w for w in word_effects if abs(w['shap_value']) > threshold]
