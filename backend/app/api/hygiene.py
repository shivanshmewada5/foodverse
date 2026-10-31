import os
from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from sqlalchemy.orm import Session
from typing import Optional
from app.database import get_db
from app.config import settings
from app.models.analysis import FoodAnalysis
from app.models.user import User
from app.schemas.hygiene import HygieneReportResult
from app.services.hygiene_service import hygiene_service
from app.utils.media_storage import save_uploaded_media
from app.utils.security import get_current_user

router = APIRouter(prefix="/hygiene", tags=["Restaurant Kitchen Hygiene Monitoring"])

@router.post("/analyze-video", response_model=HygieneReportResult)
async def analyze_hygiene_video_endpoint(
    video: Optional[UploadFile] = File(None),
    sample_key: Optional[str] = Form(None),
    current_user: Optional[User] = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Analyzes kitchen surveillance video frames for glove compliance, hairnet usage,
    cross-contamination risks, uncovered food, and produces a timestamped hygiene audit.
    """
    if video:
        rel_url = await save_uploaded_media(video, is_video=True)
        abs_path = os.path.join(settings.BASE_DIR, rel_url.lstrip("/"))
    elif sample_key:
        sample_filename = f"{sample_key}.mp4"
        abs_path = os.path.join(settings.SAMPLE_MEDIA_DIR, sample_filename)
        rel_url = f"/sample_media/{sample_filename}"
        if not os.path.exists(abs_path):
            abs_path = os.path.join(settings.UPLOAD_DIR, "sample_kitchen.mp4")
            rel_url = "/uploads/sample_kitchen.mp4"
    else:
        raise HTTPException(status_code=400, detail="Please upload a video or select a sample kitchen recording.")

    result = hygiene_service.analyze_video(abs_path, video_url=rel_url)

    # Persist in DB history
    analysis_record = FoodAnalysis(
        user_id=current_user.id if current_user else None,
        analysis_type="hygiene",
        title=f"Hygiene Audit: {result.video_filename}",
        media_url=rel_url,
        confidence_score=0.91,
        health_score=result.overall_hygiene_score,
        status_label=f"Grade {result.hygiene_grade} ({len(result.violations)} Violations)",
        result_data=result.model_dump()
    )
    db.add(analysis_record)
    db.commit()

    return result
