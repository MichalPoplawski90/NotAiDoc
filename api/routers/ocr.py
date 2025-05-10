from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from fastapi.responses import JSONResponse
from pydantic import BaseModel, UUID4
from typing import List, Dict, Any, Optional
from datetime import datetime
import uuid

# Modele
class OCRRequest(BaseModel):
    document_id: Optional[UUID4] = None

class OCRResponse(BaseModel):
    extracted_text: str
    confidence: float
    data: Dict[str, Any]
    document_type: Optional[str] = None

class DocumentClassification(BaseModel):
    document_type_id: UUID4
    confidence: float
    document_type_name: str

# Router
router = APIRouter()

@router.post("/extract", response_model=OCRResponse)
async def extract_text(
    file: UploadFile = File(...),
    document_id: Optional[str] = Form(None)
):
    """
    Ekstrahuje tekst z dokumentu używając OCR.
    """
    # Tutaj będzie logika OCR
    
    # Mock odpowiedzi dla przykładu
    return {
        "extracted_text": "Repertorium A numer 1234/2023\nAKT NOTARIALNY\nDnia pierwszego września dwa tysiące dwudziestego trzeciego roku (01.09.2023 r.) przed notariuszem Janem Kowalskim w jego kancelarii notarialnej w Warszawie przy ulicy Marszałkowskiej 1, stawili się:\n1. Anna Maria Nowak, córka Tomasza i Marii, zamieszkała w Warszawie przy ulicy Kwiatowej 5, legitymująca się dowodem osobistym ABC123456, PESEL 12345678901,\n2. Piotr Adam Wiśniewski, syn Adama i Ewy, zamieszkały w Krakowie przy ulicy Słonecznej 10, legitymujący się dowodem osobistym DEF789012, PESEL 98765432109.",
        "confidence": 0.92,
        "data": {
            "date": "01.09.2023",
            "notary_name": "Jan Kowalski",
            "repertory_number": "1234/2023",
            "parties": [
                {
                    "name": "Anna Maria Nowak",
                    "parents": "Tomasz i Maria",
                    "address": "Warszawa, ul. Kwiatowa 5",
                    "id_number": "ABC123456",
                    "pesel": "12345678901"
                },
                {
                    "name": "Piotr Adam Wiśniewski",
                    "parents": "Adam i Ewa",
                    "address": "Kraków, ul. Słoneczna 10",
                    "id_number": "DEF789012",
                    "pesel": "98765432109"
                }
            ]
        },
        "document_type": "Akt notarialny"
    }

@router.post("/classify", response_model=List[DocumentClassification])
async def classify_document(
    file: UploadFile = File(...)
):
    """
    Klasyfikuje typ dokumentu na podstawie jego treści.
    """
    # Tutaj będzie logika klasyfikacji dokumentu
    
    # Mock odpowiedzi dla przykładu
    return [
        {
            "document_type_id": uuid.uuid4(),
            "confidence": 0.85,
            "document_type_name": "Akt notarialny"
        },
        {
            "document_type_id": uuid.uuid4(),
            "confidence": 0.15,
            "document_type_name": "Pełnomocnictwo"
        }
    ]

@router.post("/extract-data/{document_id}", response_model=Dict[str, Any])
async def extract_data_from_document(document_id: UUID4):
    """
    Ekstrahuje strukturalne dane z dokumentu, który został już zeskanowany.
    """
    # Tutaj będzie logika ekstrakcji danych
    
    # Mock odpowiedzi dla przykładu
    return {
        "date": "01.09.2023",
        "notary_name": "Jan Kowalski",
        "repertory_number": "1234/2023",
        "parties": [
            {
                "name": "Anna Maria Nowak",
                "parents": "Tomasz i Maria",
                "address": "Warszawa, ul. Kwiatowa 5",
                "id_number": "ABC123456",
                "pesel": "12345678901"
            },
            {
                "name": "Piotr Adam Wiśniewski",
                "parents": "Adam i Ewa",
                "address": "Kraków, ul. Słoneczna 10",
                "id_number": "DEF789012",
                "pesel": "98765432109"
            }
        ],
        "document_type": "Akt notarialny",
        "property_details": {
            "address": "Warszawa, ul. Nowa 15",
            "land_registry_number": "WA1M/12345/6",
            "area": "150m²"
        },
        "transaction_value": "750000 PLN"
    } 