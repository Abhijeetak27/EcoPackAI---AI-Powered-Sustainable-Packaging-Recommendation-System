# EcoPackAI - Project Context & Guidelines

## 🌿 Project Overview
**EcoPackAI** is an AI-powered sustainability intelligence platform designed to help businesses transition to eco-friendly packaging. It features a recommendation engine that evaluates materials based on biodegradability, CO₂ impact, cost, and functional suitability for specific product categories.

### Tech Stack
- **Frontend:** React 18, Vite, TypeScript, Tailwind CSS, shadcn/ui, Recharts (Data Viz), Framer Motion (Animations).
- **Backend:** FastAPI (Python), MongoDB (Motor/Async Driver), Scikit-Learn (ML predictions).
- **Deployment:** Render (Full-stack configuration serving frontend dist via FastAPI).

---

## 🚀 Building and Running

### Prerequisites
- Node.js ≥ 18
- Python ≥ 3.9
- MongoDB (Running locally or via Atlas)

### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Linux/macOS
# or: venv\Scripts\activate  # Windows
pip install -r requirements.txt
python seed.py            # Initialize database with 26 materials
uvicorn main:app --reload --port 8000
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
The frontend defaults to `http://localhost:5173` and proxies (or expects) the backend at `http://localhost:8000`.

### Full-stack Build (Production)
```bash
cd frontend && npm run build
cd ../backend && uvicorn main:app
```
FastAPI serves the static files from `frontend/dist`.

---

## 📂 Key Directory Structure

- `backend/`: FastAPI application.
  - `main.py`: Entry point and static file serving.
  - `routes/`: API endpoints (`auth`, `materials`, `recommendations`, `reports`).
  - `ml/`: Scikit-learn model loading and prediction logic (`predictor.py`).
  - `database.py`: MongoDB connection and configuration.
  - `models.py`: Pydantic schemas for request/response validation.
- `frontend/src/`: React source code.
  - `pages/`: Main views (Dashboard, Recommend, Materials, Compare, Report).
  - `components/`: UI components (including `ui/` for shadcn/ui primitives).
  - `lib/`: Core logic, including the client-side `recommendation-engine.ts`.
  - `data/`: Static material dataset (used for client-side fallbacks/testing).

---

## 🧠 Recommendation Engine & ML
The system uses a weighted scoring algorithm to rank materials:
- **Suitability Score (35%):** Functional fit for category and fragility.
- **Eco Score (35% * weight):** Predicted CO₂ impact normalized.
- **Cost Efficiency (35% * weight):** Predicted cost per unit normalized.
- **Biodegradability (15% * weight):** Direct material metric.
- **Recyclability (15% * weight):** Direct material metric.

The **ML Predictor** (`backend/ml/predictor.py`) uses a pre-trained `model.pkl` to predict cost and CO₂ based on product weight, volume, and shipping distance. It falls back to a deterministic formula if the model file is missing.

---

## 🛠 Development Conventions

### Styling & UI
- Use **Tailwind CSS** for layout and styling.
- Prefer **shadcn/ui** components located in `frontend/src/components/ui/`.
- Icons are provided by **Lucide React**.

### API Guidelines
- All backend routes are prefixed with `/api/`.
- Use Pydantic models in `backend/models.py` for all data exchange.
- Use `AsyncIOMotorClient` for database operations to maintain non-blocking performance.

### Testing
- **Frontend Unit Tests:** `npm run test` (Vitest).
- **End-to-End Tests:** `npx playwright test`.
- **Backend Tests:** TODO: Implement pytest suite.

### Contribution Workflow
1. Ensure the backend is running and seeded.
2. If modifying the recommendation logic, update both `frontend/src/lib/recommendation-engine.ts` and `backend/routes/recommendations.py` to maintain consistency (or transition fully to the API).
3. Run `npm run lint` before committing frontend changes.
