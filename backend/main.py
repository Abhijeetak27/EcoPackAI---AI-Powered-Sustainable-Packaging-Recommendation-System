"""
EcoPackAI — FastAPI entry point.
Serves the React build (frontend/dist) as static files.
All API routes are mounted under /api/.
"""

import os
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from database import connect_db, close_db
from routes import auth, materials, recommendations, reports

load_dotenv()


@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_db()
    yield
    await close_db()


app = FastAPI(title="EcoPackAI API", version="1.0.0", lifespan=lifespan)

# ── CORS (dev only — tighten in prod) ─────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── API routes ────────────────────────────────────────────────────────────────
app.include_router(auth.router)
app.include_router(materials.router)
app.include_router(recommendations.router)
app.include_router(reports.router)


# ── Serve React frontend ──────────────────────────────────────────────────────
STATIC_DIR = os.path.join(os.path.dirname(__file__), "..", "frontend", "dist")
if os.path.exists(STATIC_DIR):
    app.mount("/", StaticFiles(directory=STATIC_DIR, html=True), name="static")
else:
    @app.get("/")
    async def root():
        return {
            "message": "EcoPackAI API is running. "
                       "Build the frontend and place it in frontend/dist/ to serve the UI."
        }
