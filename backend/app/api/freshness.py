import os
from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from sqlalchemy.orm import Session
from typing import Optional
from app.database import get_db
from app.config import settings
from app.models.analysis import FoodAnalysis
from app.models.user import User
from app.schemas.freshness import FreshnessAnalysisResult
from app.services.freshness_service import freshness_service
from app.utils.media_storage import save_uploaded_media
from app.utils.security import get_current_user

router = APIRouter(prefix="/freshness", tags=["Food Freshness Detection"])

@router.post("/analyze", response_model=FreshnessAnalysisResult)
async def analyze_freshness_endpoint(
    file: Optional[UploadFile] = File(None),
    sample_key: Optional[str] = Form(None),
    food_name: Optional[str] = Form(None),
    current_user: Optional[User] = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Evaluates food image for spoilage markers: discoloration, texture roughness, and mold patterns.
    Classifies as Fresh, Moderately Fresh, or Potentially Spoiled with safety recommendations.
    """
    if file:
        rel_url = await save_uploaded_media(file, is_video=False)
        abs_path = os.path.join(settings.BASE_DIR, rel_url.lstrip("/"))
    elif sample_key:
        sample_filename = f"{sample_key}.jpg"
        abs_path = os.path.join(settings.SAMPLE_MEDIA_DIR, sample_filename)
        rel_url = f"/sample_media/{sample_filename}"
        if not os.path.exists(abs_path):
            abs_path = os.path.join(settings.UPLOAD_DIR, "sample_placeholder.jpg")
            rel_url = "/uploads/sample_placeholder.jpg"
    else:
        raise HTTPException(status_code=400, detail="Please upload an image or choose a demo sample.")

    result = freshness_service.analyze_freshness(abs_path, food_name_hint=food_name or sample_key, image_url=rel_url)

    # Persist in DB
    analysis_record = FoodAnalysis(
        user_id=current_user.id if current_user else None,
        analysis_type="freshness",
        title=f"Freshness: {result.item_detected}",
        media_url=rel_url,
        confidence_score=result.overall_confidence,
        health_score=result.freshness_score,
        status_label=result.freshness_status,
        result_data=result.model_dump()
    )
    db.add(analysis_record)
    db.commit()

    return result
