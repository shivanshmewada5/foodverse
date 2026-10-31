from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
from app.database import get_db
from app.models.analysis import FoodAnalysis
from app.models.user import User
from app.utils.security import get_current_user

router = APIRouter(prefix="/history", tags=["User Analysis History & Insights"])

@router.get("/scans")
def get_user_scans(
    analysis_type: Optional[str] = Query(None),
    limit: int = 20,
    current_user: Optional[User] = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(FoodAnalysis)
    if current_user:
        query = query.filter(FoodAnalysis.user_id == current_user.id)
    if analysis_type:
        query = query.filter(FoodAnalysis.analysis_type == analysis_type)
        
    records = query.order_by(FoodAnalysis.created_at.desc()).limit(limit).all()
    
    return [
        {
            "id": r.id,
            "type": r.analysis_type,
            "title": r.title,
            "media_url": r.media_url,
            "confidence": r.confidence_score,
            "health_score": r.health_score,
            "status_label": r.status_label,
            "result_data": r.result_data,
            "created_at": r.created_at.isoformat()
        }
        for r in records
    ]

@router.get("/dashboard-stats")
def get_dashboard_stats(
    current_user: Optional[User] = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(FoodAnalysis)
    if current_user:
        query = query.filter(FoodAnalysis.user_id == current_user.id)
    all_scans = query.all()
    
    total_count = len(all_scans)
    food_count = sum(1 for s in all_scans if s.analysis_type == "recognition")
    nutrition_count = sum(1 for s in all_scans if s.analysis_type == "nutrition")
    freshness_count = sum(1 for s in all_scans if s.analysis_type == "freshness")
    hygiene_count = sum(1 for s in all_scans if s.analysis_type == "hygiene")
    
    scores = [s.health_score for s in all_scans if s.health_score is not None]
    avg_health_score = round(sum(scores) / len(scores), 1) if scores else 88.5

    return {
        "total_analyses": total_count,
        "recognition_scans": food_count,
        "nutrition_scans": nutrition_count,
        "freshness_scans": freshness_count,
        "hygiene_audits": hygiene_count,
        "average_health_score": avg_health_score,
        "active_dietary_goal": current_user.fitness_goal if current_user else "Balanced Nutrition & Health",
        "calorie_target": current_user.daily_calorie_goal if current_user else 2100
    }

@router.delete("/scans/{scan_id}")
def delete_scan(
    scan_id: int,
    current_user: Optional[User] = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    scan = db.query(FoodAnalysis).filter(FoodAnalysis.id == scan_id).first()
    if not scan:
        raise HTTPException(status_code=404, detail="Analysis record not found.")
    db.delete(scan)
    db.commit()
    return {"message": "Analysis record deleted successfully."}
