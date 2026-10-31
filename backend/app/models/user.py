import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, JSON
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), default="Food Explorer")
    role = Column(String(50), default="user") # user, admin, chef, auditor
    is_active = Column(Boolean, default=True)
    
    # Profile & Health Goals
    age = Column(Integer, default=28)
    gender = Column(String(50), default="Not specified")
    height_cm = Column(Integer, default=175)
    weight_kg = Column(Integer, default=70)
    fitness_goal = Column(String(100), default="Balanced Nutrition & Health") # Weight Loss, Muscle Gain, Balanced Nutrition, Heart Health, Low GI
    daily_calorie_goal = Column(Integer, default=2100)
    
    # Dietary Preferences (list stored as JSON)
    # e.g., ["Mediterranean", "High Protein", "Low Sodium"]
    dietary_preferences = Column(JSON, default=list)
    
    # Allergies (list stored as JSON)
    # e.g., ["Peanuts", "Shellfish", "Lactose"]
    allergies = Column(JSON, default=list)
    
    # Preferences / Dislikes
    favorite_cuisines = Column(JSON, default=list)
    disliked_ingredients = Column(JSON, default=list)
    
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
