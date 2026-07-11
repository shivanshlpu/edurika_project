# Disease Prediction Assistant — Full-Stack React Web App
## `prompt.md` for AI Coding Agent

---

## 1. PROJECT OVERVIEW

Build a **Disease Prediction Assistant** web application using React (Vite + Tailwind CSS) on the frontend and a Python (FastAPI) backend that serves three trained ML models. The app allows a user to select symptoms from a curated list, runs predictions across Logistic Regression, K-Nearest Neighbors, and Decision Tree classifiers, and returns the top likely diseases with probability scores and brief descriptions.

**Target Audience:** Students, healthcare enthusiasts, and general users curious about symptom-based disease likelihood.
**App's Single Job:** Accept symptom inputs → Return top disease predictions with confidence scores.

> ⚠️ CRITICAL: NO dark or black themes. The entire app must use a clean, light, clinical-yet-approachable visual design. Think modern health-tech: whites, soft blues, sage greens, and warm neutrals. Zero dark backgrounds anywhere.

---

## 2. TECH STACK

### Frontend
- **React 18** with **Vite**
- **Tailwind CSS** (utility-first, no dark mode class)
- **Recharts** for bar chart visualization of disease probabilities
- **Axios** for API calls
- **React Router v6** for navigation

### Backend
- **Python 3.10+**
- **FastAPI** with **Uvicorn**
- **Scikit-learn** — LogisticRegression, KNeighborsClassifier, DecisionTreeClassifier
- **Pandas** + **NumPy** for data preprocessing
- **Joblib** for model serialization
- **Imbalanced-learn** (SMOTE) for class balancing

### Dataset
- **Primary:** Kaggle symptom-disease dataset (174 symptoms, 46 diseases — balanced size for training demo)
- **Fallback:** Mendeley "Disease and Symptoms 2023" (773 diseases, 377 symptoms)
- Download script must be included in `/scripts/download_data.py`

### Deployment
- **Frontend:** Vercel or Netlify (free tier)
- **Backend:** Render.com free tier (or Hugging Face Spaces with Docker)
- **Model files:** Stored in `/backend/models/` directory, committed to repo

---

## 3. FOLDER STRUCTURE

```
disease-predictor/
├── frontend/
│   ├── public/
│   │   └── favicon.ico
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx
│   │   │   ├── SymptomSelector.jsx
│   │   │   ├── PredictionCard.jsx
│   │   │   ├── ModelComparisonChart.jsx
│   │   │   ├── DiseaseDetailModal.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   ├── InfoBanner.jsx
│   │   │   └── Footer.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── About.jsx
│   │   │   └── HowItWorks.jsx
│   │   ├── hooks/
│   │   │   └── usePrediction.js
│   │   ├── utils/
│   │   │   └── api.js
│   │   ├── data/
│   │   │   └── diseaseInfo.js       ← static lookup: disease → description + precautions
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
│
├── backend/
│   ├── main.py                      ← FastAPI app entry point
│   ├── models/
│   │   ├── logistic_model.pkl
│   │   ├── knn_model.pkl
│   │   ├── tree_model.pkl
│   │   └── symptom_encoder.pkl      ← MultiLabelBinarizer or column list
│   ├── training/
│   │   ├── train.py                 ← full training pipeline
│   │   └── preprocess.py
│   ├── data/
│   │   └── dataset.csv              ← placed after running download script
│   ├── requirements.txt
│   └── Dockerfile
│
├── scripts/
│   └── download_data.py
│
├── README.md
└── .env.example
```

---

## 4. UI/UX DESIGN SPECIFICATION

### Design Philosophy
Clinical trust + approachable warmth. The UI must feel like a well-designed health portal — not a hospital sterility but not a social app either. Inspired by modern telehealth platforms (e.g., Zocdoc, Ada Health).

### Color Palette

```
--color-bg:           #F7F9FC    ← main page background (off-white blue tint)
--color-surface:      #FFFFFF    ← cards and panels
--color-primary:      #2563EB    ← CTA buttons, active states (blue-600)
--color-primary-light:#EFF6FF    ← symptom chip hover, selected bg (blue-50)
--color-secondary:    #10B981    ← success states, confidence high (emerald-500)
--color-warning:      #F59E0B    ← medium confidence (amber-500)
--color-danger:       #EF4444    ← low confidence / error states (red-500)
--color-text-primary: #111827    ← headings (gray-900)
--color-text-secondary:#6B7280   ← sub-labels, hints (gray-500)
--color-border:       #E5E7EB    ← dividers, card borders (gray-200)
--color-accent-sage:  #D1FAE5    ← chip selected background alt
```

