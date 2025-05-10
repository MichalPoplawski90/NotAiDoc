from fastapi import APIRouter, Depends, HTTPException, status, Body
from pydantic import BaseModel, UUID4
from typing import List, Optional, Dict, Any
from datetime import datetime
import uuid

# Modele
class StyleExampleCreate(BaseModel):
    example_text: str

class StyleExampleResponse(StyleExampleCreate):
    id: UUID4
    created_at: datetime

    class Config:
        orm_mode = True

class UserStyleBase(BaseModel):
    document_type_id: Optional[UUID4] = None
    style_data: Optional[Dict[str, Any]] = None

class UserStyleCreate(UserStyleBase):
    examples: List[StyleExampleCreate]

class UserStyleResponse(UserStyleBase):
    id: UUID4
    created_at: datetime
    updated_at: datetime
    examples: List[StyleExampleResponse]

    class Config:
        orm_mode = True

# Router
router = APIRouter()

@router.post("/", response_model=UserStyleResponse, status_code=status.HTTP_201_CREATED)
async def create_style(style: UserStyleCreate):
    """
    Tworzy nowy styl dla notariusza z przykładami.
    """
    # Tutaj będzie logika tworzenia stylu
    
    # Mock odpowiedzi dla przykładu
    return {
        "id": uuid.uuid4(),
        "document_type_id": style.document_type_id,
        "style_data": style.style_data or {"format": "formal", "prefers_numbers_as_words": True},
        "created_at": datetime.now(),
        "updated_at": datetime.now(),
        "examples": [
            {
                "id": uuid.uuid4(),
                "example_text": example.example_text,
                "created_at": datetime.now()
            } for example in style.examples
        ]
    }

@router.get("/", response_model=List[UserStyleResponse])
async def get_styles():
    """
    Pobiera wszystkie style notariusza.
    """
    # Tutaj będzie logika pobierania stylów
    
    # Mock odpowiedzi dla przykładu
    return [
        {
            "id": uuid.uuid4(),
            "document_type_id": uuid.uuid4(),
            "style_data": {"format": "formal", "prefers_numbers_as_words": True},
            "created_at": datetime.now(),
            "updated_at": datetime.now(),
            "examples": [
                {
                    "id": uuid.uuid4(),
                    "example_text": "Stawili się przed notariuszem...",
                    "created_at": datetime.now()
                },
                {
                    "id": uuid.uuid4(),
                    "example_text": "Na mocy niniejszego aktu notarialnego...",
                    "created_at": datetime.now()
                }
            ]
        }
    ]

@router.get("/{style_id}", response_model=UserStyleResponse)
async def get_style(style_id: UUID4):
    """
    Pobiera szczegóły stylu notariusza.
    """
    # Tutaj będzie logika pobierania stylu
    
    # Mock odpowiedzi dla przykładu
    return {
        "id": style_id,
        "document_type_id": uuid.uuid4(),
        "style_data": {"format": "formal", "prefers_numbers_as_words": True},
        "created_at": datetime.now(),
        "updated_at": datetime.now(),
        "examples": [
            {
                "id": uuid.uuid4(),
                "example_text": "Stawili się przed notariuszem...",
                "created_at": datetime.now()
            },
            {
                "id": uuid.uuid4(),
                "example_text": "Na mocy niniejszego aktu notarialnego...",
                "created_at": datetime.now()
            }
        ]
    }

@router.post("/{style_id}/examples", response_model=StyleExampleResponse)
async def add_example(style_id: UUID4, example: StyleExampleCreate):
    """
    Dodaje nowy przykład do stylu notariusza.
    """
    # Tutaj będzie logika dodawania przykładu
    
    # Mock odpowiedzi dla przykładu
    return {
        "id": uuid.uuid4(),
        "example_text": example.example_text,
        "created_at": datetime.now()
    }

@router.post("/generate", response_model=Dict[str, str])
async def generate_text(
    document_id: UUID4 = Body(...), 
    style_id: Optional[UUID4] = Body(None)
):
    """
    Generuje tekst na podstawie danych wyekstrahowanych z dokumentu i stylu notariusza.
    """
    # Tutaj będzie logika generowania tekstu
    
    # Mock odpowiedzi dla przykładu
    return {
        "generated_text": "Dnia pierwszego września dwa tysiące dwudziestego trzeciego roku (01.09.2023 r.) przed notariuszem Janem Kowalskim stawili się: 1. Anna Maria Nowak, córka Tomasza i Marii, zamieszkała w Warszawie przy ulicy Kwiatowej 5, legitymująca się dowodem osobistym ABC123456, PESEL 12345678901, 2. Piotr Adam Wiśniewski, syn Adama i Ewy, zamieszkały w Krakowie przy ulicy Słonecznej 10, legitymujący się dowodem osobistym DEF789012, PESEL 98765432109. Stawający oświadczają, że zawierają umowę sprzedaży nieruchomości..."
    } 