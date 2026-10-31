# 🥗 FoodVerse – Multimodal AI Food Intelligence Platform

> A modern, scalable, multimodal AI platform integrating Computer Vision, Neural Spoilage Analysis, HACCP Commercial Kitchen Video Auditing, Conversational Cooking Intelligence, and Precision Meal Planning.

![FoodVerse Status](https://img.shields.io/badge/status-active-10b981?style=for-the-badge)
![FastAPI](https://img.shields.io/badge/backend-FastAPI_0.110+-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/frontend-React_18_+_Vite_5-61dafb?style=for-the-badge&logo=react&logoColor=black)
![Computer Vision](https://img.shields.io/badge/AI-OpenCV_%2B_VisionNet-ff6f00?style=for-the-badge&logo=opencv&logoColor=white)

---

## 🌟 1. Project Overview

**FoodVerse** is an end-to-end multimodal artificial intelligence food analysis platform. Designed for home cooks, health-conscious consumers, restaurants, and safety auditors, FoodVerse ingests:
- 📸 **Images**: Food dishes, raw produce, ingredient clusters, and packaged foods.
- 🎥 **Video**: Real-time or recorded commercial restaurant kitchen CCTV footage.
- 🎙️ **Audio / Speech**: Natural language voice commands and culinary inquiries.
- 📝 **Text**: Nutritional goals, anaphylactic allergies, and available pantry items.

The platform processes these multimodal signals to produce structured, actionable food intelligence—not raw unstructured model logs.

---

## 🚀 2. Core Features

### A. 📷 AI Food Recognition
- **Upload & Segmentation**: Drag-and-drop food dish images or choose from built-in high-resolution test samples.
- **Multiple Item Detection**: Identifies primary meals as well as individual side dishes, garnishes, and ingredients.
- **Confidence Scores**: Displays mathematical confidence percentages for each detected component.
- **Visual Bounding Regions**: Provides bounding box coordinates across dishes for component inspection.
- **Seamless Hand-Off**: One-click action jumps directly to nutrition and health scoring for the identified dish.

### B. ⚡ AI Nutrition & Health Scoring
- **Automated Caloric Estimation**: Measures total energy (kcal) calibrated against portion weights.
- **Macronutrient Breakdown**: Protein (g), Carbohydrates (g), Fats (g), Dietary Fiber (g), and Total Sugars (g).
- **Micronutrient Density**: Sodium (mg), Potassium (mg), Vitamin C (%), and Iron (%).
- **Algorithmic Health Score (0–100)**: Formulates an overall Health Score and Letter Grade (A+, A, B, C, D) based on nutrient density, glycemic index balance, and saturated fat ratios.
- **Interactive Visualizations**: Recharts daily value bar graphs and macronutrient ratio donut charts.
- **Portion Disclaimer**: Prominently notes that values are algorithmic estimations based on standard reference databases.

### C. 🛡️ Food Freshness & Spoilage Detection
- **Computer Vision Spectral Analysis**: Inspects images for color shifts in LAB and HSV color spaces, surface texture roughness (Laplacian variance), and localized fungal spore clusters.
- **Three-Tier Classification**:
  1. `Fresh` (optimal sensory & nutritional quality, long shelf life)
  2. `Moderately Fresh` (early ripening/oxidation, consume within 24-48 hours)
  3. `Potentially Spoiled` (visible mycelium colonies, enzymatic browning, tissue collapse)
- **Visual Anomalies Breakdown**: Severity levels and affected surface area percentages.
- **Safety Directive**: Emphasizes that visual computer vision alone cannot detect odorless bacterial toxins or confirm microbiological sterility.

### D. 📹 Restaurant Kitchen Hygiene CCTV Monitoring
- **Surveillance Video Ingestion**: Upload kitchen video clips or test using the bundled HACCP prep-station demo video.
- **Frame-by-Frame Automated Auditing**:
  - Employee glove adherence and bare-hand contact prevention (FDA Food Code 3-301.11).
  - Hairnet and beard restraint usage in active cooking zones.
  - Cross-contamination risk detection (e.g. raw poultry near ready-to-eat salad prep).
  - Cleanliness and cutting board sanitation lapses.
  - Uncovered food containers stored under shelves.
- **Timestamped Incident Chronology**: Flagged violations with exact timecodes (e.g. `00:06`, `00:14`, `00:22`), risk levels (`Low`, `Medium`, `High`, `Critical`), and supervisory corrective actions.
- **Overall Hygiene Score**: 0–100 compliance rating and letter grade.
- **Audit Verification Notice**: Highlights that automated video observations require certified food safety officer human confirmation.

### E. 🍳 Smart AI Cooking Assistant
- **Pantry Match Engine**: Enter available ingredients or select detected foods to dynamically generate chef-crafted recipes.
- **Structured Recipe Blueprints**: Prep time, cook time, difficulty level, servings, ingredients with smart substitutions, step-by-step instructions, and chef secret techniques.
- **Interactive Conversational Chatbot**: Built-in culinary chatbot equipped to answer queries on emulsification, sear temperatures, ingredient replacements, and wine pairings.
- **Voice-Enabled Interaction**: Integrated Web Speech API for hands-free voice commands while cooking.
- **Personal Recipe Bookmarking**: Save bespoke recipes to your account with a single click.

### F. 📅 Personalized AI Meal Planner
- **Metabolic Profile Ingestion**: Age, fitness goals, daily calorie targets, and dietary style (Mediterranean, Keto, High Protein, Plant-Based).
- **7-Day Dynamic Calendar**: Full Monday–Sunday schedules covering Breakfast, Lunch, Dinner, and Healthy Snacks.
- **Anaphylactic Allergen Guard**: Automatically screens out allergens (Peanuts, Tree Nuts, Dairy, Shellfish, Gluten, Soy, Eggs, Sesame) and flags potential cross-contamination risks.
- **Nutritional Trajectory Graphs**: Visualizes daily calorie consistency and protein allocation across the week.

### G. 🖨️ Professional Exportable Dossiers
- Download or print formatted Food Intelligence Dossiers, Produce Freshness Assessments, and Official HACCP Kitchen Hygiene Inspection Reports in one click.

---

## 🛠️ 3. Technology Stack

### Frontend
- **Framework**: React.js (v18.3)
- **Build Tool**: Vite (v5.4)
- **Styling**: Tailwind CSS (v3.4) with custom emerald/dark glassmorphic theme
- **Icons**: Lucide React
- **Data Visualizations**: Recharts (v2.15)
- **Routing**: React Router DOM (v6.28)
- **HTTP Client**: Axios (v1.7)
- **Voice Processing**: HTML5 Web Speech API

### Backend
- **Framework**: Python 3.11 + FastAPI (v0.110+)
- **Server**: Uvicorn with ASGI async runtime
- **Data Validation**: Pydantic v2
- **ORM / Database**: SQLAlchemy 2.0 with SQLite (zero-config local) & PostgreSQL support
- **Authentication**: JWT (JSON Web Tokens) + Direct Salted Bcrypt Password Hashing
- **File Handling**: Aiofiles + Python-Multipart (with size and mime-type enforcement)

### AI / Computer Vision
- **Image & Video Processing**: OpenCV (`opencv-python-headless`), Pillow, NumPy
- **Feature Extractors**: LAB colorimetry, HSV color masks, Laplacian variance texture roughness, edge density
- **Multimodal AI Hub**: Pluggable provider architecture with native Google Gemini 2.5 Flash / Pro Vision integration + intelligent local computer vision and NLP heuristics fallback.

---

## 📁 4. Project Folder Structure

```
foodverse/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                     # FastAPI application setup, CORS, static mounts
│   │   ├── config.py                   # Pydantic BaseSettings & environment variables
│   │   ├── database.py                 # SQLAlchemy engine & session factory
│   │   ├── models/
│   │   │   ├── user.py                 # User authentication & biometrics model
│   │   │   ├── analysis.py             # Food scan, freshness, and hygiene audit records
│   │   │   ├── recipe.py               # Bookmarked recipes
│   │   │   └── meal_plan.py            # 7-day personalized meal plans
│   │   ├── schemas/
│   │   │   ├── auth.py                 # Register, Login, Token schemas
│   │   │   ├── food.py                 # Dish & Ingredient detection schemas
│   │   │   ├── nutrition.py            # Macros, Micros, and Health Score schemas
│   │   │   ├── freshness.py            # Spoilage & Freshness schemas
│   │   │   ├── hygiene.py              # Video audit & Violation schemas
│   │   │   ├── recipe.py               # Recipe generation & Chat schemas
│   │   │   └── meal_plan.py            # Weekly meal calendar schemas
│   │   ├── services/
│   │   │   ├── multimodal_ai_service.py # Gemini 2.5 Vision & local AI hub
│   │   │   ├── food_vision_service.py  # OpenCV dish & ingredient segmentation
│   │   │   ├── nutrition_service.py    # USDA nutritional density & health score
│   │   │   ├── freshness_service.py    # Spectral colorimetry & decay classifier
│   │   │   ├── hygiene_service.py      # Video frame pose & HACCP auditor
│   │   │   ├── cooking_assistant_service.py # Chef recipes & conversational chat
│   │   │   └── meal_planner_service.py # 7-day nutritional scheduler & allergen guard
│   │   ├── utils/
│   │   │   ├── security.py             # Bcrypt hashing & JWT token verification
│   │   │   ├── media_storage.py        # Safe chunked upload & size validation
│   │   │   └── sample_data.py          # Synthetic test image/video generator & DB seeder
│   │   └── api/
│   │       ├── auth.py                 # /api/auth
│   │       ├── food_recognition.py     # /api/food-recognition
│   │       ├── nutrition.py            # /api/nutrition
│   │       ├── freshness.py            # /api/freshness
│   │       ├── hygiene.py              # /api/hygiene
│   │       ├── recipes.py              # /api/recipes
│   │       ├── meal_plans.py           # /api/meal-plans
│   │       ├── chat.py                 # /api/chat
│   │       └── history.py              # /api/history
│   ├── sample_media/                   # Bundled test images and HACCP CCTV video
│   ├── uploads/                        # User uploaded media
│   ├── requirements.txt
│   ├── .env.example
│   ├── run.py                          # Backend runner
│   └── test_api.py                     # Automated unit and integration test suite
├── frontend/
│   ├── public/
│   │   └── sample_media/               # Synchronized client test assets
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx              # Navigation with status & 1-click demo button
│   │   │   ├── Footer.jsx              # Disclaimers & architecture info
│   │   │   ├── MetricCard.jsx          # Reusable glowing KPI card
│   │   │   ├── ImageUploader.jsx       # Drag & drop uploader with instant samples
│   │   │   ├── VideoUploader.jsx       # Video uploader with demo surveillance player
│   │   │   └── ExportReportModal.jsx   # Printable dossier modal
│   │   ├── context/
│   │   │   └── AuthContext.jsx         # User session & 1-click demo auth state
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx         # Marketing hero, pipeline showcase, features
│   │   │   ├── LoginPage.jsx           # Sign in with instant demo button
│   │   │   ├── RegisterPage.jsx        # Account registration
│   │   │   ├── ForgotPasswordPage.jsx  # Recovery workflow
│   │   │   ├── DashboardPage.jsx       # Health trend charts, metrics, quick tools
│   │   │   ├── FoodRecognitionPage.jsx # AI dish segmentation & ingredient tags
│   │   │   ├── NutritionAnalysisPage.jsx # Macro bar graphs, pie charts, health score
│   │   │   ├── FreshnessDetectionPage.jsx # Colorimetry decay & shelf life
│   │   │   ├── RestaurantHygienePage.jsx # Video CCTV auditing & timecoded violations
│   │   │   ├── CookingAssistantPage.jsx # Pantry recipe matcher & voice assistant
│   │   │   ├── MealPlannerPage.jsx     # 7-day calendar & allergen guard
│   │   │   └── ProfileSettingsPage.jsx # Biometrics, API keys, and history table
│   │   ├── services/
│   │   │   └── api.js                  # Axios client with JWT interceptor
│   │   ├── App.jsx                     # Route architecture
│   │   ├── main.jsx                    # React root entry
│   │   └── index.css                   # Tailwind styles, glassmorphism, glowing badges
│   ├── package.json
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── vite.config.js
│   └── .env.example
├── start-foodverse.ps1                 # One-click full-stack PowerShell runner
└── README.md
```

---

## ⚡ 5. Installation & Execution Guide

### Prerequisites
- **Python 3.10+** (Python 3.11 installed in portable virtualenv)
- **Node.js 18+** (Node v20.18 LTS / npm 10.8 available)

### Quick One-Click Launch (Windows PowerShell)
From the project root:
```powershell
.\start-foodverse.ps1
```
This automatically launches the FastAPI backend on port `8000` and the Vite React frontend on port `5173`.

---

### Manual Step-by-Step Setup

#### 1. Backend Setup
```powershell
cd backend

# Create virtual environment (if not already created)
uv venv .venv --python 3.11
# or: python -m venv .venv

# Activate environment
.\.venv\Scripts\activate

# Install dependencies
uv pip install -r requirements.txt
# or: pip install -r requirements.txt

# Start backend server
python run.py
```
Backend runs at: **http://127.0.0.1:8000**  
Interactive Swagger API Docs: **http://127.0.0.1:8000/docs**

#### 2. Frontend Setup
In a second terminal window:
```powershell
cd frontend

# Install packages
npm install

# Start Vite dev server
npm run dev
```
Frontend runs at: **http://localhost:5173**

---

## 🧪 6. Automated Testing Instructions

The project includes an automated test suite verifying all 9 core API modules:
```powershell
cd backend
.\.venv\Scripts\python.exe test_api.py
```

Expected output:
```
[PASS] Health Check Passed
[PASS] Demo Login & JWT Authentication Passed
[PASS] AI Food Recognition Passed
[PASS] AI Nutrition & Health Scoring Passed
[PASS] AI Food Freshness Classification Passed (Fresh & Spoiled)
[PASS] Restaurant Kitchen Video Surveillance Passed
[PASS] Smart Cooking Assistant & Culinary Chat Passed
[PASS] Personalized 7-Day Meal Planner with Allergen Guard Passed
[PASS] Dashboard Aggregates & History Passed

Ran 9 tests in 0.427s - OK
```

To test the frontend production build:
```powershell
cd frontend
npm run build
```
Builds `dist/` with 0 errors.

---

## 🔑 7. Environment Variables Configuration

### Backend (`backend/.env`):
```env
PROJECT_NAME="FoodVerse – Multimodal AI Food Intelligence Platform"
SECRET_KEY="foodverse_super_secret_jwt_key_2026_modern_ai_platform"
DATABASE_URL="sqlite:///./foodverse.db"

# Optional External Multimodal AI Key:
GEMINI_API_KEY=""
```
*(If `GEMINI_API_KEY` is not provided, the platform automatically utilizes its local Computer Vision feature extractors and culinary knowledge engines with full fidelity).*

### Frontend (`frontend/.env`):
```env
VITE_API_URL="/api"
```

---

## 👥 8. Demo Credentials & Sample Data

FoodVerse includes pre-seeded demo accounts and bundled test media for instant testing:

- **1-Click Demo**: Click the **"1-Click Demo"** button on the Navbar or Login page.
- **Demo Email**: `demo@foodverse.ai`
- **Demo Password**: `FoodVerseDemo2026!`
- **Sample Images Available**:
  - `Quinoa Salad Bowl` (Vegetable, Grain, Feta)
  - `Pan-Seared Atlantic Salmon` (Seafood, Asparagus)
  - `Avocado Toast with Poached Egg` (Breakfast, Healthy Fat)
  - `Penne all'Arrabbiata` (Italian, Marinara)
  - `Fresh Garden Greens` (Fresh produce test)
  - `Moderately Ripe Apple` (Ripening stage test)
  - `Spoiled Strawberry` (Fungal mold detection test)
  - `Kitchen CCTV Surveillance Video` (HACCP kitchen hygiene test)

---

## ⚖️ 9. Disclaimers & Regulatory Notices

1. **Nutritional Estimations**: Values generated by FoodVerse are algorithmic estimates calculated from visual portion weights and standard USDA reference databases. Preparation techniques, hidden oils, and regional variants can cause variance.
2. **Food Freshness & Safety**: Visual computer vision analysis examines outward physical morphology, cellular wrinkling, and pigment collapse. It **cannot** confirm microbiological sterility or detect odorless pathogens (e.g. Salmonella, Listeria, E. coli). Always smell and inspect items before consumption.
3. **Hygiene Surveillance**: Commercial kitchen video auditing flags probable deviations for human supervisory review. It does not replace physical inspection by certified health inspectors.

---

## 📜 10. License

Built for advanced multimodal food intelligence and AI-assisted culinary safety.
© 2026 FoodVerse Platform. All rights reserved.
