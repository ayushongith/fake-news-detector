import os
import sys
import json
import subprocess
import importlib.util


def run_module(module_path, label):
    print(f"\n{'=' * 60}")
    print(f"Running {label}...")
    print(f"{'=' * 60}")
    spec = importlib.util.spec_from_file_location(label.replace(' ', '_'), module_path)
    module = importlib.util.module_from_spec(spec)
    sys.modules[label.replace(' ', '_')] = module
    spec.loader.exec_module(module)


def main():
    base_dir = os.path.dirname(__file__)
    train_path = os.path.join(base_dir, 'train.py')
    evaluate_path = os.path.join(base_dir, 'evaluate.py')
    model_dir = os.path.join(base_dir, '..', 'models')
    results_path = os.path.join(model_dir, 'evaluation_results.json')

    os.makedirs(model_dir, exist_ok=True)

    run_module(train_path, 'Training Pipeline')

    run_module(evaluate_path, 'Evaluation Pipeline')

    print(f"\n{'=' * 60}")
    print("Training Summary")
    print(f"{'=' * 60}")

    if os.path.exists(results_path):
        with open(results_path) as f:
            results = json.load(f)
        print(f"  Accuracy        : {results['accuracy']:.4f}")
        print(f"  Precision       : {results['precision']:.4f}")
        print(f"  Recall          : {results['recall']:.4f}")
        print(f"  F1 Score        : {results['f1_score']:.4f}")
        print(f"  ROC AUC         : {results['roc_auc']:.4f}")
        cm = results['confusion_matrix']
        print(f"  Confusion Matrix: [[TN={cm[0][0]}, FP={cm[0][1]}], [FN={cm[1][0]}, TP={cm[1][1]}]]")

    print(f"\n  Artifacts saved in: {model_dir}")
    print(f"    - best_model.pkl        (TF-IDF + classifier pipeline)")
    print(f"    - feature_names.pkl     (TF-IDF vocabulary)")
    print(f"    - label_encoder.pkl     (Label encoder)")
    print(f"    - evaluation_results.json")
    print(f"    - confusion_matrix.png")
    print(f"    - roc_curve.png")
    print(f"{'=' * 60}")
    print("Pipeline complete.")


if __name__ == '__main__':
    main()