**BANNED colors:** No `#000000`, no `#1F1F1F`, no dark grays as backgrounds anywhere. All page backgrounds, card backgrounds, and modals must be white or light-tinted variants.

### Typography

```
Display / Headings : "Inter" (700, 600) — loaded from Google Fonts
Body               : "Inter" (400, 500)
Monospaced labels  : "JetBrains Mono" — used only for confidence percentage displays
```

Font scale:
- H1: `text-4xl font-bold` — page hero
- H2: `text-2xl font-semibold` — section headings
- H3: `text-lg font-semibold` — card titles
- Body: `text-base font-normal`
- Caption: `text-sm text-gray-500`

### Layout Rules

- Max content width: `max-w-5xl mx-auto`
- Page padding: `px-4 md:px-8`
- Card radius: `rounded-2xl`
- Card shadow: `shadow-sm border border-gray-200`
- Section spacing: `py-12 md:py-16`
- Grid: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`

### Component-Level UI Specs

#### Header
- White background, subtle bottom border (`border-b border-gray-100`)
- Left: Logo icon (stethoscope SVG or emoji) + app name "SymptomSense"
- Right: Nav links — Home | How It Works | About
- Sticky on scroll (`sticky top-0 z-50 backdrop-blur-sm bg-white/90`)
- No hamburger menus for desktop; include mobile hamburger

#### Hero Section (Home page)
- Background: gradient from `#F7F9FC` to `#EFF6FF` (very subtle blue wash)
- Large headline: "Find out what your symptoms might mean."
- Sub-headline: "Select your symptoms below and our AI models will predict the most likely conditions."
- Disclaimer badge: soft yellow pill — "⚕️ For educational purposes only. Not a substitute for medical advice."
- CTA: "Start Checking →" button scrolls to symptom selector

#### Symptom Selector (Main interactive area)
- Search input at top: `placeholder="Search symptoms..."` with magnifier icon
- Below: scrollable symptom chip grid (all available symptoms as clickable pills)
  - Default chip: white background, gray border, gray text
  - Selected chip: `bg-blue-50 border-blue-400 text-blue-700 font-medium`
  - Hover: subtle scale and border color shift
- Right side (or below on mobile): "Selected Symptoms" panel
  - Shows selected symptoms as dismissible tags
  - Count badge: "3 symptoms selected"
  - "Clear All" link (red text, no button style)
- "Predict Disease" button:
  - Full width on mobile, `w-64` on desktop
  - Solid blue, white text, rounded-full
  - Loading spinner replaces text during API call
  - Disabled + grayed if 0 symptoms selected

#### Prediction Results Section
Appears below after prediction, with a smooth fade-in animation.

**Layout:** Three tabs — "All Models" | "Logistic Regression" | "KNN" | "Decision Tree"

For each model:
- Card with model name badge (colored label: LR = blue, KNN = emerald, DT = amber)
- Top 3 predicted diseases listed as ranked rows:
  - Rank number (1/2/3)
  - Disease name (bold)
  - Confidence percentage in `JetBrains Mono`
  - Horizontal progress bar:
    - > 70% → green (`bg-emerald-400`)
    - 40–70% → amber (`bg-amber-400`)
    - < 40% → red (`bg-red-400`)
  - "Learn more →" link that opens DiseaseDetailModal

**Model Comparison Chart:**
- `Recharts` BarChart
- X-axis: Disease names (top 5 from best model)
- Y-axis: Confidence %
- Bars grouped by model (3 bars per disease, each model a different color)
- Chart background: white, grid lines: `stroke="#F3F4F6"`
- No dark legend backgrounds

