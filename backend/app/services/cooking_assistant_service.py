from typing import List, Dict, Any, Optional
from app.schemas.recipe import RecipeOut, RecipeIngredientItem, ChatMessage, ChatResponse
from app.services.multimodal_ai_service import multimodal_ai_hub

class CookingAssistantService:
    """
    AI Chef & Conversational Cooking Intelligence Engine.
    Generates tailored recipes matching available ingredients and provides real-time culinary chat.
    """

    RECIPE_DATABASE = [
        {
            "id": 1,
            "title": "Rustic Garlic Herb Quinoa Skillet",
            "tagline": "A nutrient-packed, 20-minute plant-powered meal with savory aromatics.",
            "cuisine": "Mediterranean",
            "difficulty": "Easy",
            "prep_time_minutes": 10,
            "cook_time_minutes": 15,
            "servings": 2,
            "ingredients": [
                {"name": "Cooked Quinoa", "quantity": "2 cups", "is_user_available": True, "alternatives": ["Brown Rice", "Cauliflower Rice", "Couscous"]},
                {"name": "Cherry Tomatoes", "quantity": "1 cup, halved", "is_user_available": True, "alternatives": ["Diced Bell Peppers", "Sun-dried Tomatoes"]},
                {"name": "Garlic", "quantity": "3 cloves, minced", "is_user_available": True, "alternatives": ["Garlic Powder", "Shallots"]},
                {"name": "Baby Spinach", "quantity": "2 cups", "is_user_available": True, "alternatives": ["Kale", "Arugula", "Swiss Chard"]},
                {"name": "Extra Virgin Olive Oil", "quantity": "2 tbsp", "is_user_available": True, "alternatives": ["Avocado Oil"]},
                {"name": "Feta or Nutritional Yeast", "quantity": "1/4 cup crumbled", "is_user_available": False, "alternatives": ["Parmesan", "Toasted Pine Nuts"]}
            ],
            "instructions": [
                "Warm olive oil in a wide cast-iron skillet over medium heat.",
                "Add minced garlic and halved cherry tomatoes; sauté for 3 minutes until skins blister and garlic is fragrant.",
                "Fold in cooked quinoa and season with sea salt, cracked black pepper, and dried oregano.",
                "Toss in fresh baby spinach and stir gently for 90 seconds until leaves just wilt.",
                "Remove from heat, garnish with crumbled feta or nutritional yeast, and finish with a squeeze of fresh lemon."
            ],
            "nutrition": {"calories": 360, "protein": 12, "carbs": 44, "fats": 16, "fiber": 7},
            "chef_tips": [
                "Toast the cooked quinoa in a dry pan for 2 minutes before sautéing for a nuttier aroma.",
                "Add a pinch of smoked paprika for an earthy depth."
            ],
            "tags": ["Vegetarian", "Gluten-Free", "High-Fiber", "Quick Dinner"]
        },
        {
            "id": 2,
            "title": "Crispy Skin Salmon with Lemon-Herb Asparagus",
            "tagline": "Restaurant-grade seared salmon with vibrant, tender-crisp greens.",
            "cuisine": "Modern American / French",
            "difficulty": "Medium",
            "prep_time_minutes": 10,
            "cook_time_minutes": 12,
            "servings": 2,
            "ingredients": [
                {"name": "Salmon Fillets", "quantity": "2 (6 oz each), skin-on", "is_user_available": True, "alternatives": ["Steelhead Trout", "Halibut", "Firm Tofu Steaks"]},
                {"name": "Fresh Asparagus", "quantity": "1 bunch, woody ends snapped", "is_user_available": True, "alternatives": ["Broccolini", "Green Beans"]},
                {"name": "Unsalted Butter or Ghee", "quantity": "1.5 tbsp", "is_user_available": True, "alternatives": ["Extra Virgin Olive Oil"]},
                {"name": "Lemon", "quantity": "1 whole (zest and juice)", "is_user_available": True, "alternatives": ["White Wine Vinegar"]},
                {"name": "Fresh Dill or Parsley", "quantity": "2 tbsp chopped", "is_user_available": False, "alternatives": ["Dried Italian Seasoning"]}
            ],
            "instructions": [
                "Pat salmon fillets completely dry with paper towels; score skin lightly and season with sea salt.",
                "Heat a stainless steel or cast-iron skillet over medium-high heat until shimmering. Add a drop of oil.",
                "Place salmon skin-side down, press gently with a spatula for 10 seconds, then sear undisturbed for 5-6 minutes until skin is golden and shatter-crisp.",
                "Flip salmon and drop butter, lemon juice, and snapped asparagus into the skillet beside the fish.",
                "Baste salmon with foamy lemon butter for 2 minutes while rolling asparagus until bright green and fork-tender.",
                "Plate immediately, garnished with fresh dill and cracked pink peppercorns."
            ],
            "nutrition": {"calories": 480, "protein": 42, "carbs": 6, "fats": 28, "fiber": 4},
            "chef_tips": [
                "Dry skin is the non-negotiable secret to crispiness. Never place cold, wet fish into the pan.",
                "Let salmon rest for 2 minutes before serving so juices redistribute."
            ],
            "tags": ["Keto", "High-Protein", "Low-Carb", "Omega-3 Rich"]
        },
        {
            "id": 3,
            "title": "Spicy Arrabbiata Pasta with Blistered Cherry Tomatoes",
            "tagline": "Fiery Roman comfort classic crafted from simple pantry staples.",
            "cuisine": "Italian",
            "difficulty": "Easy",
            "prep_time_minutes": 5,
            "cook_time_minutes": 15,
            "servings": 3,
            "ingredients": [
                {"name": "Penne or Rigatoni Pasta", "quantity": "250g", "is_user_available": True, "alternatives": ["Gluten-free Penne", "Spaghetti", "Zucchini Ribbons"]},
                {"name": "Crushed San Marzano Tomatoes", "quantity": "1 can (400g)", "is_user_available": True, "alternatives": ["Tomato Passata", "Diced Fresh Tomatoes"]},
                {"name": "Calabrian Red Chili Flakes", "quantity": "1 tsp (adjust for heat)", "is_user_available": True, "alternatives": ["Fresh Red Chilis", "Cayenne"]},
                {"name": "Garlic", "quantity": "4 cloves, thinly sliced", "is_user_available": True, "alternatives": ["Garlic Paste"]},
                {"name": "Fresh Basil Leaves", "quantity": "Handful", "is_user_available": False, "alternatives": ["Dried Oregano"]}
            ],
            "instructions": [
                "Bring a large pot of heavily salted water to a rolling boil. Cook pasta until 1 minute shy of al dente.",
                "In a separate saucepan, warm olive oil over gentle heat. Add sliced garlic and chili flakes; sizzle for 2 minutes without browning.",
                "Pour in crushed tomatoes, season with salt and a pinch of sugar to balance acidity, and simmer for 10 minutes until sauce thickens.",
                "Transfer pasta directly into the sauce along with 1/4 cup of starchy pasta cooking water. Toss vigorously over heat for 60 seconds.",
                "Stir in torn basil leaves and serve with freshly grated Pecorino Romano."
            ],
            "nutrition": {"calories": 430, "protein": 14, "carbs": 76, "fats": 9, "fiber": 5},
            "chef_tips": [
                "Always finish the pasta in the sauce! The starchy pasta water emulsifies the oil and tomato sauce into a silky glaze."
            ],
            "tags": ["Vegan Friendly", "Quick 20-min", "Comfort Food"]
        }
    ]

    async def generate_recipes(
        self,
        ingredients: List[str],
        cuisine_preference: Optional[str] = None,
        dietary_restriction: Optional[str] = None,
        servings: int = 2
    ) -> List[RecipeOut]:
        results: List[RecipeOut] = []
        ing_lower = [i.lower() for i in ingredients]

        for r in self.RECIPE_DATABASE:
            # Map ingredients
            updated_ingredients: List[RecipeIngredientItem] = []
            matched_count = 0
            for item in r["ingredients"]:
                is_avail = any(user_ing in item["name"].lower() for user_ing in ing_lower) or len(ing_lower) == 0
                if is_avail:
                    matched_count += 1
                updated_ingredients.append(RecipeIngredientItem(
                    name=item["name"],
                    quantity=item["quantity"],
                    is_user_available=is_avail,
                    alternatives=item["alternatives"]
                ))
            
            results.append(RecipeOut(
                id=r["id"],
                title=r["title"],
                tagline=r["tagline"],
                cuisine=r["cuisine"],
                difficulty=r["difficulty"],
                prep_time_minutes=r["prep_time_minutes"],
                cook_time_minutes=r["cook_time_minutes"],
                servings=servings,
                ingredients=updated_ingredients,
                instructions=r["instructions"],
                nutrition=r["nutrition"],
                chef_tips=r["chef_tips"],
                tags=r["tags"]
            ))

        return results

    async def chat_cooking_assistant(
        self,
        message: str,
        history: List[ChatMessage],
        recipe_context: Optional[str] = None,
        user_dietary_profile: Optional[Dict[str, Any]] = None
    ) -> ChatResponse:
        """Handles natural language culinary inquiries with the AI cooking assistant."""
        
        # Check if external Gemini LLM is active
        if multimodal_ai_hub.is_gemini_available():
            system_prompt = (
                "You are FoodVerse AI Chef, a Michelin-caliber culinary consultant and nutrition expert. "
                "Provide enthusiastic, precise, step-by-step culinary guidance. "
                "Suggest smart ingredient substitutions, flavor pairing secrets, and food safety principles."
            )
            llm_reply = await multimodal_ai_hub.call_gemini_chat(message, system_prompt)
            if llm_reply:
                return ChatResponse(
                    reply=llm_reply,
                    suggested_recipes=[],
                    suggested_quick_questions=[
                        "What wine or beverage pairs best with this?",
                        "How can I cut 100 calories from this recipe without sacrificing taste?",
                        "Can this dish be meal-prepped and frozen safely?"
                    ]
                )

        # Local intelligent culinary response engine
        msg_lower = message.lower()
        
        if "substitute" in msg_lower or "alternative" in msg_lower or "replace" in msg_lower:
            reply = (
                "Here are proven culinary substitutions:\n\n"
                "• **Heavy Cream:** Replace with full-fat coconut milk (1:1) or blend silken tofu with unsweetened almond milk for a lean vegan emulsification.\n"
                "• **Egg in baking:** Use 1 tablespoon ground flaxseed whisked with 3 tablespoons water (rest 5 mins to gel).\n"
                "• **Soy Sauce:** Use coconut aminos for lower sodium and gluten-free diets, or tamari for rich umami.\n"
                "• **All-Purpose Flour:** Use 1:1 gluten-free oat flour or almond flour (boosts protein and lowers glycemic index)."
            )
        elif "salmon" in msg_lower or "fish" in msg_lower:
            reply = (
                "For crispy restaurant-grade salmon:\n\n"
                "1. **Dry the surface:** Pat skin bone-dry with paper towels before seasoning.\n"
                "2. **Cold oil, hot pan:** Get your stainless steel or cast iron hot, add high-smoke point oil, then lay salmon skin-down.\n"
                "3. **Patience:** Press flat for 10 seconds with a fish spatula, then do not move it for 5-6 minutes until the skin releases naturally!\n"
                "Target internal temperature is **125°F (52°C)** for tender medium-rare."
            )
        elif "quick" in msg_lower or "time" in msg_lower or "fast" in msg_lower:
            reply = (
                "Need a rapid 15-minute meal? Try our **Rustic Garlic Herb Quinoa Skillet** or a **Quick Asian Egg & Veggie Stir-Fry**. "
                "Pro tip: Keep pre-cooked ancient grains and pre-washed spinach in your fridge—you can have a hot, nutritious dinner ready before takeout can even be assigned to a driver!"
            )
        else:
            reply = (
                f"Welcome to the FoodVerse Kitchen! I analyzed your inquiry: *'{message}'*.\n\n"
                "I can help you build custom recipes from whatever is in your fridge, explain tricky culinary techniques "
                "(such as emulsifying pan sauces, mastering sear temperatures, or fermenting sourdough), and balance macro nutrition. "
                "What ingredients do you have on hand today?"
            )

        quick_qs = [
            "How do I achieve a perfect golden crust without overcooking the center?",
            "What can I cook with quinoa, spinach, and garlic?",
            "What are the best high-protein low-carb ingredient substitutions?"
        ]

        return ChatResponse(
            reply=reply,
            suggested_recipes=[],
            suggested_quick_questions=quick_qs
        )

cooking_assistant_service = CookingAssistantService()
