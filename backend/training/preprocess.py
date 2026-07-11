import pandas as pd
import numpy as np
from sklearn.preprocessing import LabelEncoder
import joblib
import os
import re


def _clean_symptom(symptom: str) -> str:
    """Normalize a raw symptom string into a clean, consistent token.

    Handles the messy formatting found in Kaggle datasets:
    - Leading/trailing whitespace
    - Mixed casing
    - Spaces vs underscores
    - Extra internal whitespace
    """
    s = str(symptom).strip().lower()
    # Collapse multiple spaces / underscores into a single underscore
    s = re.sub(r"[\s_]+", "_", s)
    return s


def load_and_preprocess_data(data_path, models_dir):
    print(f"Loading data from {data_path}...")
    df = pd.read_csv(data_path)

    # Strip whitespace from column names and values
    df.columns = df.columns.str.strip()
    for col in df.columns:
        if df[col].dtype == 'object':
            df[col] = df[col].str.strip()

    # The dataset has Disease/prognosis and Symptom_1, Symptom_2, etc.
    target_col = 'Disease' if 'Disease' in df.columns else 'prognosis'

    if target_col not in df.columns:
        raise ValueError(f"Target column not found. Available columns: {df.columns}")

    y = df[target_col]

    # Extract symptom columns (handles Symptom_1 .. Symptom_17 from Kaggle)
    symptom_cols = [col for col in df.columns if col.startswith('Symptom_')]

    # Melt/stack symptoms to create a multi-hot binary matrix
    print("Encoding symptoms...")

    # Create a list of sets of symptoms for each row
    symptoms_list = []
    for index, row in df.iterrows():
        # Get non-null symptoms for this row and clean them
        row_symptoms = []
        for val in row[symptom_cols].values:
            if pd.notna(val) and str(val).strip() != '':
                cleaned = _clean_symptom(val)
                if cleaned:
                    row_symptoms.append(cleaned)
        symptoms_list.append(row_symptoms)

    # Use MultiLabelBinarizer
    from sklearn.preprocessing import MultiLabelBinarizer
    mlb = MultiLabelBinarizer()
    X = mlb.fit_transform(symptoms_list)

    # Encode target
    print("Encoding target labels...")
    le = LabelEncoder()
    y_encoded = le.fit_transform(y)

    # Save encoders
    os.makedirs(models_dir, exist_ok=True)
    joblib.dump(mlb, os.path.join(models_dir, "symptom_encoder.pkl"))
    joblib.dump(le, os.path.join(models_dir, "label_encoder.pkl"))

    print(f"Preprocessed {X.shape[0]} samples with {X.shape[1]} unique symptoms.")
    print(f"Diseases: {len(le.classes_)}")
    print(f"Sample symptoms: {list(mlb.classes_[:10])}...")
    return X, y_encoded, mlb, le