#### Disease Detail Modal
- Overlay: `bg-black/30 backdrop-blur-sm` (overlay only, not content)
- Modal panel: white, `rounded-3xl`, `max-w-lg`
- Content:
  - Disease name (H2)
  - Short description (2–3 sentences, from `diseaseInfo.js` lookup)
  - Symptoms commonly associated (badge list)
  - Precautions (bulleted list with checkmark icons)
  - "See a doctor if symptoms persist" — red callout box
  - Close button top-right

#### How It Works Page
Three-step horizontal layout (on desktop):
1. Select Symptoms → 2. Run AI Models → 3. View Predictions

Each step as a card with:
- Step number in a large light-blue circle
- Icon (SVG)
- Title + 2-line description

Then a "Models Used" section — comparison table:

| Model | Strengths | Weakness | Best For |
|---|---|---|---|
| Logistic Regression | Interpretable, fast | Linear assumptions | High-dim binary features |
| KNN | Flexible, no assumptions | Slow on large data | Well-separated clusters |
| Decision Tree | Rule-based, visual | Prone to overfitting | Explainability |

#### Footer
- Light gray background (`bg-gray-50`)
- Left: App name + tagline
- Center: Quick links
- Right: GitHub repo link
- Bottom: "Built for educational purposes. Not a medical device."

---

## 5. BACKEND API SPECIFICATION

### Base URL
`/api/v1`

### Endpoints

#### `GET /symptoms`
Returns the full list of available symptoms the model was trained on.

**Response:**
```json
{
  "symptoms": ["fever", "cough", "fatigue", "headache", "..."]
}
```

#### `POST /predict`
Accepts selected symptoms, returns predictions from all three models.

**Request Body:**
```json
{
  "symptoms": ["fever", "cough", "fatigue"]
}
```

**Response:**
```json
{
  "models": {
    "logistic_regression": [
      { "disease": "Influenza", "confidence": 0.82 },
      { "disease": "Common Cold", "confidence": 0.61 },
      { "disease": "COVID-19", "confidence": 0.44 }
    ],
    "knn": [ ... ],
    "decision_tree": [ ... ]
  },
  "top_prediction": "Influenza",
  "agreement": "2/3 models agree"
}
```

#### `GET /health`
Health check endpoint.
```json
{ "status": "ok", "models_loaded": true }
```

### CORS
Allow origins: `["http://localhost:5173", "https://your-vercel-app.vercel.app"]`

---

## 6. BACKEND TRAINING PIPELINE (`training/train.py`)

Follow these steps exactly in the training script:

### Step 1: Load Data
```python
df = pd.read_csv("data/dataset.csv")
```

### Step 2: Preprocess
- Melt all `Symptom_1` … `Symptom_N` columns into a multi-hot binary matrix
- Use `MultiLabelBinarizer` or `get_dummies` after stacking
- Save column order to `symptom_encoder.pkl` using `joblib`
- Target column: `prognosis` (disease label)
- Encode target with `LabelEncoder`, save encoder

### Step 3: Handle Imbalance
```python
from imblearn.over_sampling import SMOTE
X_res, y_res = SMOTE(random_state=42).fit_resample(X_train, y_train)
```

### Step 4: Train All Three Models

```python
from sklearn.linear_model import LogisticRegression
from sklearn.neighbors import KNeighborsClassifier
from sklearn.tree import DecisionTreeClassifier

lr = LogisticRegression(multi_class='multinomial', C=1.0, max_iter=1000, random_state=42)
knn = KNeighborsClassifier(n_neighbors=5, metric='hamming')
dt = DecisionTreeClassifier(max_depth=15, min_samples_leaf=3, random_state=42)
```

### Step 5: Cross-Validation
Run 5-fold stratified CV on each model and print:
- Accuracy per fold
- Mean accuracy ± std
- Classification report on test set

### Step 6: Save Models
```python
import joblib
joblib.dump(lr, "models/logistic_model.pkl")
joblib.dump(knn, "models/knn_model.pkl")
joblib.dump(dt, "models/tree_model.pkl")
joblib.dump(mlb, "models/symptom_encoder.pkl")
```

---

## 7. FASTAPI MAIN APP (`backend/main.py`)

```python
# Skeleton structure — implement fully
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import joblib, numpy as np

app = FastAPI(title="Disease Predictor API")

# Load all models at startup using @app.on_event("startup")
# Expose /symptoms, /predict, /health endpoints
# On /predict: encode input symptoms using saved encoder → predict_proba → top 3 per model
# Return structured JSON matching API spec above
```

