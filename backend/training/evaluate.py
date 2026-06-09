import os
import sys
import json
import numpy as np
import pandas as pd
import joblib
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score,
    confusion_matrix, roc_curve, auc, classification_report
)

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

DATA_PATH = os.path.join(os.path.dirname(__file__), '..', '..', 'datasets', 'sample_data.csv')
MODEL_DIR = os.path.join(os.path.dirname(__file__), '..', 'models')
MODEL_PATH = os.path.join(MODEL_DIR, 'best_model.pkl')
LABEL_ENCODER_PATH = os.path.join(MODEL_DIR, 'label_encoder.pkl')
RESULTS_PATH = os.path.join(MODEL_DIR, 'evaluation_results.json')
CM_PLOT_PATH = os.path.join(MODEL_DIR, 'confusion_matrix.png')
ROC_PLOT_PATH = os.path.join(MODEL_DIR, 'roc_curve.png')


def main():
    os.makedirs(MODEL_DIR, exist_ok=True)

    df = pd.read_csv(DATA_PATH)
    X = df['text']
    y = df['label']

    label_encoder = joblib.load(LABEL_ENCODER_PATH)
    y_encoded = label_encoder.transform(y)

    pipeline = joblib.load(MODEL_PATH)
    print(f"Model loaded from {MODEL_PATH}")

    y_pred = pipeline.predict(X)

    if hasattr(pipeline.named_steps['classifier'], 'predict_proba'):
        y_prob = pipeline.named_steps['classifier'].predict_proba(
            pipeline.named_steps['vectorizer'].transform(X)
        )
        if y_prob.shape[1] > 1:
            y_prob = y_prob[:, 1]
    else:
        y_prob = y_pred.astype(float)

    accuracy = accuracy_score(y_encoded, y_pred)
    precision = precision_score(y_encoded, y_pred, zero_division=0)
    recall = recall_score(y_encoded, y_pred, zero_division=0)
    f1 = f1_score(y_encoded, y_pred, zero_division=0)
    cm = confusion_matrix(y_encoded, y_pred).tolist()
    roc_auc = auc(*roc_curve(y_encoded, y_prob)[:2]) if len(np.unique(y_encoded)) > 1 else 0.0
    fpr, tpr, _ = roc_curve(y_encoded, y_prob)
    report = classification_report(y_encoded, y_pred, output_dict=True)

    results = {
        'accuracy': accuracy,
        'precision': precision,
        'recall': recall,
        'f1_score': f1,
        'confusion_matrix': cm,
        'roc_auc': roc_auc,
        'roc_curve': {
            'fpr': fpr.tolist(),
            'tpr': tpr.tolist()
        },
        'class_report': report
    }

    with open(RESULTS_PATH, 'w') as f:
        json.dump(results, f, indent=2)
    print(f"Results saved to {RESULTS_PATH}")

    print("\n" + "=" * 60)
    print("Evaluation Results")
    print("=" * 60)
    print(f"  Accuracy : {accuracy:.4f}")
    print(f"  Precision: {precision:.4f}")
    print(f"  Recall   : {recall:.4f}")
    print(f"  F1 Score : {f1:.4f}")
    print(f"  ROC AUC  : {roc_auc:.4f}")
    print(f"\nConfusion Matrix:")
    print(f"  [TN: {cm[0][0]}, FP: {cm[0][1]}]")
    print(f"  [FN: {cm[1][0]}, TP: {cm[1][1]}]")

    fig, ax = plt.subplots(figsize=(6, 5))
    im = ax.imshow(cm, interpolation='nearest', cmap=plt.cm.Blues)
    ax.figure.colorbar(im, ax=ax)
    tick_marks = np.arange(2)
    ax.set_xticks(tick_marks)
    ax.set_yticks(tick_marks)
    ax.set_xticklabels(['Real', 'Fake'])
    ax.set_yticklabels(['Real', 'Fake'])
    thresh = np.array(cm).max() / 2.0
    for i in range(2):
        for j in range(2):
            ax.text(j, i, cm[i][j], ha='center', va='center',
                    color='white' if np.array(cm)[i, j] > thresh else 'black')
    ax.set_xlabel('Predicted Label')
    ax.set_ylabel('True Label')
    ax.set_title('Confusion Matrix')
    fig.tight_layout()
    fig.savefig(CM_PLOT_PATH, dpi=100)
    plt.close(fig)
    print(f"Confusion matrix plot saved to {CM_PLOT_PATH}")

    fig2, ax2 = plt.subplots(figsize=(8, 6))
    ax2.plot(fpr, tpr, color='darkorange', lw=2, label=f'ROC curve (AUC = {roc_auc:.4f})')
    ax2.plot([0, 1], [0, 1], color='navy', lw=1, linestyle='--', label='Random Classifier')
    ax2.set_xlim([0.0, 1.0])
    ax2.set_ylim([0.0, 1.05])
    ax2.set_xlabel('False Positive Rate')
    ax2.set_ylabel('True Positive Rate')
    ax2.set_title('Receiver Operating Characteristic')
    ax2.legend(loc='lower right')
    ax2.grid(alpha=0.3)
    fig2.tight_layout()
    fig2.savefig(ROC_PLOT_PATH, dpi=100)
    plt.close(fig2)
    print(f"ROC curve plot saved to {ROC_PLOT_PATH}")


if __name__ == '__main__':
    main()
