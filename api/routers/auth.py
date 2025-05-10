from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime, timedelta
import uuid

# Modele
class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: str

class UserResponse(BaseModel):
    id: str
    email: EmailStr
    full_name: str
    created_at: datetime

    class Config:
        orm_mode = True

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

# Router
router = APIRouter()

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register_user(user: UserCreate):
    """
    Rejestruje nowego użytkownika w systemie.
    """
    # Tutaj będzie logika rejestracji użytkownika
    
    # Mock odpowiedzi dla przykładu
    return {
        "id": str(uuid.uuid4()),
        "email": user.email,
        "full_name": user.full_name,
        "created_at": datetime.now()
    }

@router.post("/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    """
    Loguje użytkownika i zwraca token JWT.
    """
    # Tutaj będzie logika logowania i generowania tokena
    
    # Mock odpowiedzi dla przykładu
    return {
        "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        "token_type": "bearer",
        "user": {
            "id": str(uuid.uuid4()),
            "email": "user@example.com",
            "full_name": "Jan Kowalski",
            "created_at": datetime.now()
        }
    }

@router.get("/me", response_model=UserResponse)
async def get_current_user():
    """
    Zwraca dane zalogowanego użytkownika.
    """
    # Tutaj będzie logika pobierania danych użytkownika na podstawie tokena
    
    # Mock odpowiedzi dla przykładu
    return {
        "id": str(uuid.uuid4()),
        "email": "user@example.com",
        "full_name": "Jan Kowalski",
        "created_at": datetime.now()
    } 