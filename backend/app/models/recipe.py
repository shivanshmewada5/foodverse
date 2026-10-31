import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, JSON
from app.database import Base

class SavedRecipe(Base):
    __tablename__ = "saved_recipes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    cuisine = Column(String(100), default="Global")
    difficulty = Column(String(50), default="Medium")
    prep_time_minutes = Column(Integer, default=15)
    cook_time_minutes = Column(Integer, default=25)
    servings = Column(Integer, default=2)
    
    ingredients = Column(JSON, default=list) # [{item: str, amount: str, alternatives: []}]
    instructions = Column(JSON, default=list) # [step 1, step 2]
    nutrition = Column(JSON, default=dict) # {calories: 450, protein: 30, carbs: 45, fats: 14}
    tags = Column(JSON, default=list)
    image_url = Column(String(500), nullable=True)
    
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
