from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import joblib
import numpy as np
import os
import json
from dotenv import load_dotenv
from disease_data import DISEASE_INFO as FALLBACK_DISEASE_INFO
from nlp_extractor import extract_symptoms_local

# Load environment variables from .env file
load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))

app = FastAPI(title="Disease Predictor API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

models = {}
encoders = {}
gemini_model = None

# Fallback disease info is imported from disease_data.py (covers all 41 diseases)


@app.on_event("startup")
async def startup_event():
    global gemini_model

    base_dir = os.path.dirname(__file__)
    models_dir = os.path.join(base_dir, "models")

    # ── Load ML models ─────────────────────────
    try:
        models["logistic_regression"] = joblib.load(os.path.join(models_dir, "logistic_model.pkl"))
        models["knn"] = joblib.load(os.path.join(models_dir, "knn_model.pkl"))
        models["decision_tree"] = joblib.load(os.path.join(models_dir, "tree_model.pkl"))
        encoders["mlb"] = joblib.load(os.path.join(models_dir, "symptom_encoder.pkl"))
        encoders["le"] = joblib.load(os.path.join(models_dir, "label_encoder.pkl"))
        print("Models loaded successfully.")
    except Exception as e:
        print(f"Failed to load models: {e}")

    # ── Configure Gemini AI ────────────────────
    api_key = os.getenv("GEMINI_API_KEY")
    if api_key and api_key != "your_gemini_api_key_here":
        try:
            from google import genai
            client = genai.Client(api_key=api_key)
            gemini_model = client
            print("Gemini AI configured successfully.")
        except Exception as e:
            print(f"Failed to configure Gemini: {e}")
            gemini_model = None
    else:
        print("No Gemini API key found – AI disease info will use fallback data.")


class PredictRequest(BaseModel):
    symptoms: List[str]


class SymptomText(BaseModel):
    text: str


@app.get("/api/v1/health")
def health_check():
    return {
        "status": "ok",
        "models_loaded": bool(models and encoders),
        "gemini_configured": gemini_model is not None,
    }


@app.get("/api/v1/symptoms")
def get_symptoms():
    if "mlb" not in encoders:
        raise HTTPException(status_code=500, detail="Encoder not loaded")
    return {"symptoms": list(encoders["mlb"].classes_)}


@app.post("/api/v1/predict")
def predict_disease(request: PredictRequest):
    if not models or "mlb" not in encoders or "le" not in encoders:
        raise HTTPException(status_code=500, detail="Models not loaded")

    if not request.symptoms:
        raise HTTPException(status_code=400, detail="No symptoms provided")

    if len(request.symptoms) > 20:
        raise HTTPException(status_code=400, detail="Too many symptoms provided (max 20)")

    # Filter symptoms to known ones
    known_symptoms = set(encoders["mlb"].classes_)
    valid_symptoms = [s for s in request.symptoms if s in known_symptoms]

    if not valid_symptoms:
        raise HTTPException(status_code=400, detail="No known symptoms provided")

    X_input = encoders["mlb"].transform([valid_symptoms])

    response_data = {"models": {}}

    # Run predictions on all 3 models
    for model_name, model in models.items():
        if hasattr(model, "predict_proba"):
            probs = model.predict_proba(X_input)[0]
            top_3_idx = np.argsort(probs)[-3:][::-1]

            top_3_predictions = []
            for idx in top_3_idx:
                top_3_predictions.append({
                    "disease": encoders["le"].inverse_transform([idx])[0],
                    "confidence": float(probs[idx])
                })
            response_data["models"][model_name] = top_3_predictions
        else:
            # Fallback if probability is not supported
            pred_idx = model.predict(X_input)[0]
            response_data["models"][model_name] = [
                {
                    "disease": encoders["le"].inverse_transform([pred_idx])[0],
                    "confidence": 1.0
                }
            ]

    # Find top prediction (naive voting by top confidence across models)
    best_disease = None
    best_conf = -1
    for model_preds in response_data["models"].values():
        if model_preds and model_preds[0]["confidence"] > best_conf:
            best_conf = model_preds[0]["confidence"]
            best_disease = model_preds[0]["disease"]

    # Calculate agreement (how many models have the same top prediction)
    top_diseases = [preds[0]["disease"] for preds in response_data["models"].values() if preds]
    agreement_count = top_diseases.count(best_disease)
    total_models = len(models)

    response_data["top_prediction"] = best_disease
    response_data["agreement"] = f"{agreement_count}/{total_models} models agree"

    return response_data


# ──────────────────────────────────────────────
# Gemini-powered disease information endpoint
# ──────────────────────────────────────────────
@app.get("/api/v1/disease-info/{disease_name}")
async def get_disease_info(disease_name: str):
    """
    Returns detailed information about a disease.
    Uses Gemini AI if configured, otherwise falls back to local data.
    """

    # ── Try Gemini AI first ────────────────────
    if gemini_model is not None:
        try:
            prompt = f"""You are a medical information assistant. Provide factual, educational information about the disease: "{disease_name}".

Return ONLY a valid JSON object (no markdown, no code fences) with these exact keys:
{{
  "description": "A 2-3 sentence description of the disease suitable for a general audience.",
  "commonSymptoms": ["symptom1", "symptom2", "symptom3", "symptom4", "symptom5"],
  "precautions": ["precaution1", "precaution2", "precaution3", "precaution4"],
  "tests": ["recommended_test1", "recommended_test2", "recommended_test3"],
  "warningSigns": ["warning1", "warning2", "warning3", "warning4"]
}}

Rules:
- Use simple, clear language for patients (not doctors).
- commonSymptoms should list 4-6 common symptoms using lowercase with underscores (e.g., "chest_pain").
- precautions should list 3-5 practical self-care steps.
- tests should list 2-4 diagnostic tests a doctor might order.
- warningSigns should list 3-5 red-flag symptoms that require immediate medical attention.
- Do NOT include any text outside the JSON object."""

            response = gemini_model.models.generate_content(
                model="gemini-2.0-flash",
                contents=prompt,
            )

            raw_text = response.text.strip()

            # Clean potential markdown code fences
            if raw_text.startswith("```"):
                raw_text = raw_text.split("\n", 1)[1]  # Remove first line
            if raw_text.endswith("```"):
                raw_text = raw_text.rsplit("```", 1)[0]  # Remove last fence
            raw_text = raw_text.strip()

            info = json.loads(raw_text)

            # Validate required keys exist
            required_keys = {"description", "commonSymptoms", "precautions", "tests", "warningSigns"}
            if not required_keys.issubset(info.keys()):
                raise ValueError("Missing required keys in Gemini response")

            info["source"] = "gemini"
            return info

        except Exception as e:
            print(f"Gemini API call failed for '{disease_name}': {e}")
            fallback_reason = "Gemini API Limit Exceeded" if "429" in str(e) or "quota" in str(e).lower() else "API Error"
            # Fall through to fallback data

    # ── Fallback to local data ─────────────────
    if disease_name in FALLBACK_DISEASE_INFO:
        info = FALLBACK_DISEASE_INFO[disease_name].copy()
        info["source"] = "local"
        if 'fallback_reason' in locals():
            info["fallbackReason"] = fallback_reason
        return info

    # Generic fallback for unknown diseases
    fallback_info = {
        "description": f"Detailed information about {disease_name} is not available offline. Please consult a healthcare professional.",
        "commonSymptoms": [],
        "precautions": ["Consult a healthcare professional", "Monitor your symptoms", "Rest and stay hydrated"],
        "tests": ["Consult your doctor for appropriate diagnostic tests"],
        "warningSigns": ["Seek immediate medical help if symptoms worsen rapidly"],
        "source": "default",
    }
    if 'fallback_reason' in locals():
        fallback_info["fallbackReason"] = fallback_reason
    return fallback_info


# Natural Language Symptom Extraction
# ──────────────────────────────────────────────
@app.post("/api/v1/extract-symptoms")
async def extract_symptoms(request: SymptomText):
    """
    Extracts structured symptoms from a natural language string.
    Uses the local NLP rule-based extractor to map text to 131 known symptoms.
    """
    if "mlb" not in encoders:
        raise HTTPException(status_code=500, detail="Symptom encoder not loaded")

    known_symptoms = list(encoders["mlb"].classes_)

    try:
        # Run local offline extraction
        extracted = extract_symptoms_local(request.text)
        
        # Double check that no invalid symptoms leaked through
        valid_extracted = [s for s in extracted if s in known_symptoms]

        return {"symptoms": valid_extracted}

    except Exception as e:
        print(f"Local AI extraction failed: {e}")
        raise HTTPException(status_code=500, detail="AI Symptom Extraction failed. Please select symptoms manually.")
