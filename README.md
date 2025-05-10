# NotAI DOC - Aplikacja dla notariuszy

NotAI DOC to aplikacja mobilna wspierająca pracę notariuszy dzięki automatyzacji procesu dokumentowania z wykorzystaniem sztucznej inteligencji.

## Funkcjonalności

- Skanowanie dokumentów notarialnych za pomocą aparatu telefonu
- Automatyczna klasyfikacja typu dokumentu
- Ekstrakcja kluczowych danych z wykorzystaniem OCR i AI
- Uczenie się stylu notariusza na podstawie przykładów
- Generowanie opisów dokumentów w stylu dopasowanym do notariusza
- Bezpieczna synchronizacja z komputerem/chmurą notariusza

## Architektura projektu

### Struktura folderów

```
.
├── app/                      # Aplikacja mobilna (React Native + Expo)
│   ├── assets/               # Zasoby (obrazy, fonty, itp.)
│   ├── components/           # Komponenty wielokrotnego użytku
│   ├── constants/            # Stałe i konfiguracja
│   ├── contexts/             # Konteksty React
│   ├── features/             # Funkcjonalności
│   │   ├── auth/             # Autoryzacja
│   │   ├── documents/        # Zarządzanie dokumentami
│   │   ├── scanner/          # Skaner dokumentów
│   │   └── style-learning/   # Uczenie stylu notariusza
│   ├── hooks/                # Hooki React
│   ├── navigation/           # Nawigacja
│   ├── screens/              # Ekrany aplikacji
│   ├── styles/               # Style i tematy
│   └── utils/                # Narzędzia i funkcje pomocnicze
│
├── api/                      # Backend (FastAPI)
│   ├── app/                  # Główna aplikacja FastAPI
│   ├── models/               # Modele danych
│   ├── routers/              # Endpointy API
│   ├── services/             # Usługi aplikacji
│   └── tests/                # Testy jednostkowe i integracyjne
│
├── database/                 # Skrypty bazy danych
│   └── schema.sql            # Schemat bazy danych
│
└── docs/                     # Dokumentacja projektu
```

### Technologie

- **Frontend**: React Native, Expo, React Native Paper
- **Backend**: FastAPI (Python), Supabase
- **Narzędzia AI**: OCR (Tesseract/Google Vision), NLP, OpenAI

## Uruchomienie projektu

### Wymagania

- Node.js (16.x lub nowszy)
- Python 3.10 lub nowszy
- Docker i Docker Compose

### Instalacja i uruchomienie

1. **Klonowanie repozytorium**

```bash
git clone https://github.com/twoj-username/notai-doc.git
cd notai-doc
```

2. **Konfiguracja środowiska**

Skopiuj przykładowy plik .env i dostosuj go do swoich potrzeb:

```bash
cp .env.example .env
```

3. **Uruchomienie backendu i bazy danych**

```bash
docker-compose up -d
```

4. **Uruchomienie aplikacji mobilnej**

```bash
cd app
npm install
npm start
```

## Korzystanie z aplikacji

1. Zaloguj się lub zarejestruj nowe konto
2. Utwórz nową sprawę
3. Dodaj dokument do sprawy przez zeskanowanie go aparatem
4. Aplikacja automatycznie rozpozna typ dokumentu i wyekstrahuje dane
5. Jeżeli jest to pierwszy dokument tego typu, aplikacja zapyta o przykłady stylu
6. Dla każdego kolejnego dokumentu aplikacja automatycznie wygeneruje opis w twoim stylu
7. Edytuj opis w razie potrzeby i zatwierdź
8. Zsynchronizuj opis dokumentu z komputerem lub chmurą

## Licencja

Ten projekt jest dostępny na licencji MIT. 