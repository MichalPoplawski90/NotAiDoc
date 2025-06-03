# NotAI DOC - Aplikacja dla notariuszy

## Cel projektu

**Główny cel:** Automatyczne generowanie opisów dokumentów notarialnych w indywidualnym stylu konkretnego notariusza lub w ustandaryzowanym stylu zaproponowanym przez program z wykorzystaniem sztucznej inteligencji.

**Problem:** Każdy notariusz ma swój unikalny styl opisywania dokumentów w aktach notarialnych. Ręczne tworzenie opisów jest czasochłonne i monotonne.

**Rozwiązanie:** AI uczy się stylu notariusza na podstawie przykładów i automatycznie generuje opisy nowych dokumentów dopasowane do indywidualnego stylu lub wedle wyboru zgodnie ze standardem zaproponowanym przez program.

## Główne funkcjonalności

### 🎯 **CORE: Generator opisów w stylu notariusza uzytkownika lub w stylu zaproponowanym przez program**
- **Uczenie stylu:** Analiza 2-3 przykładów opisów notariusza
- **Standardy eksperckie:** Gotowe wzorce opisów wypracowane przez doświadczonych notariuszy
- **Generowanie:** AI tworzy opis w wybranym stylu (własnym lub odpowiadającym standardowi eksperckiemu)
- **Edycja i uczenie:** Notariusz poprawia opis, AI uczy się z poprawek
- **Export:** Gotowy opis eksportowany do pliku tekstowego

### 🛠️ **NARZĘDZIA WSPOMAGAJĄCE:**
- **Skanowanie:** Pozyskanie dokumentu (aparat telefonu)
- **OCR + AI:** Automatyczna ekstrakcja kluczowych danych z dokumentu
- **Klasyfikacja:** Rozpoznanie typu dokumentu (odpis ksiegi wieczystej, testament, odpis stanu cywilnego etc.)
- **Management:** Organizacja w sprawy notarialne
- **Synchronizacja:** Bezpieczna integracja z systemami notariusza

## Przepływ pracy użytkownika

### 📁 **Główny workflow:**

1. **WYBÓR SPRAWY:** Notariusz wybiera sprawę (katalog dla dokumentów i opisów)

2. **WYBÓR/SCAN DOKUMENTU:** 
   - **Opcja A:** Wybiera typ dokumentu z listy → skanuje/importuje
   - **Opcja B:** Od razu skanuje → AI auto-klasyfikuje typ dokumentu

3. **STYLE CHECK & WYBÓR:** Program sprawdza opcje stylu dla tego typu dokumentu:
   - **Standard ekspercki:** Gotowy wzorzec opisu (zawsze dostępny)
   - **Własny styl:** Jeśli ma wystarczające przykłady ✅ lub prosi o przykłady ⚠️
   - **Notariusz wybiera:** Standard eksperckI lub własny styl

4. **PROCESSING:** OCR + AI ekstrahuje kluczowe dane z dokumentu

5. **GENEROWANIE:** AI tworzy opis w wybranym stylu (standardowym lub własnym)

6. **REVIEW & LEARN:** Notariusz edytuje opis → AI uczy się z poprawek

7. **OUTPUT:** Gotowy opis eksportowany do pliku i zsynchronizowany w sprawie

### 📊 **Style Management Tab:**
W celu proaktywnego dostarczenia opisów dokumentów w celu nauczenia programu stylu, notariusz ma dostęp do przeglądu wszystkich typów dokumentów ze wskazaniem:
- 🏆 **Standard ekspercki** (bazowy wzorzec wypracowany przez społeczność)
- ✅ **Własny styl gotowy** (wystarczająco przykładów użytkownika)
- ⚠️ **Własny styl - potrzebuje przykładów** (1-2 przykłady)  
- ❌ **Brak własnego stylu** (0 przykładów - można użyć standardu)

