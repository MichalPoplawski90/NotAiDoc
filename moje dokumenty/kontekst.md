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

- React Native 0.79.2 with TypeScript ~5.8.3
- Expo SDK 53.0.0 (z React 19.0.0)
- React Navigation 7.x (Navigation Container + Native Stack + Bottom Tabs)
- React Native Paper ^5.12.3 (Material Design UI Framework)

#### Kluczowe pakiety Expo:
- expo-camera ~16.1.6 (nowe CameraView API do skanowania)
- expo-image-manipulator ~13.1.1 (przetwarzanie zdjęć dokumentów)
- expo-file-system ~18.1.9 (zarządzanie plikami dokumentów)
- expo-secure-store ~14.2.3 (bezpieczne przechowywanie kluczy)
- expo-document-picker ~13.1.5 (wybór dokumentów z urządzenia)
- expo-image-picker ~16.1.4 (wybór zdjęć z galerii)

#### Animacje i gestures:
- react-native-reanimated ~3.17.4 (płynne animacje)
- react-native-gesture-handler ~2.24.0 (obsługa gestów)

#### Storage i state management:
- @react-native-async-storage/async-storage ^2.1.2 (lokalne przechowywanie)
- React Context API (zarządzanie stanem aplikacji)

#### Networking:
- axios ^1.5.0 (HTTP requests)
- react-native-dotenv ^3.4.11 (zmienne środowiskowe)

#### Eksport i synchronizacja dokumentów:
- expo-sharing ^13.1.4 (udostępnianie dokumentów)
- expo-document-picker ~13.1.5 (wybór miejsca zapisu)
- expo-file-system ~18.1.9 (operacje na plikach)
- react-native-share (natywne opcje udostępniania)

### Backend/Database

- Supabase (PostgreSQL + Auth + Storage + Edge Functions)
  - @supabase/supabase-js ^1.35.7 (klient JS - wersja 1.x kompatybilna z React 19)
- FastAPI (Python) dla backendu AI/OCR
- OCR (Tesseract/Google Vision API)
- NLP dla analizy stylu i generowania tekstu
- Docker i Docker Compose (konteneryzacja)

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

## Aktualizacje i naprawy

### Naprawa Camera Component (Expo SDK 53)

**Problem:** 
- Stary `Camera` component z expo-camera nie działał w SDK 53
- React 19 powodował konflikty z niektórymi bibliotekami
- Metro bundler wymagał aktualizacji konfiguracji

**Rozwiązanie:**
1. **Aktualizacja do nowego CameraView API:**
   ```javascript
   // Stare API (przestarzałe w SDK 53)
   import { Camera } from 'expo-camera';
   
   // Nowe API (SDK 53+) - ten sam pakiet!
   import { CameraView, useCameraPermissions } from 'expo-camera';
   ```

2. **Aktualizacja package.json:**
   - React 19.0.0 (wymagane przez SDK 53)
   - React Native 0.79.2
   - expo-camera ~16.1.6
   - Usunięcie przestarzałych pakietów (expo-permissions)

3. **Konfiguracja Metro:**
   ```javascript
   // metro.config.js
   const { getDefaultConfig } = require('expo/metro-config');
   const config = getDefaultConfig(__dirname);
   module.exports = config;
   ```

4. **Główne zmiany w DocumentScanner.js:**
   - Zastąpienie `Camera` przez `CameraView` (nowe API w expo-camera)
   - Użycie `useCameraPermissions()` hook (zamiast przestarzałego Permissions)
   - Aktualizacja props: `facing`, `mode` (nowa składnia)
   - Nowa metoda `takePictureAsync()` (zmienione parametry)

**Status:** ✅ Nowe CameraView API działa poprawnie w SDK 53

## Kompatybilność wersji (Expo SDK 53)

### ✅ Potwierdzone wersje kompatybilne:
- **React Native:** 0.79.2 (wymagane dla SDK 53)
- **React:** 19.0.0 (wymagane dla SDK 53) 
- **TypeScript:** ~5.8.3
- **Supabase JS:** ^1.35.7 (wersja 1.x stabilna z React 19)
- **React Navigation:** 7.x (aktualny stack nawigacji)
- **React Native Paper:** ^5.12.3 (Material Design 3)

### ⚠️ Wersje wymagające uwagi:
- **Supabase v2.x:** Nie jest jeszcze w pełni kompatybilna z React 19
- **Expo Router:** Został zastąpiony przez React Navigation 7.x
- **Camera API:** Wymagana aktualizacja ze starszych wersji SDK

### 🎯 Zalecenia techniczne:
1. **Stabilność:** Aktualna konfiguracja SDK 53 + React 19 zapewnia dobrą stabilność
2. **Wydajność:** CameraView API oferuje lepszą wydajność niż starsze Camera
3. **Kompatybilność:** Wszystkie kluczowe pakiety są kompatybilne z Expo Go
4. **Przyszłość:** Stack przygotowany na przyszłe aktualizacje Expo SDK
