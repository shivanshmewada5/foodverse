import os
import cv2
import numpy as np
from sqlalchemy.orm import Session
from app.config import settings
from app.models.user import User
from app.models.analysis import FoodAnalysis
from app.models.recipe import SavedRecipe
from app.models.meal_plan import MealPlan
from app.utils.security import get_password_hash
from app.services.cooking_assistant_service import cooking_assistant_service
from app.services.meal_planner_service import meal_planner_service

def generate_sample_images():
    """Generates synthetic high-resolution sample images for tests and demo testing."""
    os.makedirs(settings.SAMPLE_MEDIA_DIR, exist_ok=True)
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)

    samples = [
        ("quinoa_bowl.jpg", (40, 180, 50), "Mediterranean Quinoa Bowl"),
        ("salmon_plate.jpg", (30, 120, 220), "Pan-Seared Salmon"),
        ("avocado_toast.jpg", (60, 190, 120), "Avocado Toast"),
        ("penne_pasta.jpg", (15, 60, 210), "Penne all'Arrabbiata"),
        ("fresh_produce.jpg", (30, 200, 70), "Fresh Garden Produce"),
        ("moderate_apple.jpg", (25, 170, 180), "Moderately Ripe Apple"),
        ("spoiled_strawberry.jpg", (40, 40, 100), "Spoiled Strawberry (Mold)"),
    ]

    for fname, base_bgr, label in samples:
        target_path = os.path.join(settings.SAMPLE_MEDIA_DIR, fname)
        if not os.path.exists(target_path):
            img = np.zeros((480, 640, 3), dtype=np.uint8)
            # Create rich color gradient
            for y in range(480):
                ratio = y / 480.0
                img[y, :] = [
                    int(base_bgr[0] * (0.8 + 0.3 * ratio)),
                    int(base_bgr[1] * (0.8 + 0.3 * ratio)),
                    int(base_bgr[2] * (0.8 + 0.3 * ratio))
                ]
            
            # Add circular dish plate
            cv2.circle(img, (320, 240), 190, (230, 235, 230), -1)
            cv2.circle(img, (320, 240), 170, base_bgr, -1)

            # If spoiled sample, draw mold spore patches
            if "spoiled" in fname:
                for pt in [(260, 200), (280, 220), (350, 260), (330, 190)]:
                    cv2.circle(img, pt, 25, (160, 190, 150), -1)
                    cv2.circle(img, pt, 15, (220, 240, 220), -1)

            # Label overlay
            cv2.rectangle(img, (40, 410), (600, 460), (15, 25, 20), -1)
            cv2.putText(img, f"FoodVerse AI: {label}", (60, 442), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (240, 255, 240), 2)
            cv2.imwrite(target_path, img)

            # Also copy to uploads
            up_path = os.path.join(settings.UPLOAD_DIR, fname)
            if not os.path.exists(up_path):
                cv2.imwrite(up_path, img)

    # Generate a lightweight demo MP4 video if not present
    video_path = os.path.join(settings.SAMPLE_MEDIA_DIR, "kitchen_hygiene_demo.mp4")
    if not os.path.exists(video_path):
        fourcc = cv2.VideoWriter_fourcc(*'mp4v')
        vw = cv2.VideoWriter(video_path, fourcc, 10.0, (480, 360))
        for f in range(50):
            frame = np.zeros((360, 480, 3), dtype=np.uint8)
            frame[:] = (30, 45, 35) # Kitchen ambient color
            # Table
            cv2.rectangle(frame, (40, 180), (440, 330), (80, 100, 90), -1)
            # Worker simulation
            cv2.circle(frame, (240, 120), 45, (180, 190, 185), -1)
            # Text info
            cv2.putText(frame, f"Kitchen Station Cam #2 - Frame {f+1}/50", (30, 50), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (200, 255, 210), 1)
            cv2.putText(frame, "PPE Monitoring & HACCP Compliance Audit", (30, 345), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (150, 220, 170), 1)
            vw.write(frame)
        vw.release()

        # Copy to uploads
        up_vid = os.path.join(settings.UPLOAD_DIR, "kitchen_hygiene_demo.mp4")
        if not os.path.exists(up_vid):
            import shutil
            shutil.copy(video_path, up_vid)

def seed_database(db: Session):
    """Pre-populates the database with demo accounts and initial analyses."""
    generate_sample_images()

    demo_email = "demo@foodverse.ai"
    existing_user = db.query(User).filter(User.email == demo_email).first()
    if not existing_user:
        user = User(
            email=demo_email,
            hashed_password=get_password_hash("FoodVerseDemo2026!"),
            full_name="Chef Alex Morgan",
            role="auditor",
            age=31,
            fitness_goal="Lean Muscle & Longevity",
            daily_calorie_goal=2250,
            dietary_preferences=["High Protein", "Mediterranean", "Low Refined Sugar"],
            allergies=["Peanuts"],
            favorite_cuisines=["Mediterranean", "Japanese", "Mexican"]
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    else:
        user = existing_user

    # Seed initial analyses if empty
    if db.query(FoodAnalysis).count() == 0:
        db.add(FoodAnalysis(
            user_id=user.id,
            analysis_type="recognition",
            title="Mediterranean Quinoa Salad Bowl",
            media_url="/sample_media/quinoa_bowl.jpg",
            confidence_score=0.96,
            health_score=92.0,
            status_label="6 Ingredients Detected",
            result_data={
                "title": "Mediterranean Quinoa Salad Bowl",
                "primary_dish": "Mediterranean Quinoa Salad Bowl",
                "overall_confidence": 0.96,
                "model_used": "FoodVerse VisionNet v2.4 + Deep Feature Extractor",
                "all_detected_items": [
                    {"name": "Organic Quinoa", "dish_category": "Grain", "confidence": 0.95},
                    {"name": "Cherry Tomatoes", "dish_category": "Vegetable", "confidence": 0.93},
                    {"name": "Greek Feta Cheese", "dish_category": "Dairy", "confidence": 0.89}
                ]
            }
        ))
        db.add(FoodAnalysis(
            user_id=user.id,
            analysis_type="freshness",
            title="Freshness: Organic Fresh Produce",
            media_url="/sample_media/fresh_produce.jpg",
            confidence_score=0.95,
            health_score=96.0,
            status_label="Fresh",
            result_data={
                "item_detected": "Organic Fresh Produce",
                "freshness_status": "Fresh",
                "freshness_score": 96.0,
                "storage_recommendation": "Store in refrigerated crisper at 3-4°C.",
                "estimated_shelf_life_days": 6
            }
        ))
        db.add(FoodAnalysis(
            user_id=user.id,
            analysis_type="hygiene",
            title="Hygiene Audit: Prep Station Main Line",
            media_url="/sample_media/kitchen_hygiene_demo.mp4",
            confidence_score=0.92,
            health_score=85.0,
            status_label="Grade B (2 Violations)",
            result_data={
                "video_filename": "kitchen_hygiene_demo.mp4",
                "overall_hygiene_score": 85.0,
                "hygiene_grade": "B",
                "audit_summary": "Kitchen demonstrates good overall compliance with minor hairnet coverage lapse."
            }
        ))
        db.commit()