---

## 8. REACT FRONTEND IMPLEMENTATION DETAILS

### `src/utils/api.js`
```js
import axios from 'axios'

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'

export const getSymptoms = () => axios.get(`${BASE}/symptoms`)
export const predict = (symptoms) => axios.post(`${BASE}/predict`, { symptoms })
```

### `src/hooks/usePrediction.js`
Custom hook that manages:
- `loading` state
- `results` state
- `error` state
- Calls `predict()` and updates state
- Returns `{ loading, results, error, runPrediction }`

### `src/data/diseaseInfo.js`
Static object keyed by disease name:
```js
export const diseaseInfo = {
  "Influenza": {
    description: "A viral respiratory illness...",
    commonSymptoms: ["fever", "cough", "fatigue"],
    precautions: ["Rest", "Hydration", "Antiviral if within 48 hrs"],
  },
  // ... add at least 30 diseases
}
```

### Tailwind Config
```js
// tailwind.config.js
module.exports = {
  darkMode: false,  // ← HARD DISABLE dark mode
  content: ["./src/**/*.{jsx,js,html}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        brand: {
          50:  '#EFF6FF',
          100: '#DBEAFE',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
        }
      }
    }
  }
}
```

---

## 9. IMPLEMENTATION CHECKLIST (Build Order)

The agent must complete all tasks in this order. Do not skip steps.

### Phase 1 — Project Setup
- [ ] Scaffold Vite React app in `/frontend`
- [ ] Install: `tailwindcss postcss autoprefixer recharts axios react-router-dom`
- [ ] Configure Tailwind with `darkMode: false`
- [ ] Add Google Fonts link (Inter + JetBrains Mono) to `index.html`
- [ ] Set up `.env.example` with `VITE_API_URL=http://localhost:8000/api/v1`
- [ ] Initialize FastAPI project in `/backend`
- [ ] Create `requirements.txt`: `fastapi uvicorn scikit-learn pandas numpy joblib imbalanced-learn`

### Phase 2 — Data & Model Training
- [ ] Write `scripts/download_data.py` (Kaggle API or direct URL fetch of dataset)
- [ ] Write `backend/training/preprocess.py` — cleans CSV, outputs X, y
- [ ] Write `backend/training/train.py` — full pipeline per Section 6
- [ ] Run training, verify all 3 `.pkl` files are generated
- [ ] Print and record accuracy metrics (include in README)

### Phase 3 — Backend API
- [ ] Build `backend/main.py` with all 3 endpoints per Section 5
- [ ] Test all endpoints with `curl` or Swagger UI at `/docs`
- [ ] Verify `/predict` returns correct structure with confidence floats
- [ ] Add input validation (max 20 symptoms, unknown symptoms handled gracefully)
- [ ] Write `backend/Dockerfile`

### Phase 4 — Frontend Core
- [ ] Build `Header.jsx` — sticky nav, logo, links
- [ ] Build `Home.jsx` — hero section with disclaimer badge
- [ ] Build `SymptomSelector.jsx` — searchable chip grid + selected panel
  - Fetch symptoms from `/api/v1/symptoms` on mount
  - Filter chips as user types in search box
  - Toggle chip selection on click
- [ ] Build `usePrediction.js` hook
- [ ] Wire "Predict Disease" button to hook → POST to backend
- [ ] Build `PredictionCard.jsx` — ranked disease list with progress bars
- [ ] Build `ModelComparisonChart.jsx` — Recharts grouped bar chart
- [ ] Build `DiseaseDetailModal.jsx` — slide-up panel with disease info
- [ ] Add `InfoBanner.jsx` — persistent disclaimer at top of results
- [ ] Build `LoadingSpinner.jsx` — animated spinner for async states

### Phase 5 — Additional Pages
- [ ] Build `HowItWorks.jsx` — 3-step layout + model comparison table
- [ ] Build `About.jsx` — dataset sources, project context, tech stack badges
- [ ] Wire React Router in `App.jsx`
- [ ] Build `Footer.jsx`

