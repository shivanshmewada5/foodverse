from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Optional
from app.database import get_db
from app.models.meal_plan import MealPlan
from app.models.user import User
from app.schemas.meal_plan import MealPlanOut, MealPlanGenerateRequest
from app.services.meal_planner_service import meal_planner_service
from app.utils.security import get_current_user

router = APIRouter(prefix="/meal-plans", tags=["Personalized AI Meal Planner"])

@router.post("/generate", response_model=MealPlanOut)
def generate_meal_plan_endpoint(
    req: MealPlanGenerateRequest,
    current_user: Optional[User] = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Generates a tailored 7-day nutritional calendar with breakfast, lunch, dinner,
    and healthy snacks adjusted to user goals and allergen parameters.
    """
    # If user is logged in and didn't provide overrides, default to profile
    if current_user:
        if not req.allergies and current_user.allergies:
            req.allergies = current_user.allergies
        if not req.dietary_preference and current_user.dietary_preferences:
            req.dietary_preference = ", ".join(current_user.dietary_preferences)
        if not req.fitness_goal and current_user.fitness_goal:
            req.fitness_goal = current_user.fitness_goal
        if req.daily_calorie_target == 2100 and current_user.daily_calorie_goal:
            req.daily_calorie_target = current_user.daily_calorie_goal

    plan_out = meal_planner_service.generate_plan(req)

    # Persist in DB
    db_plan = MealPlan(
        user_id=current_user.id if current_user else None,
        title=plan_out.title,
        target_calories=plan_out.target_calories_daily,
        fitness_goal=plan_out.fitness_goal,
        dietary_preference=plan_out.dietary_preference,
        schedule_data=[d.model_dump() for d in plan_out.days],
        weekly_summary=plan_out.weekly_averages,
        allergens_flagged=plan_out.allergens_flagged,
        safety_disclaimer=plan_out.safety_disclaimer
    )
    db.add(db_plan)
    db.commit()
    db.refresh(db_plan)

    plan_out.id = db_plan.id
    return plan_out

@router.get("/latest", response_model=Optional[MealPlanOut])
def get_latest_plan(
    current_user: Optional[User] = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(MealPlan)
    if current_user:
        query = query.filter(MealPlan.user_id == current_user.id)
    plan = query.order_by(MealPlan.created_at.desc()).first()
    if not plan:
        # Generate default starter plan
        return meal_planner_service.generate_plan(MealPlanGenerateRequest())
    
    return MealPlanOut(
        id=plan.id,
        title=plan.title,
        target_calories_daily=plan.target_calories,
        fitness_goal=plan.fitness_goal,
        dietary_preference=plan.dietary_preference,
        days=plan.schedule_data,
        weekly_averages=plan.weekly_summary or {},
        allergens_flagged=plan.allergens_flagged or [],
        safety_disclaimer=plan.safety_disclaimer or ""
    )