### 🤝 **Community Standards System:**
- **Propozycje ulepszeń:** Użytkownicy mogą sugerować modyfikacje standardów eksperckich
- **Głosowanie społeczności:** Notariusze głosują nad propozycjami zmian
- **Wersjonowanie standardów:** Tracking ewolucji wzorców opisów
- **Regionalne warianty:** Możliwość adaptacji do lokalnych praktyk

**Cel:** Proaktywne przygotowanie AI + ciągłe doskonalenie standardów przez społeczność notariuszy.

**Rezultat:** Zamiast 15-30 minut ręcznego pisania → 2-3 minuty review i eksport

## Technologie

### Frontend

- React Native 0.79.2 with TypeScript ~5.8.3
- Expo SDK 53.0.0 (z React 19.0.0)
- React Navigation 7.x (Navigation Container + Native Stack + Bottom Tabs)
- React Native Paper ^5.12.3 (Material Design UI Framework)

### ⚠️ **WYMAGANIA KOMPATYBILNOŚCI:**
**KONIECZNE:** Wszystkie pakiety muszą być kompatybilne z **Expo Go SDK 53**
- Expo Go nie obsługuje custom native modules
- Wymagane wersje: React 19.0.0 + React Native 0.79.2
- Sprawdzaj kompatybilność na: https://docs.expo.dev/workflow/using-libraries/
- **Supabase:** Używaj wersji 1.x (nie 2.x) dla stabilności z React 19

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
- expo-file-system ~18.1.9 (operacje na plikach)

### Backend/Database

- Supabase (PostgreSQL + Auth + Storage + Edge Functions)
  - @supabase/supabase-js ^1.35.7 (klient JS - wersja 1.x kompatybilna z React 19)
- FastAPI (Python) dla backendu AI/OCR
- OCR (Tesseract/Google Vision API)
- NLP dla analizy stylu i generowania tekstu
- Docker i Docker Compose (konteneryzacja)

## Struktura projektu

**Frontend (app/):** React Native + TypeScript + Expo SDK 53
- Components, Screens, Navigation (React Navigation)
- Features: auth, documents, scanner, style-learning, community
- Contexts, Hooks, Utils

**Backend (api/):** FastAPI + Python  
- Routers: auth, cases, documents, ocr, styles, standards
- Models, Services, Tests

## Baza danych

**Supabase PostgreSQL** z głównymi tabelami:
- **users** - notariusze (rozszerza auth.users)
- **cases** - sprawy notarialne  
- **documents** - zeskanowane dokumenty
- **document_types** - typy dokumentów (testament, umowa, etc.)
- **user_styles** + **style_examples** - własne style notariuszy
- **expert_standards** - standardy społeczności
- **standard_proposals** + **proposal_votes** - system głosowania

*Pełny schemat SQL dostępny w pliku database/schema.sql*

## Dokumentacja funkcjonalności

### Style Learning System
- **NLP Analysis:** Tokenizacja, wzorce strukturalne, formatowanie
- **Profil stylistyczny:** Uczenie na 2-3 przykładach + feedback loop
- **Aktywne uczenie:** AI poprawia się na podstawie edycji notariusza

### API Endpoints  
- `/api/auth/` - autoryzacja użytkowników
- `/api/cases/` - sprawy notarialne
- `/api/documents/` - zarządzanie dokumentami  
- `/api/ocr/` - ekstrakcja tekstu i klasyfikacja
- `/api/styles/` - style notariuszy
- `/api/standards/` - community standards

### Deployment
**Docker Compose:** FastAPI + PostgreSQL + PgAdmin
```bash
docker-compose up -d
```

## Status projektu

**⚠️ UWAGA:** Projekt WYMAGA kompatybilności z **Expo Go SDK 53**

**✅ Expo SDK 53 + React 19:** Kompatybilność potwierdzona
**✅ CameraView API:** Zaktualizowano z Camera component  
**✅ Supabase 1.35.7:** Stabilna integracja
**✅ React Navigation 7.x:** Główny routing stack
