from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, Body, status
from fastapi.responses import JSONResponse
from typing import List, Optional
from pydantic import BaseModel, UUID4
from datetime import datetime
import uuid

# Modele
class DocumentBase(BaseModel):
    case_id: UUID4
    document_type_id: Optional[UUID4] = None

class DocumentCreate(DocumentBase):
    pass

class DocumentUpdate(BaseModel):
    document_type_id: Optional[UUID4] = None
    processed: Optional[bool] = None

class DocumentResponse(DocumentBase):
    id: UUID4
    original_filename: Optional[str]
    scan_file_path: Optional[str]
    scan_date: datetime
    processed: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

# Router
router = APIRouter()

@router.post("/", response_model=DocumentResponse, status_code=status.HTTP_201_CREATED)
async def create_document(
    file: UploadFile = File(...),
    case_id: str = Form(...),
    document_type_id: Optional[str] = Form(None)
):
    """
    Dodaje nowy dokument do systemu, zapisuje skan i rozpoczyna przetwarzanie.
    """
    # Tutaj będzie logika zapisu pliku i dodania dokumentu do bazy danych
    
    # Mock odpowiedzi dla przykładu
    return {
        "id": uuid.uuid4(),
        "case_id": uuid.UUID(case_id),
        "document_type_id": uuid.UUID(document_type_id) if document_type_id else None,
        "original_filename": file.filename,
        "scan_file_path": f"/storage/scans/{uuid.uuid4()}-{file.filename}",
        "scan_date": datetime.now(),
        "processed": False,
        "created_at": datetime.now(),
        "updated_at": datetime.now()
    }

@router.get("/{document_id}", response_model=DocumentResponse)
async def get_document(document_id: UUID4):
    """
    Pobiera szczegóły dokumentu na podstawie ID.
    """
    # Tutaj będzie logika pobierania dokumentu
    
    # Mock odpowiedzi dla przykładu
    return {
        "id": document_id,
        "case_id": uuid.uuid4(),
        "document_type_id": uuid.uuid4(),
        "original_filename": "akt_notarialny.pdf",
        "scan_file_path": f"/storage/scans/{document_id}-akt_notarialny.pdf",
        "scan_date": datetime.now(),
        "processed": True,
        "created_at": datetime.now(),
        "updated_at": datetime.now()
    }

@router.get("/case/{case_id}", response_model=List[DocumentResponse])
async def get_documents_by_case(case_id: UUID4):
    """
    Pobiera wszystkie dokumenty dla danej sprawy.
    """
    # Tutaj będzie logika pobierania dokumentów dla sprawy
    
    # Mock odpowiedzi dla przykładu
    return [
        {
            "id": uuid.uuid4(),
            "case_id": case_id,
            "document_type_id": uuid.uuid4(),
            "original_filename": "dokument1.pdf",
            "scan_file_path": f"/storage/scans/dokument1.pdf",
            "scan_date": datetime.now(),
            "processed": True,
            "created_at": datetime.now(),
            "updated_at": datetime.now()
        },
        {
            "id": uuid.uuid4(),
            "case_id": case_id,
            "document_type_id": uuid.uuid4(),
            "original_filename": "dokument2.pdf",
            "scan_file_path": f"/storage/scans/dokument2.pdf",
            "scan_date": datetime.now(),
            "processed": False,
            "created_at": datetime.now(),
            "updated_at": datetime.now()
        }
    ]

@router.put("/{document_id}", response_model=DocumentResponse)
async def update_document(document_id: UUID4, document_update: DocumentUpdate):
    """
    Aktualizuje dane dokumentu.
    """
    # Tutaj będzie logika aktualizacji dokumentu
    
    # Mock odpowiedzi dla przykładu
    return {
        "id": document_id,
        "case_id": uuid.uuid4(),
        "document_type_id": document_update.document_type_id,
        "original_filename": "akt_notarialny.pdf",
        "scan_file_path": f"/storage/scans/{document_id}-akt_notarialny.pdf",
        "scan_date": datetime.now(),
        "processed": document_update.processed if document_update.processed is not None else True,
        "created_at": datetime.now(),
        "updated_at": datetime.now()
    }

@router.delete("/{document_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_document(document_id: UUID4):
    """
    Usuwa dokument z systemu.
    """
    # Tutaj będzie logika usuwania dokumentu
    return None 