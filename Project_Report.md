# Project Report: SymptomSense — Disease Prediction Assistant

## 1. Project Overview
**SymptomSense** is a full-stack web application designed to act as a Disease Prediction Assistant. Its primary purpose is to accept a list of symptoms from the user, process these symptoms using Machine Learning algorithms, and return the top predicted diseases along with confidence scores and brief descriptions. The app provides a clinical, approachable, and educational user experience.

> **Disclaimer:** The application is built for educational purposes and is not a substitute for professional medical diagnosis.

---

## 2. Technology Stack
The application is built using a modern full-stack architecture:

### Frontend
- **Framework:** React 18 with Vite
- **Styling:** Tailwind CSS (utility-first styling for a clean, light clinical design)
- **Visualization:** Recharts (for bar chart visualization of disease probabilities)
- **Routing & Networking:** React Router v6 and Axios

### Backend
- **Framework:** FastAPI (Python 3.10+) with Uvicorn server
- **Machine Learning:** Scikit-learn (Logistic Regression, K-Nearest Neighbors, Decision Tree)
- **Data Processing:** Pandas and NumPy
- **Serialization:** Joblib (for saving and loading models)
- **AI Integration:** Google Gemini AI (for generating detailed disease descriptions dynamically)

---

## 3. Dataset Used
The models in this application are trained on an open-source **Kaggle symptom-disease dataset**, which includes:
- **174 distinct symptoms**
- **41-46 distinct diseases** (balanced for training)

A synthetic fallback dataset ("Disease and Symptoms 2023" style) is also used as a backup to ensure the app continues working if the Kaggle dataset is unavailable during the build process.

---

## 4. Key Features & Components
- **Interactive Symptom Selector:** A searchable interface allowing users to manually pick symptoms.
- **Natural Language Extraction:** Users can write how they feel, and an offline NLP script extracts relevant symptoms automatically.
- **Multi-Model Prediction:** Instead of relying on one ML algorithm, the app runs Logistic Regression, KNN, and Decision Trees simultaneously and compares the results.
- **Visual Data Representation:** Displays disease prediction confidence scores using horizontal progress bars and Recharts bar charts.
- **Disease Detail Modal:** Fetches detailed information about a disease, precautions, and warning signs using Gemini AI or local fallback data.

---

## 5. How It Works (Application Flow)
1. **User Input:** The user selects symptoms manually on the frontend or types them in plain English.
2. **Data Transmission:** The frontend sends a `POST /predict` API request to the backend containing the chosen symptoms.
3. **Encoding:** The backend converts the text symptoms into a machine-readable format (multi-hot binary matrix) using a pre-trained `MultiLabelBinarizer`.
4. **Prediction:** The encoded data is passed to three separate ML models. Each model calculates the probability (`predict_proba`) of various diseases.
5. **Aggregation:** The backend selects the top 3 diseases from each model, determines the best overall prediction, and sends the structured data back to the frontend.
6. **Visualization:** The React frontend renders the predictions into comparison tabs and interactive charts.

---

## 6. The Most Important Part of the Code
The most critical part of the application is the **Prediction Logic** in the backend (`backend/main.py`). This is the "brain" of the app where the user's symptoms are fed into the machine learning models, and probabilities are calculated. 

If you are explaining this project, highlighting this section shows how the ML models integrate with the web API.

### Code Screenshot 1: The Prediction Logic (`backend/main.py`)
```python
@app.post("/api/v1/predict")
def predict_disease(request: PredictRequest):
    # 1. Validate and filter symptoms
    known_symptoms = set(encoders["mlb"].classes_)
    valid_symptoms = [s for s in request.symptoms if s in known_symptoms]
    
    # 2. Convert symptoms to binary matrix for the ML models
    X_input = encoders["mlb"].transform([valid_symptoms])
    response_data = {"models": {}}

    # 3. Run predictions on all 3 ML models (Logistic Regression, KNN, Decision Tree)
    for model_name, model in models.items():
        if hasattr(model, "predict_proba"):
            probs = model.predict_proba(X_input)[0]
            top_3_idx = np.argsort(probs)[-3:][::-1] # Get top 3 highest probabilities

            top_3_predictions = []
            for idx in top_3_idx:
                top_3_predictions.append({
                    "disease": encoders["le"].inverse_transform([idx])[0],
                    "confidence": float(probs[idx])
                })
            response_data["models"][model_name] = top_3_predictions
            
    # 4. Find the best overall prediction
    # ... (Voting logic calculates the highest confidence)
    
    return response_data
```

### Code Screenshot 2: Natural Language Symptom Extraction
Another highly impressive part of the code is how the app extracts structured symptoms from raw text.

```python
@app.post("/api/v1/extract-symptoms")
async def extract_symptoms(request: SymptomText):
    """
    Extracts structured symptoms from a natural language string.
    Uses the local NLP rule-based extractor to map text to known symptoms.
    """
    known_symptoms = list(encoders["mlb"].classes_)

    try:
        # Run local offline extraction based on user's text
        extracted = extract_symptoms_local(request.text)
        
        # Double check that no invalid symptoms leaked through
        valid_extracted = [s for s in extracted if s in known_symptoms]

        return {"symptoms": valid_extracted}

    except Exception as e:
        raise HTTPException(status_code=500, detail="AI Symptom Extraction failed.")
```
