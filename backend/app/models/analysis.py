import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, Float, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.database import Base

class FoodAnalysis(Base):
    __tablename__ = "food_analyses"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=True)
    
    # Type: "recognition", "nutrition", "freshness", "hygiene"
    analysis_type = Column(String(50), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    
    # Media paths
    media_url = Column(String(500), nullable=True) # local static path or external URL
    media_filename = Column(String(255), nullable=True)
    
    # High-level metrics
    confidence_score = Column(Float, default=0.0)
    health_score = Column(Float, nullable=True) # 0-100
    status_label = Column(String(100), nullable=True) # "Fresh", "Violations Detected", etc.
    
    # Detailed structured output from AI models
    result_data = Column(JSON, nullable=False)
    
    # Human verification notes / feedback
    verified_by_user = Column(Integer, default=0) # 0 = unverified, 1 = verified
    user_notes = Column(Text, nullable=True)
    
    created_at = Column(DateTime, default=datetime.datetime.utcnow, index=True)
