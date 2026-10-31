from typing import List, Optional, Dict, Any
from pydantic import BaseModel

class RecipeIngredientItem(BaseModel):
    name: str
    quantity: str
    is_user_available: bool = True
    alternatives: List[str] = []

class RecipeOut(BaseModel):
    id: Optional[int] = None
    title: str
    tagline: str
    cuisine: str
    difficulty: str # "Easy", "Medium", "Chef-level"
    prep_time_minutes: int
    cook_time_minutes: int
    servings: int
    ingredients: List[RecipeIngredientItem]
    instructions: List[str]
    nutrition: Dict[str, Any] # calories, protein, carbs, fats
    chef_tips: List[str]
    tags: List[str]
    image_url: Optional[str] = None

class RecipeGenerateRequest(BaseModel):
    available_ingredients: List[str] = []
    dish_preferences: Optional[str] = None # e.g. "Low carb", "Italian", "Quick under 20 mins"
    dietary_restriction: Optional[str] = None # e.g. "Vegan", "Gluten-Free", "Nut-Free"
    max_prep_time_minutes: Optional[int] = None
    servings: int = 2

class ChatMessage(BaseModel):
    role: str # "user", "assistant", "system"
    content: str

class ChatRequest(BaseModel):
    message: str
    conversation_history: List[ChatMessage] = []
    current_recipe_context: Optional[str] = None
    user_dietary_profile: Optional[Dict[str, Any]] = None

class ChatResponse(BaseModel):
    reply: str
    suggested_recipes: List[RecipeOut] = []
    suggested_quick_questions: List[str] = []
