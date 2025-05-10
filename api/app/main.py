from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv

# Ładowanie zmiennych środowiskowych
load_dotenv()

# Import routerów
from routers import auth, documents, cases, styles, ocr

# Tworzenie aplikacji FastAPI
app = FastAPI(
    title="NotAI DOC API",
    description="API dla aplikacji NotAI DOC wspierającej pracę notariuszy",
    version="0.1.0"
)

# Konfiguracja CORS
origins = [
    "http://localhost",
    "http://localhost:19006",  # Expo
    "http://localhost:3000",   # Dla testów w przeglądarce
    "exp://localhost:19000",   # Expo w trybie dev
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dołączanie routerów
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(documents.router, prefix="/api/documents", tags=["documents"])
app.include_router(cases.router, prefix="/api/cases", tags=["cases"])
app.include_router(styles.router, prefix="/api/styles", tags=["styles"])
app.include_router(ocr.router, prefix="/api/ocr", tags=["ocr"])

@app.get("/")
def read_root():
    return {"message": "Witaj w API NotAI DOC"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True) 