import os
from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    PROJECT_NAME: str = "FoodVerse – Multimodal AI Food Intelligence Platform"
    API_V1_STR: str = "/api"
    SECRET_KEY: str = "foodverse_super_secret_jwt_key_2026_modern_ai_platform"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    # Database
    DATABASE_URL: str = "sqlite:///./foodverse.db"
    
    # Storage & Uploads
    BASE_DIR: str = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    UPLOAD_DIR: str = os.path.join(BASE_DIR, "uploads")
    SAMPLE_MEDIA_DIR: str = os.path.join(BASE_DIR, "sample_media")
    
    # External AI Model Integrations (Optional, gracefully falls back to local CV/NLP engines)
    GEMINI_API_KEY: str = ""
    OPENAI_API_KEY: str = ""
    HUGGINGFACE_API_KEY: str = ""
    
    # CORS
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "*"
    ]
    
    class Config:
        env_file = ".env"
        extra = "allow"

settings = Settings()

# Ensure directories exist
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
os.makedirs(settings.SAMPLE_MEDIA_DIR, exist_ok=True)
