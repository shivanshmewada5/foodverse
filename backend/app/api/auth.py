from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.schemas.auth import UserRegister, UserLogin, UserOut, UserProfileUpdate, Token
from app.utils.security import verify_password, get_password_hash, create_access_token, get_current_user, require_current_user

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=Token)
def register(user_in: UserRegister, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == user_in.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email address already exists."
        )
    user = User(
        email=user_in.email,
        hashed_password=get_password_hash(user_in.password),
        full_name=user_in.full_name or "Food Explorer",
        dietary_preferences=["Mediterranean", "High Protein"],
        allergies=[],
        favorite_cuisines=["Italian", "Japanese", "Mediterranean"],
        disliked_ingredients=[]
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    access_token = create_access_token(data={"sub": user.email, "role": user.role})
    return Token(access_token=access_token, user=UserOut.model_validate(user))

@router.post("/login", response_model=Token)
def login(user_in: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == user_in.email).first()
    if not user or not verify_password(user_in.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password.",
            headers={"WWW-Authenticate": "Bearer"}
        )
    access_token = create_access_token(data={"sub": user.email, "role": user.role})
    return Token(access_token=access_token, user=UserOut.model_validate(user))

@router.get("/me", response_model=UserOut)
def get_profile(current_user: User = Depends(require_current_user)):
    return UserOut.model_validate(current_user)

@router.put("/me", response_model=UserOut)
def update_profile(
    profile_update: UserProfileUpdate,
    current_user: User = Depends(require_current_user),
    db: Session = Depends(get_db)
):
    update_data = profile_update.model_dump(exclude_unset=True)
    for field, val in update_data.items():
        if val is not None:
            setattr(current_user, field, val)
    db.commit()
    db.refresh(current_user)
    return UserOut.model_validate(current_user)

@router.post("/demo-login", response_model=Token)
def demo_login(db: Session = Depends(get_db)):
    """Provides a one-click demo login experience for testing without registration."""
    demo_email = "demo@foodverse.ai"
    user = db.query(User).filter(User.email == demo_email).first()
    if not user:
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
        
    access_token = create_access_token(data={"sub": user.email, "role": user.role})
    return Token(access_token=access_token, user=UserOut.model_validate(user))
