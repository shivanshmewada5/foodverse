import os
from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from sqlalchemy.orm import Session
from typing import Optional
from app.database import get_db
from app.config import settings
from app.models.analysis import FoodAnalysis
from app.models.user import User
from app.schemas.food import FoodRecognitionResult
from app.services.food_vision_service import food_vision_service
from app.utils.media_storage import save_uploaded_media
from app.utils.security import get_current_user

router = APIRouter(prefix="/food-recognition", tags=["AI Food Recognition"])

@router.post("/analyze", response_model=FoodRecognitionResult)
async def analyze_food_image(
    file: Optional[UploadFile] = File(None),
    sample_key: Optional[str] = Form(None),
    dish_hint: Optional[str] = Form(None),
    current_user: Optional[User] = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Analyzes an uploaded food image or a pre-loaded sample.
    Identifies food dishes, ingredients, portion estimates, and confidence scores.
    """
    if file:
        rel_url = await save_uploaded_media(file, is_video=False)
        abs_path = os.path.join(settings.BASE_DIR, rel_url.lstrip("/"))
    elif sample_key:
        # Use bundled sample
        sample_filename = f"{sample_key}.jpg"
        abs_path = os.path.join(settings.SAMPLE_MEDIA_DIR, sample_filename)
        rel_url = f"/sample_media/{sample_filename}"
        if not os.path.exists(abs_path):
            # Create a mock placeholder image if needed
            abs_path = os.path.join(settings.UPLOAD_DIR, "sample_placeholder.jpg")
            rel_url = "/uploads/sample_placeholder.jpg"
    else:
        raise HTTPException(status_code=400, detail="Please upload a food image or choose a demo sample.")

    result = await food_vision_service.identify_food(abs_path, rel_url, custom_name_hint=dish_hint or sample_key)

    # Persist in DB history
    analysis_record = FoodAnalysis(
        user_id=current_user.id if current_user else None,
        analysis_type="recognition",
        title=result.primary_dish,
        media_url=rel_url,
        confidence_score=result.overall_confidence,
        status_label=f"{result.total_items_count} items detected",
        result_data=result.model_dump()
    )
    db.add(analysis_record)
    db.commit()
    db.refresh(analysis_record)

    result.analysis_id = analysis_record.id
    return result
