# SymptomSense — Disease Prediction Assistant

SymptomSense is a full-stack React and FastAPI web application that predicts likely diseases based on selected symptoms using three machine learning algorithms (Logistic Regression, KNN, Decision Tree).

## Live Demo
[[(https://edurika-project.vercel.app/)](#)]

<!-- add screenshot -->
<img width="1533" height="752" alt="image" src="https://github.com/user-attachments/assets/b9df3575-7d9a-43d2-9d53-b4ee8889b760" />
<img width="941" height="743" alt="image" src="https://github.com/user-attachments/assets/747237e9-3b12-41de-99f2-807719023028" />



## Tech Stack
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)
![scikit-learn](https://img.shields.io/badge/scikit--learn-%23F7931E.svg?style=for-the-badge&logo=scikit-learn&logoColor=white)

## Setup Instructions

### Backend Setup
```bash
cd backend
pip install -r requirements.txt

# Run the training script to generate models
python training/train.py

# Start the FastAPI server
uvicorn main:app --reload
```
*The API will be available at `http://localhost:8000`*

### Frontend Setup
```bash
cd frontend
npm install

# Start the Vite development server
npm run dev
```
*The app will be available at `http://localhost:5173`*

## Dataset

The models are trained on an open-source symptom-disease dataset. It uses a small synthetic fallback if the Kaggle dataset download fails.

## Model Accuracy

| Model               | CV Accuracy | Test Accuracy |
|---------------------|-------------|---------------|
| Logistic Regression |   1.0000    |    0.0000     |
| KNN                 |   1.0000    |    0.0000     |
| Decision Tree       |   1.0000    |    0.0000     |

*(Note: The above metrics reflect the synthetic fallback dataset. For real-world use, you must train on the full Kaggle dataset.)*

## Disclaimer
⚕️ **This app is for educational purposes only.** It is not a medical device and should not be used as a substitute for professional medical advice, diagnosis, or treatment.

## License
MIT
