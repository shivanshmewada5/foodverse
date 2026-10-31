import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, JSON
from app.database import Base

class MealPlan(Base):
    __tablename__ = "meal_plans"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=True)
    title = Column(String(255), default="Personalized 7-Day Food Intelligence Plan")
    target_calories = Column(Integer, default=2000)
    fitness_goal = Column(String(100), default="Balanced Health")
    dietary_preference = Column(String(100), default="Omnivore / Balanced")
    
    # 7-day schedule stored as JSON structure:
    # { "Monday": { "breakfast": {...}, "lunch": {...}, "dinner": {...}, "snack": {...}, "daily_nutrition": {...} }, ... }
    schedule_data = Column(JSON, nullable=False)
    
    # Nutritional overview summary
    weekly_summary = Column(JSON, default=dict)
    
    # Allergen warnings and safety disclaimers
    allergens_flagged = Column(JSON, default=list)
    safety_disclaimer = Column(Text, nullable=True)
    
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
