from fastapi import APIRouter, Depends, Query, HTTPException, Body
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models.recipe import SavedRecipe
from app.models.user import User
from app.schemas.recipe import RecipeOut, RecipeGenerateRequest
from app.services.cooking_assistant_service import cooking_assistant_service
from app.utils.security import get_current_user, require_current_user

router = APIRouter(prefix="/recipes", tags=["Smart AI Cooking Assistant - Recipes"])

@router.post("/generate", response_model=List[RecipeOut])
async def generate_recipes_endpoint(req: RecipeGenerateRequest):
    """
    Generates tailored recipe recommendations matching provided ingredients and dietary parameters.
    """
    return await cooking_assistant_service.generate_recipes(
        ingredients=req.available_ingredients,
        cuisine_preference=req.dish_preferences,
        dietary_restriction=req.dietary_restriction,
        servings=req.servings
    )

@router.get("/saved", response_model=List[RecipeOut])
def get_saved_recipes(
    current_user: User = Depends(require_current_user),
    db: Session = Depends(get_db)
):
    recipes = db.query(SavedRecipe).filter(SavedRecipe.user_id == current_user.id).all()
    out = []
    for r in recipes:
        out.append(RecipeOut(
            id=r.id,
            title=r.title,
            tagline=r.description or "",
            cuisine=r.cuisine,
            difficulty=r.difficulty,
            prep_time_minutes=r.prep_time_minutes,
            cook_time_minutes=r.cook_time_minutes,
            servings=r.servings,
            ingredients=r.ingredients or [],
            instructions=r.instructions or [],
            nutrition=r.nutrition or {},
            chef_tips=[],
            tags=r.tags or []
        ))
    return out

@router.post("/save")
def bookmark_recipe(
    recipe: RecipeOut,
    current_user: User = Depends(require_current_user),
    db: Session = Depends(get_db)
):
    saved = SavedRecipe(
        user_id=current_user.id,
        title=recipe.title,
        description=recipe.tagline,
        cuisine=recipe.cuisine,
        difficulty=recipe.difficulty,
        prep_time_minutes=recipe.prep_time_minutes,
        cook_time_minutes=recipe.cook_time_minutes,
        servings=recipe.servings,
        ingredients=[i.dict() for i in recipe.ingredients],
        instructions=recipe.instructions,
        nutrition=recipe.nutrition,
        tags=recipe.tags
    )
    db.add(saved)
    db.commit()
    db.refresh(saved)
    return {"message": "Recipe successfully bookmarked to your culinary library", "id": saved.id}
