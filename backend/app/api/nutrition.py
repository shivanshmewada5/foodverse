from fastapi import APIRouter, Depends, Query, HTTPException, Body
from sqlalchemy.orm import Session
from typing import Optional, Dict, Any
from app.database import get_db
from app.models.analysis import FoodAnalysis
from app.models.user import User
from app.schemas.nutrition import NutritionAnalysisResult
from app.services.nutrition_service import nutrition_service
from app.utils.security import get_current_user

router = APIRouter(prefix="/nutrition", tags=["AI Nutrition Analysis"])

@router.post("/analyze", response_model=NutritionAnalysisResult)
def analyze_nutrition_endpoint(
    food_name: str = Body(..., embed=True),
    portion_grams: Optional[float] = Body(None, embed=True),
    image_url: Optional[str] = Body(None, embed=True),
    current_user: Optional[User] = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Computes macronutrients, micronutrients, health score, and actionable dietary recommendations.
    """
    result = nutrition_service.analyze_nutrition(food_name, portion_grams, image_url)

    # Persist in DB history
    analysis_record = FoodAnalysis(
        user_id=current_user.id if current_user else None,
        analysis_type="nutrition",
        title=f"Nutrition: {food_name}",
        media_url=image_url,
        confidence_score=0.95,
        health_score=result.health_score,
        status_label=f"Health Grade {result.health_grade}",
        result_data=result.model_dump()
    )
    db.add(analysis_record)
    db.commit()

    return result
