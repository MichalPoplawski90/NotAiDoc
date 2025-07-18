# Prompt do nowego czatu: Implementacja OCR i AI rozpoznawania dokumentów

## 🎯 Cel projektu
Potrzebuję pomocy w wyborze i implementacji prawdziwego systemu OCR + AI rozpoznawania typu i treści dokumentów notarialnych w aplikacji NotAI DOC. Obecnie mam tylko placeholder - chcę zastąpić go profesjonalnym rozwiązaniem.

## 👨‍💻 O mnie
Jestem początkującym deweloperem - potrzebuję prowadzenia "za rękę" jak doświadczony DevOps. Proszę o:
- Szczegółowe wyjaśnienia decyzji technicznych
- Krok po kroku instrukcje implementacji  
- Wskazówki dotyczące best practices
- Ostrzeżenia przed typowymi pułapkami
- Pomoc w debugowaniu problemów

## 📋 Aktualny stan aplikacji

**Technologie:**
- Frontend: React Native + Expo SDK 53 + TypeScript
- Backend: Supabase (PostgreSQL + Auth + Storage)
- Deployment: Expo Go (wymagana kompatybilność!)

**Repozytorium:** https://github.com/MichalPoplawski90/NotAiDoc.git
**Aktualny commit:** `9adc017` (cropping dokumentów zaimplementowany)

**Struktura bazy danych:**
```sql
-- Tabela documents z nowymi kolumnami
ALTER TABLE documents 
ADD COLUMN auto_recognized BOOLEAN DEFAULT false;
ADD COLUMN recognition_confidence FLOAT;
```

**Placeholder do zastąpienia:**
Plik: `app/api/documents.js`
Funkcja: `recognizeDocumentType(imageUri)` - obecnie zwraca losowe dane

## 🎯 Wymagania funkcjonalne

**OCR + Klasyfikacja dokumentów:**
1. **Rozpoznawanie typu dokumentu** (testament, umowa, odpis księgi wieczystej, etc.)
2. **Ekstrakcja kluczowych danych** (imiona, daty, kwoty, adresy)
3. **Poziom pewności** rozpoznania (0-100%)
4. **Obsługa języka polskiego** (dokumenty notarialne PL)

**Typy dokumentów do rozpoznania:**
- Testament
- Umowa sprzedaży  
- Pełnomocnictwo
- Odpis księgi wieczystej
- Akt stanu cywilnego
- Umowa darowizny
- Inne dokumenty notarialne

## 🔧 Wymagania techniczne

**KRYTYCZNE - Kompatybilność z Expo Go SDK 53:**
- Wszystkie pakiety muszą działać w Expo Go
- Brak custom native modules
- React 19.0.0 + React Native 0.79.2

**Preferencje:**
- Dokładność > szybkość
- Prywatność danych (dokumenty wrażliwe)
- Możliwość pracy offline (opcjonalnie)
- Rozsądne koszty operacyjne

## 📝 Plan pracy

**ETAP 1: ANALIZA I WYBÓR ROZWIĄZANIA**
1. Przegląd dostępnych opcji (Google Vision, AWS Textract, OpenAI Vision, lokalne modele)
2. Analiza kompatybilności z Expo Go SDK 53
3. Porównanie kosztów, dokładności, prywatności
4. Rekomendacja najlepszego rozwiązania z uzasadnieniem

**ETAP 2: IMPLEMENTACJA (dopiero po wyborze)**
1. Konfiguracja wybranego serwisu
2. Implementacja funkcji rozpoznawania
3. Integracja z istniejącą aplikacją
4. Testy i optymalizacja

## ❓ Kluczowe pytania do rozstrzygnięcia

1. **Gdzie uruchomić AI?** Cloud vs. lokalne vs. edge computing
2. **Jaki model?** Gotowe API vs. custom model vs. hybrid
3. **Koszty vs. dokładność** - jaki balans dla aplikacji notarialnej?
4. **Prywatność** - czy dokumenty mogą opuszczać urządzenie?
5. **Offline capability** - czy konieczne dla notariuszy?

## 🎯 Oczekiwany rezultat

Na końcu chcę mieć:
- Działającą funkcję `recognizeDocumentType(imageUri)` zwracającą prawdziwe wyniki
- Funkcję `extractDocumentData(imageUri)` do ekstrakcji kluczowych informacji
- Dokumentację implementacji i konfiguracji
- Plan dalszego rozwoju i optymalizacji

## 📎 Załączniki

Zawsze załączam plik `kontekst.md` z pełną specyfikacją projektu NotAI DOC.

---

**Zacznijmy od ETAPU 1 - analizy opcji. Jako doświadczony DevOps, jakie rozwiązania OCR/AI polecasz dla mojej konfiguracji i jak powinniśmy je ocenić?** 