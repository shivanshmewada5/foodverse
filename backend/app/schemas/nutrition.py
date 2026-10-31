from typing import List, Optional, Dict, Any
from pydantic import BaseModel

class MacroNutrient(BaseModel):
    name: str
    amount: float
    unit: str
    daily_value_percentage: float
    color: str

class MicroNutrient(BaseModel):
    name: str
    amount: float
    unit: str
    daily_value_percentage: float

class HealthScoreFactor(BaseModel):
    factor: str
    impact: str # "positive", "negative", "neutral"
    description: str

class NutritionAnalysisResult(BaseModel):
    food_name: str
    portion_size_description: str
    portion_weight_grams: float
    calories_kcal: float
    macros: Dict[str, MacroNutrient] # protein, carbs, fats, fiber, sugar
    micros: List[MicroNutrient]
    health_score: float # 0 to 100
    health_grade: str # A+, A, B, C, D
    health_factors: List[HealthScoreFactor]
    dietary_suitability: Dict[str, bool] # keto, vegan, vegetarian, gluten_free, diabetic_friendly
    recommendations: List[str]
    model_used: str
    image_url: Optional[str] = None
    disclaimer: str = "Nutritional values are algorithmic estimates based on standard culinary databases and visual portion approximations. Actual values may vary depending on exact cooking oils, ingredients, and portion size."
