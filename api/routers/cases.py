from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, UUID4
from typing import List, Optional
from datetime import datetime
import uuid

# Modele
class CaseBase(BaseModel):
    title: str
    description: Optional[str] = None
    
class CaseCreate(CaseBase):
    pass

class CaseUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None

class CaseResponse(CaseBase):
    id: UUID4
    status: str
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

# Router
router = APIRouter()

@router.post("/", response_model=CaseResponse, status_code=status.HTTP_201_CREATED)
async def create_case(case: CaseCreate):
    """
    Tworzy nową sprawę notarialną.
    """
    # Tutaj będzie logika tworzenia sprawy
    
    # Mock odpowiedzi dla przykładu
    return {
        "id": uuid.uuid4(),
        "title": case.title,
        "description": case.description,
        "status": "active",
        "created_at": datetime.now(),
        "updated_at": datetime.now()
    }

@router.get("/", response_model=List[CaseResponse])
async def get_cases():
    """
    Pobiera wszystkie sprawy notarialne użytkownika.
    """
    # Tutaj będzie logika pobierania spraw
    
    # Mock odpowiedzi dla przykładu
    return [
        {
            "id": uuid.uuid4(),
            "title": "Akt notarialny - sprzedaż nieruchomości",
            "description": "Sprawa dotyczy sprzedaży nieruchomości przy ul. Kwiatowej 5",
            "status": "active",
            "created_at": datetime.now(),
            "updated_at": datetime.now()
        },
        {
            "id": uuid.uuid4(),
            "title": "Testament",
            "description": "Przygotowanie testamentu dla Jana Kowalskiego",
            "status": "completed",
            "created_at": datetime.now(),
            "updated_at": datetime.now()
        }
    ]

@router.get("/{case_id}", response_model=CaseResponse)
async def get_case(case_id: UUID4):
    """
    Pobiera szczegóły sprawy notarialnej.
    """
    # Tutaj będzie logika pobierania sprawy
    
    # Mock odpowiedzi dla przykładu
    return {
        "id": case_id,
        "title": "Akt notarialny - sprzedaż nieruchomości",
        "description": "Sprawa dotyczy sprzedaży nieruchomości przy ul. Kwiatowej 5",
        "status": "active",
        "created_at": datetime.now(),
        "updated_at": datetime.now()
    }

@router.put("/{case_id}", response_model=CaseResponse)
async def update_case(case_id: UUID4, case_update: CaseUpdate):
    """
    Aktualizuje dane sprawy notarialnej.
    """
    # Tutaj będzie logika aktualizacji sprawy
    
    # Mock odpowiedzi dla przykładu
    return {
        "id": case_id,
        "title": case_update.title if case_update.title else "Akt notarialny - sprzedaż nieruchomości",
        "description": case_update.description if case_update.description else "Sprawa dotyczy sprzedaży nieruchomości przy ul. Kwiatowej 5",
        "status": case_update.status if case_update.status else "active",
        "created_at": datetime.now(),
        "updated_at": datetime.now()
    }

@router.delete("/{case_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_case(case_id: UUID4):
    """
    Usuwa sprawę notarialną.
    """
    # Tutaj będzie logika usuwania sprawy
    return None 