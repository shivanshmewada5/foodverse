from typing import List, Optional, Dict, Any
from pydantic import BaseModel

class MealItem(BaseModel):
    name: str
    dish_type: str # "breakfast", "lunch", "dinner", "snack"
    calories: int
    protein_g: float
    carbs_g: float
    fats_g: float
    ingredients: List[str]
    prep_time_minutes: int
    description: str
    allergens: List[str] = []

class DayMealPlan(BaseModel):
    day: str # "Monday", "Tuesday", etc.
    breakfast: MealItem
    lunch: MealItem
    dinner: MealItem
    snack: MealItem
    daily_calories: int
    daily_protein_g: float
    daily_carbs_g: float
    daily_fats_g: float
    health_focus_note: str

class MealPlanGenerateRequest(BaseModel):
    age: Optional[int] = 28
    dietary_preference: Optional[str] = "Balanced / Mediterranean" # Keto, Vegan, Vegetarian, Paleo, Low Carb, High Protein
    allergies: List[str] = []
    fitness_goal: Optional[str] = "Balanced Nutrition" # Weight Loss, Lean Muscle, Healthy Weight, Heart Health
    daily_calorie_target: Optional[int] = 2100
    days_count: int = 7 # 7 days week

class MealPlanOut(BaseModel):
    id: Optional[int] = None
    title: str
    target_calories_daily: int
    fitness_goal: str
    dietary_preference: str
    days: List[DayMealPlan]
    weekly_averages: Dict[str, float] # avg_calories, avg_protein, etc.
    allergens_flagged: List[str]
    safety_disclaimer: str = "ALLERGEN & HEALTH NOTICE: Meal plans are tailored based on your entered parameters. Always verify ingredient labels and consult your certified physician or dietitian if you have acute metabolic conditions or anaphylactic food allergies."
