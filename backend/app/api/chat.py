from fastapi import APIRouter, Depends
from app.schemas.recipe import ChatRequest, ChatResponse
from app.services.cooking_assistant_service import cooking_assistant_service
from app.models.user import User
from app.utils.security import get_current_user
from typing import Optional

router = APIRouter(prefix="/chat", tags=["AI Food Assistant Chatbot"])

@router.post("/message", response_model=ChatResponse)
async def chat_with_food_assistant(
    req: ChatRequest,
    current_user: Optional[User] = Depends(get_current_user)
):
    """
    Interactive multimodal cooking assistant responding to culinary questions,
    ingredient substitution queries, and food safety advice.
    """
    user_profile = None
    if current_user:
        user_profile = {
            "dietary_preferences": current_user.dietary_preferences,
            "allergies": current_user.allergies,
            "fitness_goal": current_user.fitness_goal
        }

    return await cooking_assistant_service.chat_cooking_assistant(
        message=req.message,
        history=req.conversation_history,
        recipe_context=req.current_recipe_context,
        user_dietary_profile=user_profile or req.user_dietary_profile
    )
