import os
import joblib
import numpy as np
from preprocess import load_and_preprocess_data
from imblearn.over_sampling import SMOTE
from sklearn.model_selection import StratifiedKFold, cross_val_score, train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.neighbors import KNeighborsClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import classification_report, accuracy_score

def train_models():
    base_dir = os.path.dirname(os.path.dirname(__file__))
    data_path = os.path.join(base_dir, "data", "dataset.csv")
    models_dir = os.path.join(base_dir, "models")
    
    # Step 1 & 2: Load and Preprocess
    X, y, mlb, le = load_and_preprocess_data(data_path, models_dir)
    
    # Step 3: Handle Imbalance
    print("Handling class imbalance with SMOTE...")
    # Some classes might have very few samples (like 1), SMOTE needs k_neighbors <= n_samples - 1
    # We will safely apply SMOTE by finding the minimum class count
    unique, counts = np.unique(y, return_counts=True)
    min_count = np.min(counts)
    k_neighbors = min(5, min_count - 1) if min_count > 1 else 1
    
    if min_count > 1:
        try:
            smote = SMOTE(random_state=42, k_neighbors=k_neighbors)
            X_res, y_res = smote.fit_resample(X, y)
            print(f"Resampled data shape: {X_res.shape}")
        except ValueError:
            print("SMOTE failed (possibly too few samples). Using original data.")
            X_res, y_res = X, y
    else:
        print("Some classes have only 1 sample, skipping SMOTE.")
        X_res, y_res = X, y
        
    if min_count > 1:
        X_train, X_test, y_train, y_test = train_test_split(X_res, y_res, test_size=0.2, random_state=42, stratify=y_res)
    else:
        # Cannot stratify with 1 sample per class
        X_train, X_test, y_train, y_test = train_test_split(X_res, y_res, test_size=0.2, random_state=42)
    
    # Step 4: Define Models
    models = {
        "Logistic Regression": LogisticRegression(C=1.0, max_iter=1000, random_state=42),
        "KNN": KNeighborsClassifier(n_neighbors=min(5, len(X_train))),
        "Decision Tree": DecisionTreeClassifier(max_depth=None, min_samples_leaf=1, random_state=42)
    }
    
    # Step 5: Cross-Validation & Training
    trained_models = {}
    cv = StratifiedKFold(n_splits=min(5, min_count) if min_count > 1 else 2, shuffle=True, random_state=42)
    
    for name, model in models.items():
        print(f"\n--- {name} ---")
        if min_count > 1:
            try:
                cv_scores = cross_val_score(model, X_train, y_train, cv=cv, scoring='accuracy')
                print(f"CV Accuracies: {cv_scores}")
                print(f"Mean CV Accuracy: {cv_scores.mean():.4f} ± {cv_scores.std():.4f}")
            except Exception as e:
                print(f"CV failed: {e}")
        
        print("Training on full train set...")
        model.fit(X_train, y_train)
        y_pred = model.predict(X_test)
        
        acc = accuracy_score(y_test, y_pred)
        print(f"Test Accuracy: {acc:.4f}")
        
        # Classification report (might be long, just print if needed)
        # print(classification_report(y_test, y_pred, target_names=le.classes_))
        
        trained_models[name] = model
        
    # Step 6: Save Models
    print("\nSaving models...")
    joblib.dump(trained_models["Logistic Regression"], os.path.join(models_dir, "logistic_model.pkl"))
    joblib.dump(trained_models["KNN"], os.path.join(models_dir, "knn_model.pkl"))
    joblib.dump(trained_models["Decision Tree"], os.path.join(models_dir, "tree_model.pkl"))
    print("All models saved successfully.")

if __name__ == "__main__":
    train_models()
