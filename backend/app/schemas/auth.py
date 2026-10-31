from typing import Optional, List
from pydantic import BaseModel, EmailStr
import datetime

class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = "Food Explorer"

class UserRegister(UserBase):
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    height_cm: Optional[int] = None
    weight_kg: Optional[int] = None
    fitness_goal: Optional[str] = None
    daily_calorie_goal: Optional[int] = None
    dietary_preferences: Optional[List[str]] = None
    allergies: Optional[List[str]] = None
    favorite_cuisines: Optional[List[str]] = None
    disliked_ingredients: Optional[List[str]] = None

class UserOut(UserBase):
    id: int
    role: str
    is_active: bool
    age: int
    gender: str
    height_cm: int
    weight_kg: int
    fitness_goal: str
    daily_calorie_goal: int
    dietary_preferences: List[str]
    allergies: List[str]
    favorite_cuisines: List[str]
    disliked_ingredients: List[str]
    created_at: datetime.datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut

class TokenPayload(BaseModel):
    sub: Optional[str] = None
    role: Optional[str] = None
