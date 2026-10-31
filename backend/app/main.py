import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.config import settings
from app.database import engine, Base, SessionLocal
from app.utils.sample_data import seed_database

# Import routers
from app.api.auth import router as auth_router
from app.api.food_recognition import router as food_router
from app.api.nutrition import router as nutrition_router
from app.api.freshness import router as freshness_router
from app.api.hygiene import router as hygiene_router
from app.api.recipes import router as recipe_router
from app.api.meal_plans import router as meal_plan_router
from app.api.chat import router as chat_router
from app.api.history import router as history_router

# Create DB tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="FoodVerse API",
    description="Multimodal AI Food Intelligence Platform – Computer Vision, Nutrition Scoring, Freshness & Hygiene Auditing",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static file mounts for uploads and sample media
app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")
app.mount("/sample_media", StaticFiles(directory=settings.SAMPLE_MEDIA_DIR), name="sample_media")

# Include Routers under /api
app.include_router(auth_router, prefix=settings.API_V1_STR)
app.include_router(food_router, prefix=settings.API_V1_STR)
app.include_router(nutrition_router, prefix=settings.API_V1_STR)
app.include_router(freshness_router, prefix=settings.API_V1_STR)
app.include_router(hygiene_router, prefix=settings.API_V1_STR)
app.include_router(recipe_router, prefix=settings.API_V1_STR)
app.include_router(meal_plan_router, prefix=settings.API_V1_STR)
app.include_router(chat_router, prefix=settings.API_V1_STR)
app.include_router(history_router, prefix=settings.API_V1_STR)

@app.on_event("startup")
def on_startup():
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": "FoodVerse Multimodal AI Platform",
        "version": "1.0.0",
        "ai_engine": "Computer Vision & Multimodal Hub Active"
    }

@app.get("/")
def root():
    return {
        "message": "Welcome to FoodVerse – Multimodal AI Food Intelligence Platform API",
        "documentation": "/docs"
    }
