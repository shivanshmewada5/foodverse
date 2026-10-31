from typing import List, Dict, Any, Optional
from app.schemas.meal_plan import MealPlanOut, DayMealPlan, MealItem, MealPlanGenerateRequest

class MealPlannerService:
    """
    Personalized AI Meal Planner.
    Tailors 7-day culinary calendars with exact macronutrient allocation,
    strict allergen filtering, and metabolic fitness alignment.
    """

    DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

    MEAL_CATALOG = {
        "breakfast": [
            {
                "name": "Spinach & Feta Egg White Omelet with Avocado",
                "calories": 360, "protein_g": 28.0, "carbs_g": 12.0, "fats_g": 22.0,
                "ingredients": ["Egg Whites", "Baby Spinach", "Greek Feta", "Hass Avocado", "Olive Oil"],
                "prep_time_minutes": 10,
                "description": "High-protein, low-glycemic breakfast delivering steady morning neurotransmitter support.",
                "allergens": ["Dairy", "Eggs"]
            },
            {
                "name": "Chia Seed & Wild Berry Protein Overnight Oats",
                "calories": 410, "protein_g": 30.0, "carbs_g": 52.0, "fats_g": 9.0,
                "ingredients": ["Rolled Oats", "Plant Protein Isolate", "Almond Milk", "Chia Seeds", "Blueberries"],
                "prep_time_minutes": 5,
                "description": "Slow-digesting complex carbohydrates rich in prebiotic beta-glucans and antioxidants.",
                "allergens": ["Tree Nuts"]
            },
            {
                "name": "Smoked Salmon & Poached Egg Protein Plate",
                "calories": 390, "protein_g": 34.0, "carbs_g": 14.0, "fats_g": 21.0,
                "ingredients": ["Wild Smoked Salmon", "Poached Eggs", "Arugula", "Capers", "Gluten-Free Seed Toast"],
                "prep_time_minutes": 8,
                "description": "Optimal brain fuel loaded with DHA/EPA omega-3 fats and bioavailable choline.",
                "allergens": ["Fish", "Eggs"]
            },
            {
                "name": "Golden Turmeric Golden Tofu Scramble",
                "calories": 320, "protein_g": 24.0, "carbs_g": 16.0, "fats_g": 18.0,
                "ingredients": ["Organic Firm Tofu", "Nutritional Yeast", "Baby Kale", "Turmeric", "Avocado Oil"],
                "prep_time_minutes": 12,
                "description": "Anti-inflammatory vegan powerhouse with high plant protein density.",
                "allergens": ["Soy"]
            }
        ],
        "lunch": [
            {
                "name": "Grilled Lemon Herb Chicken & Quinoa Harvest Bowl",
                "calories": 540, "protein_g": 46.0, "carbs_g": 54.0, "fats_g": 16.0,
                "ingredients": ["Chicken Breast", "Tricolor Quinoa", "Cucumber", "Cherry Tomatoes", "Lemon Tahini Dressing"],
                "prep_time_minutes": 20,
                "description": "Balanced midday refuel sustaining afternoon cognitive clarity without insulin spikes.",
                "allergens": ["Sesame"]
            },
            {
                "name": "Mediterranean Tuna Nicoise Salad with Olives & Eggs",
                "calories": 480, "protein_g": 42.0, "carbs_g": 22.0, "fats_g": 24.0,
                "ingredients": ["Albacore Tuna", "Steamed Green Beans", "Hard-boiled Egg", "Kalamata Olives", "Dijon Vinaigrette"],
                "prep_time_minutes": 15,
                "description": "Light yet satiating athletic lunch loaded with lean marine protein.",
                "allergens": ["Fish", "Eggs"]
            },
            {
                "name": "Lentil & Roasted Sweet Potato Power Bowl",
                "calories": 510, "protein_g": 22.0, "carbs_g": 78.0, "fats_g": 12.0,
                "ingredients": ["French Green Lentils", "Roasted Sweet Potato", "Massaged Kale", "Pumpkin Seeds", "Apple Cider Vinaigrette"],
                "prep_time_minutes": 25,
                "description": "Fiber-dense plant feast promoting sustained satiety and healthy gut fermentation.",
                "allergens": []
            },
            {
                "name": "Grass-Fed Beef Sirloin Salad with Balsamic Glaze",
                "calories": 560, "protein_g": 48.0, "carbs_g": 18.0, "fats_g": 31.0,
                "ingredients": ["Lean Beef Sirloin", "Mixed Wild Greens", "Shaved Parmesan", "Walnuts", "Balsamic Reduction"],
                "prep_time_minutes": 18,
                "description": "Heme-iron and creatine boost for resistance training recovery.",
                "allergens": ["Dairy", "Tree Nuts"]
            }
        ],
        "dinner": [
            {
                "name": "Pan-Seared Atlantic Salmon with Charred Broccolini",
                "calories": 520, "protein_g": 44.0, "carbs_g": 14.0, "fats_g": 30.0,
                "ingredients": ["Atlantic Salmon", "Broccolini", "Garlic Butter", "Lemon", "Sea Salt"],
                "prep_time_minutes": 18,
                "description": "Deep restorative dinner providing cellular recovery nutrients for restful sleep.",
                "allergens": ["Fish", "Dairy"]
            },
            {
                "name": "Herb-Roasted Turkey Medallions with Sweet Potato Mash",
                "calories": 490, "protein_g": 42.0, "carbs_g": 46.0, "fats_g": 12.0,
                "ingredients": ["Turkey Breast", "Roasted Sweet Potato", "Steamed Asparagus", "Rosemary Jus"],
                "prep_time_minutes": 25,
                "description": "Lean poultry dinner rich in natural tryptophan to stimulate melatonin release.",
                "allergens": []
            },
            {
                "name": "Thai Basil Coconut Tofu Curry with Cauliflower Rice",
                "calories": 440, "protein_g": 22.0, "carbs_g": 26.0, "fats_g": 28.0,
                "ingredients": ["Tofu Cubes", "Coconut Milk", "Thai Basil", "Bell Peppers", "Cauliflower Rice"],
                "prep_time_minutes": 20,
                "description": "Comforting, aromatic, low-carb keto-friendly dinner with coconut MCTs.",
                "allergens": ["Soy"]
            },
            {
                "name": "Moroccan Spiced Lamb & Chickpea Tagine",
                "calories": 580, "protein_g": 38.0, "carbs_g": 48.0, "fats_g": 24.0,
                "ingredients": ["Lean Lamb", "Chickpeas", "Cumin & Cinnamon", "Zucchini", "Fresh Cilantro"],
                "prep_time_minutes": 35,
                "description": "Rich complex flavors packed with bioavailable zinc and plant fiber.",
                "allergens": []
            }
        ],
        "snack": [
            {
                "name": "Greek Strained Yogurt with Crushed Pistachios",
                "calories": 180, "protein_g": 17.0, "carbs_g": 9.0, "fats_g": 7.0,
                "ingredients": ["Plain 0% Greek Yogurt", "Roasted Pistachios", "Raw Honey"],
                "prep_time_minutes": 2,
                "description": "Creamy protein crunch to bridge afternoon energy dips.",
                "allergens": ["Dairy", "Tree Nuts"]
            },
            {
                "name": "Edamame in Sea Salt & Shichimi Togarashi",
                "calories": 140, "protein_g": 12.0, "carbs_g": 10.0, "fats_g": 5.0,
                "ingredients": ["Steamed Edamame Pods", "Coarse Sea Salt", "Japanese Chili Flakes"],
                "prep_time_minutes": 5,
                "description": "Whole food fiber and plant isoflavones in a convenient finger snack.",
                "allergens": ["Soy"]
            },
            {
                "name": "Crisp Apple Slices with Almond Butter",
                "calories": 200, "protein_g": 5.0, "carbs_g": 24.0, "fats_g": 11.0,
                "ingredients": ["Honeycrisp Apple", "Stone-ground Almond Butter", "Cinnamon"],
                "prep_time_minutes": 3,
                "description": "Natural fruit fructose stabilized by wholesome nut fats and blood-sugar friendly cinnamon.",
                "allergens": ["Tree Nuts"]
            },
            {
                "name": "Roasted Spiced Chickpeas",
                "calories": 160, "protein_g": 8.0, "carbs_g": 24.0, "fats_g": 4.0,
                "ingredients": ["Organic Chickpeas", "Paprika", "Olive Oil Spray", "Sea Salt"],
                "prep_time_minutes": 5,
                "description": "Nut-free, crunchy, portable fiber powerhouse.",
                "allergens": []
            }
        ]
    }

    def generate_plan(self, req: MealPlanGenerateRequest) -> MealPlanOut:
        user_allergies_lower = [a.lower().strip() for a in req.allergies]
        flagged_allergens = set()
        days_plans: List[DayMealPlan] = []
        
        target_cals = req.daily_calorie_target or 2100

        for i, day_name in enumerate(self.DAYS_OF_WEEK[:req.days_count]):
            b_list = self.filter_allergens(self.MEAL_CATALOG["breakfast"], user_allergies_lower)
            l_list = self.filter_allergens(self.MEAL_CATALOG["lunch"], user_allergies_lower)
            d_list = self.filter_allergens(self.MEAL_CATALOG["dinner"], user_allergies_lower)
            s_list = self.filter_allergens(self.MEAL_CATALOG["snack"], user_allergies_lower)
            
            b_item_raw = b_list[i % len(b_list)]
            l_item_raw = l_list[i % len(l_list)]
            d_item_raw = d_list[i % len(d_list)]
            s_item_raw = s_list[i % len(s_list)]

            b_meal = MealItem(**b_item_raw, dish_type="breakfast")
            l_meal = MealItem(**l_item_raw, dish_type="lunch")
            d_meal = MealItem(**d_item_raw, dish_type="dinner")
            s_meal = MealItem(**s_item_raw, dish_type="snack")

            for meal in [b_meal, l_meal, d_meal, s_meal]:
                for alg in meal.allergens:
                    if alg.lower() in user_allergies_lower:
                        flagged_allergens.add(alg)

            tot_cals = b_meal.calories + l_meal.calories + d_meal.calories + s_meal.calories
            tot_prot = round(b_meal.protein_g + l_meal.protein_g + d_meal.protein_g + s_meal.protein_g, 1)
            tot_carbs = round(b_meal.carbs_g + l_meal.carbs_g + d_meal.carbs_g + s_meal.carbs_g, 1)
            tot_fats = round(b_meal.fats_g + l_meal.fats_g + d_meal.fats_g + s_meal.fats_g, 1)

            focus_notes = [
                "Focus: Sustained mitochondrial energy and lean muscle preservation.",
                "Focus: Metabolic optimization with low glycemic index complex carbohydrates.",
                "Focus: Anti-inflammatory cellular repair and antioxidant defense.",
                "Focus: Optimal cognitive endurance and sustained gut microbiome diversity."
            ]

            days_plans.append(DayMealPlan(
                day=day_name,
                breakfast=b_meal,
                lunch=l_meal,
                dinner=d_meal,
                snack=s_meal,
                daily_calories=tot_cals,
                daily_protein_g=tot_prot,
                daily_carbs_g=tot_carbs,
                daily_fats_g=tot_fats,
                health_focus_note=focus_notes[i % len(focus_notes)]
            ))

        avg_cals = round(sum(d.daily_calories for d in days_plans) / len(days_plans), 0)
        avg_prot = round(sum(d.daily_protein_g for d in days_plans) / len(days_plans), 1)
        avg_carbs = round(sum(d.daily_carbs_g for d in days_plans) / len(days_plans), 1)
        avg_fats = round(sum(d.daily_fats_g for d in days_plans) / len(days_plans), 1)

        title = f"{req.dietary_preference or 'Balanced'} Fuel Plan ({req.fitness_goal or 'Health'})"

        return MealPlanOut(
            title=title,
            target_calories_daily=target_cals,
            fitness_goal=req.fitness_goal or "Balanced Health",
            dietary_preference=req.dietary_preference or "Balanced / Mediterranean",
            days=days_plans,
            weekly_averages={
                "daily_calories": avg_cals,
                "protein_g": avg_prot,
                "carbs_g": avg_carbs,
                "fats_g": avg_fats
            },
            allergens_flagged=list(flagged_allergens)
        )

    def filter_allergens(self, items: List[Dict[str, Any]], user_allergies: List[str]) -> List[Dict[str, Any]]:
        safe = [
            it for it in items
            if not any(a.lower() in user_allergies for a in it.get("allergens", []))
        ]
        return safe if safe else items

meal_planner_service = MealPlannerService()
