# NotAI DOC - Aplikacja dla notariuszy

## Cel projektu

Stworzenie aplikacji mobilnej wspomagającej pracę notariuszy poprzez automatyzację procesu dokumentowania z wykorzystaniem sztucznej inteligencji.

## Główne funkcjonalności

- Skanowanie dokumentów notarialnych za pomocą aparatu telefonu
- Automatyczna klasyfikacja typu dokumentu
- Ekstrakcja kluczowych danych z wykorzystaniem OCR i AI
- Uczenie się stylu notariusza na podstawie przykładów
- Generowanie opisów dokumentów w stylu dopasowanym do notariusza
- Bezpieczna synchronizacja z komputerem/chmurą notariusza

## Przepływ pracy użytkownika

1. Notariusz wybiera/tworzy sprawę
2. Skanuje dokument
3. Aplikacja rozpoznaje typ dokumentu i ekstrahuje dane
4. Aplikacja proponuje metodę synchronizacji dokumentu
5. Aplikacja generuje opis dokumentu w stylu notariusza
6. Aplikacja umozliwia edycję opisu dokumentu
7. Gotowy opis dokumentu jest exportowany do pliku tekstowego i synchronizowany

## Technologie

### Frontend

- React Native with TypeScript
- Expo
- Expo Router
- React Native Paper (UI Framework)

### Backend/Database

- Supabase
- FastAPI (Python) dla backendu AI
- OCR (Tesseract/Google Vision)
- NLP dla analizy stylu i generowania tekstu
- Docker i Docker Compose

## Struktura projektu

### Aplikacja (frontend)

```
app/
├── assets/               # Zasoby (obrazy, fonty, itp.)
├── components/           # Komponenty wielokrotnego użytku
├── constants/            # Stałe i konfiguracja
├── contexts/             # Konteksty React
├── features/             # Funkcjonalności
│   ├── auth/             # Autoryzacja
│   ├── documents/        # Zarządzanie dokumentami
│   ├── scanner/          # Skaner dokumentów
│   └── style-learning/   # Uczenie stylu notariusza
├── hooks/                # Hooki React
├── navigation/           # Nawigacja
├── screens/              # Ekrany aplikacji
├── styles/               # Style i tematy
└── utils/                # Narzędzia i funkcje pomocnicze
```

### Backend (FastAPI)

```
api/
├── app/                  # Główna aplikacja FastAPI
├── models/               # Modele danych
├── routers/              # Endpointy API
│   ├── auth.py           # Autoryzacja
│   ├── cases.py          # Sprawy notarialne
│   ├── documents.py      # Dokumenty
│   ├── ocr.py            # OCR i ekstrakcja danych
│   └── styles.py         # Style notariusza
├── services/             # Usługi aplikacji
└── tests/                # Testy jednostkowe i integracyjne
```

## Baza danych

### Schema

```sql
-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email TEXT UNIQUE,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Cases table
CREATE TABLE IF NOT EXISTS cases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  status TEXT DEFAULT 'active'
);

-- Document types table
CREATE TABLE IF NOT EXISTS document_types (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT
);

-- Documents table
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  case_id UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  document_type_id UUID REFERENCES document_types(id),
  original_filename TEXT,
  scan_file_path TEXT,
  scan_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  processed BOOLEAN DEFAULT false,
  user_id UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Extracted data table
CREATE TABLE IF NOT EXISTS extracted_data (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  data JSONB NOT NULL,
  confidence FLOAT
);

-- Document descriptions table
CREATE TABLE IF NOT EXISTS document_descriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  ai_generated_text TEXT,
  user_edited_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- User styles table
CREATE TABLE IF NOT EXISTS user_styles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  document_type_id UUID REFERENCES document_types(id),
  style_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Style examples table
CREATE TABLE IF NOT EXISTS style_examples (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_style_id UUID NOT NULL REFERENCES user_styles(id) ON DELETE CASCADE,
  example_text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

## Dokumentacja funkcjonalności

### Uczenie się stylu notariusza

#### Opis funkcjonalności

System analizy stylu notariusza pozwala na automatyczne dostosowanie generowanych opisów dokumentów do indywidualnego stylu danego notariusza.

#### Mechanizm działania

1. Notariusz wprowadza 2-3 przykłady opisów tego samego typu dokumentu ze swoich aktów notarialnych
2. System analizuje przykłady za pomocą technik NLP:
   - Identyfikacja schematów i struktury opisu
   - Rozpoznawanie typowych zwrotów i fraz
   - Analiza formatowania danych (np. liczby słownie vs. cyfrowo)
   - Identyfikacja kolejności prezentacji danych
3. Tworzony jest profil stylistyczny notariusza
4. Przy generowaniu nowych opisów system wykorzystuje profil stylistyczny
5. Wygenerowany opis jest mozliwy do edycji w aplikacji, po zatwierdzeniu program uczy się zmian
6. Gotowy opis jest exportowany do pliku tekstowego (do wyboru txt, doc, etc.) i synchronizowany do folderu projektu

#### Kluczowe aspekty techniczne

- Tokenizacja i analiza lingwistyczna tekstu
- Wykrywanie wzorców strukturalnych w opisach
- Ekstrakcja specyficznych cech stylu (format liczb, dat, etc.)
- Mechanizm aktywnego uczenia na podstawie poprawek

### API BackEnd

#### Główne endpointy

1. Autoryzacja (`/api/auth/`)
   - Rejestracja użytkownika
   - Logowanie
   - Pobieranie danych użytkownika

2. Sprawy (`/api/cases/`)
   - Tworzenie sprawy notarialnej
   - Pobieranie spraw
   - Zarządzanie sprawami

3. Dokumenty (`/api/documents/`)
   - Dodawanie dokumentów
   - Pobieranie dokumentów
   - Zarządzanie dokumentami

4. OCR i ekstrakcja danych (`/api/ocr/`)
   - Ekstrakcja tekstu z dokumentu
   - Klasyfikacja typu dokumentu
   - Ekstrakcja strukturalnych danych

5. Style notariusza (`/api/styles/`)
   - Tworzenie stylu
   - Dodawanie przykładów stylu
   - Generowanie tekstu w stylu notariusza

### Docker i uruchomienie

Projekt jest skonfigurowany za pomocą Docker Compose z następującymi serwisami:
- API (FastAPI backend)
- Baza danych PostgreSQL
- PgAdmin (UI dla bazy danych)

Uruchomienie projektu:
```bash
docker-compose up -d
```
