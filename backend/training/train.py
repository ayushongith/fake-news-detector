import os
import sys
import pandas as pd
import numpy as np
import joblib
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.naive_bayes import MultinomialNB
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
from sklearn.pipeline import Pipeline

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from utils.preprocessing import ensure_nltk_data, preprocess_dataframe

try:
    from xgboost import XGBClassifier
    XGB_AVAILABLE = True
except ImportError:
    XGB_AVAILABLE = False
    print("XGBoost not installed. Skipping XGBoost model.")


DATA_PATH = os.path.join(os.path.dirname(__file__), '..', '..', 'datasets', 'sample_data.csv')
MODEL_DIR = os.path.join(os.path.dirname(__file__), '..', 'models')
MODEL_PATH = os.path.join(MODEL_DIR, 'best_model.pkl')
FEATURE_NAMES_PATH = os.path.join(MODEL_DIR, 'feature_names.pkl')
LABEL_ENCODER_PATH = os.path.join(MODEL_DIR, 'label_encoder.pkl')


def load_data(path):
    df = pd.read_csv(path)
    print(f"Loaded dataset: {len(df)} rows, {len(df.columns)} columns")
    print(f"Label distribution:\n{df['label'].value_counts().sort_index()}")
    return df


def prepare_features(df):
    ensure_nltk_data()
    df = preprocess_dataframe(df, text_column='text')
    X = df['processed_text']
    y = df['label']
    return X, y


def train_models(X_train, y_train):
    models = {
        'LogisticRegression': LogisticRegression(max_iter=1000),
        'MultinomialNB': MultinomialNB(),
        'RandomForest': RandomForestClassifier(n_estimators=100, random_state=42),
    }
    if XGB_AVAILABLE:
        models['XGBoost'] = XGBClassifier(
            n_estimators=100, use_label_encoder=False, eval_metric='logloss', random_state=42
        )
    return models


def evaluate_model(model, X_test, y_test):
    y_pred = model.predict(X_test)
    return {
        'accuracy': accuracy_score(y_test, y_pred),
        'precision': precision_score(y_test, y_pred, zero_division=0),
        'recall': recall_score(y_test, y_pred, zero_division=0),
        'f1_score': f1_score(y_test, y_pred, zero_division=0),
    }


def main():
    os.makedirs(MODEL_DIR, exist_ok=True)

    df = load_data(DATA_PATH)
    X, y = prepare_features(df)

    label_encoder = LabelEncoder()
    y_encoded = label_encoder.fit_transform(y)
    joblib.dump(label_encoder, LABEL_ENCODER_PATH)
    print(f"LabelEncoder saved. Classes: {label_encoder.classes_}")

    X_train, X_test, y_train, y_test = train_test_split(
        X, y_encoded, test_size=0.2, random_state=42, stratify=y_encoded
    )
    print(f"Train set: {len(X_train)} samples, Test set: {len(X_test)} samples")

    vectorizer = TfidfVectorizer(ngram_range=(1, 3), max_features=5000)
    X_train_vec = vectorizer.fit_transform(X_train)
    X_test_vec = vectorizer.transform(X_test)

    feature_names = vectorizer.get_feature_names_out()
    joblib.dump(feature_names, FEATURE_NAMES_PATH)
    print(f"Feature names saved. Total features: {len(feature_names)}")

    models = train_models(X_train_vec, y_train)

    results = {}
    best_model_name = None
    best_model_obj = None
    best_accuracy = 0

    print("\n" + "=" * 60)
    print("Model Comparison Results")
    print("=" * 60)

    for name, model in models.items():
        model.fit(X_train_vec, y_train)
        metrics = evaluate_model(model, X_test_vec, y_test)
        results[name] = metrics
        print(f"\n{name}:")
        print(f"  Accuracy : {metrics['accuracy']:.4f}")
        print(f"  Precision: {metrics['precision']:.4f}")
        print(f"  Recall   : {metrics['recall']:.4f}")
        print(f"  F1 Score : {metrics['f1_score']:.4f}")

        if metrics['accuracy'] > best_accuracy:
            best_accuracy = metrics['accuracy']
            best_model_name = name
            best_model_obj = model

    print("\n" + "=" * 60)
    print(f"Best Model: {best_model_name} (Accuracy: {best_accuracy:.4f})")
    print("=" * 60)

    pipeline = Pipeline([
        ('vectorizer', vectorizer),
        ('classifier', best_model_obj)
    ])
    pipeline.fit(X, y_encoded)
    joblib.dump(pipeline, MODEL_PATH)
    print(f"Best model pipeline saved to {MODEL_PATH}")

    return pipeline, results, label_encoder


if __name__ == '__main__':
    main()