### Phase 6 — Polish & QA
- [ ] Confirm NO dark background colors exist in any component
- [ ] Test on mobile (375px width) — all layouts must be usable
- [ ] Add `aria-label` to all interactive elements
- [ ] Add `disabled` state to predict button when no symptoms selected
- [ ] Test unknown disease fallback in modal (show "No info available")
- [ ] Test empty state: 0 symptoms → helpful message, not error
- [ ] Test error state: API down → show error banner with retry button
- [ ] Add smooth scroll from hero CTA to symptom selector
- [ ] Add fade-in animation for results section (CSS transition, not JS-heavy)
- [ ] Verify Recharts chart is fully responsive

### Phase 7 — Deployment
- [ ] Push to GitHub (public repo)
- [ ] Deploy backend to Render.com (free tier, Web Service, Python)
  - Set build command: `pip install -r requirements.txt`
  - Set start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
- [ ] Deploy frontend to Vercel
  - Set `VITE_API_URL` environment variable to Render backend URL
- [ ] Update README with live links and screenshots
- [ ] Verify live app end-to-end

---

## 10. ERROR HANDLING REQUIREMENTS

| Scenario | Frontend Behavior |
|---|---|
| No symptoms selected + predict clicked | Show inline warning: "Please select at least 1 symptom" |
| API returns 500 | Show error banner: "Prediction failed. Please try again." with retry button |
| Network timeout | Same error banner |
| Disease not in `diseaseInfo.js` | Modal shows: "Detailed info not available for this condition." |
| Empty symptom list from API | Show placeholder: "Symptom list unavailable. Try refreshing." |
| Unknown symptom submitted | Backend should filter it out and proceed with known ones |

---

## 11. README REQUIREMENTS

The `README.md` must include:

1. **Project title + one-line description**
2. **Live demo link**
3. **Screenshot** (add a placeholder comment `<!-- add screenshot -->`)
4. **Tech stack badges** (shields.io)
5. **Setup instructions:**
   - Backend: `cd backend && pip install -r requirements.txt && python training/train.py && uvicorn main:app`
   - Frontend: `cd frontend && npm install && npm run dev`
6. **Dataset source and license acknowledgement**
7. **Model accuracy table** (populated after training):

```
| Model               | CV Accuracy | Test Accuracy |
|---------------------|-------------|---------------|
| Logistic Regression |             |               |
| KNN                 |             |               |
| Decision Tree       |             |               |
```

8. **Disclaimer:** "This app is for educational purposes only."
9. **License:** MIT

---

## 12. CONSTRAINTS & RULES FOR THE AGENT

1. **NEVER use dark backgrounds.** If any component has `bg-gray-800`, `bg-gray-900`, `bg-black`, `bg-zinc-*` (>700), or similar — remove it immediately.
2. **No placeholder.com images.** Use SVG icons (Heroicons or inline SVG) throughout.
3. **No hardcoded API URLs.** Always use `import.meta.env.VITE_API_URL`.
4. **Model files must be committed.** Do not `.gitignore` the `.pkl` files — they are small enough to commit.
5. **All three models must run on every prediction.** Do not skip a model even if another performs better.
6. **`predict_proba` must be used**, not just `predict`. Confidence percentages are a core feature.
7. **The disclaimer banner must appear on every page** and in the results section.
8. **Mobile-first.** Every component should be styled for 375px first, then scaled up.
9. **No external UI libraries** (no Material UI, no Ant Design, no Chakra). Tailwind only.
10. **Run linting** (`eslint`) before declaring frontend complete.

---

## 13. DELIVERABLES SUMMARY

By end of build, the following must exist and work:

- [ ] `frontend/` — complete React app, running on `localhost:5173`
- [ ] `backend/` — FastAPI app with 3 trained models, running on `localhost:8000`
- [ ] `backend/models/*.pkl` — 3 model files + encoder
- [ ] `scripts/download_data.py` — reproducible data acquisition
- [ ] `README.md` — complete with setup instructions
- [ ] Live URL (Vercel) — frontend accessible
- [ ] Live URL (Render) — backend `/docs` accessible
- [ ] No console errors in browser dev tools
- [ ] All 3 API endpoints return correct responses

---

*This spec is self-contained. An AI coding agent should be able to produce a fully working app from this document alone, in one pass, without asking any clarifying questions.*