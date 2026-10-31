"""
FoodVerse Automated Test Suite
Verifies all FastAPI backend endpoints and AI inference modules.
"""
import sys
import os
import unittest
from fastapi.testclient import TestClient

# Add app to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from app.main import app
from app.database import SessionLocal
from app.utils.sample_data import seed_database

class TestFoodVerseAPI(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        db = SessionLocal()
        seed_database(db)
        db.close()
        cls.client = TestClient(app)

    def test_01_health_check(self):
        res = self.client.get("/api/health")
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.json()["status"], "healthy")
        print("[PASS] Health Check Passed")

    def test_02_demo_login(self):
        res = self.client.post("/api/auth/demo-login")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertIn("access_token", data)
        self.assertEqual(data["user"]["email"], "demo@foodverse.ai")
        print("[PASS] Demo Login & JWT Authentication Passed")

    def test_03_food_recognition(self):
        res = self.client.post("/api/food-recognition/analyze", data={"sample_key": "quinoa_bowl"})
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertIn("Mediterranean Quinoa", data["primary_dish"])
        self.assertGreater(data["overall_confidence"], 0.8)
        self.assertGreater(len(data["all_detected_items"]), 0)
        print("[PASS] AI Food Recognition Passed")

    def test_04_nutrition_analysis(self):
        res = self.client.post("/api/nutrition/analyze", json={
            "food_name": "Pan-Seared Atlantic Salmon & Asparagus",
            "portion_grams": 320
        })
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertGreater(data["calories_kcal"], 300)
        self.assertIn("protein", data["macros"])
        self.assertGreaterEqual(data["health_score"], 80)
        print("[PASS] AI Nutrition & Health Scoring Passed")

    def test_05_freshness_detection(self):
        # Test fresh sample
        res_fresh = self.client.post("/api/freshness/analyze", data={"sample_key": "fresh_produce"})
        self.assertEqual(res_fresh.status_code, 200)
        self.assertEqual(res_fresh.json()["freshness_status"], "Fresh")

        # Test spoiled sample
        res_spoil = self.client.post("/api/freshness/analyze", data={"sample_key": "spoiled_strawberry"})
        self.assertEqual(res_spoil.status_code, 200)
        self.assertEqual(res_spoil.json()["freshness_status"], "Potentially Spoiled")
        print("[PASS] AI Food Freshness Classification Passed (Fresh & Spoiled)")

    def test_06_hygiene_video_audit(self):
        res = self.client.post("/api/hygiene/analyze-video", data={"sample_key": "kitchen_hygiene_demo"})
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertGreater(data["total_frames_analyzed"], 10)
        self.assertIn("violations", data)
        self.assertGreater(data["overall_hygiene_score"], 50)
        print("[PASS] Restaurant Kitchen Video Surveillance Passed")

    def test_07_cooking_recipes_and_chat(self):
        # Generate recipes
        res_rec = self.client.post("/api/recipes/generate", json={
            "available_ingredients": ["Salmon", "Asparagus", "Garlic"],
            "servings": 2
        })
        self.assertEqual(res_rec.status_code, 200)
        recipes = res_rec.json()
        self.assertGreater(len(recipes), 0)

        # Chatbot interaction
        res_chat = self.client.post("/api/chat/message", json={
            "message": "What can I substitute for heavy cream?",
            "conversation_history": []
        })
        self.assertEqual(res_chat.status_code, 200)
        self.assertIn("coconut", res_chat.json()["reply"].lower())
        print("[PASS] Smart Cooking Assistant & Culinary Chat Passed")

    def test_08_personalized_meal_planner(self):
        res = self.client.post("/api/meal-plans/generate", json={
            "age": 29,
            "dietary_preference": "Mediterranean",
            "allergies": ["Peanuts"],
            "fitness_goal": "Lean Muscle",
            "daily_calorie_target": 2200,
            "days_count": 7
        })
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(len(data["days"]), 7)
        self.assertNotIn("Peanuts", data["allergens_flagged"])
        print("[PASS] Personalized 7-Day Meal Planner with Allergen Guard Passed")

    def test_09_dashboard_stats(self):
        res = self.client.get("/api/history/dashboard-stats")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertGreater(data["total_analyses"], 0)
        print("[PASS] Dashboard Aggregates & History Passed")

if __name__ == "__main__":
    unittest.main()
