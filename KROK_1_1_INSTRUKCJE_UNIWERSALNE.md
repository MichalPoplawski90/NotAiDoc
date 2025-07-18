# KROK 1.1: Custom Document Classifier - Pierwsza faza (4 typy dokumentów)

## 🎯 CEL
Implementacja Custom Document Classifier do rozpoznawania **4 pierwszych typów dokumentów** na podstawie rzeczywistych danych treningowych.

## 📋 KLASY DOKUMENTÓW (4 typy - Faza I)

### Rzeczywiste dokumenty do trenowania:
1. **zaswiadczenie_o_podatku_od_spadkow_i_darowizn** - Zaświadczenie o podatku od spadków i darowizn
2. **zaswiadczenie_o_rewitalizacji** - Zaświadczenie o rewitalizacji  
3. **odpis_skrocony_aktu_urodzenia** - Odpis skrócony aktu urodzenia
4. **wypis_z_rejestru_gruntow** - Wypis z rejestru gruntów

### Planowane rozszerzenie:
- **Faza II:** Dodanie kolejnych typów dokumentów notarialnych
- **Faza III:** Pełny Universal Classifier z wszystkimi typami

---

## 🚀 CZĘŚĆ A: AKTUALIZACJA PROCESORA

### A1. Zaktualizuj schemat procesora
Istniejący procesor `NotAI-Universal-Document-Classifier` (ID: b0230601e72aeb31) musi zostać zaktualizowany do 4 klas.

### A2. Przejdź do Google Cloud Console
```
https://console.cloud.google.com/ai/document-ai/processors?project=notai-doc-ocr
```

---

## 🏗️ CZĘŚĆ B: KONFIGURACJA W GOOGLE CLOUD CONSOLE

### B1. Znajdź procesor "NotAI-Universal-Document-Classifier"
- Kliknij na procesor (ID: b0230601e72aeb31)
- Przejdź do zakładki **Train**

### B2. Sprawdź Dataset Location
- Jeśli nie skonfigurowany: **Set Dataset Location**
- Użyj **Google-managed storage** lub bucket: `notai-doc-classifier-dataset`

---

## 📝 CZĘŚĆ C: AKTUALIZACJA SCHEMATU

### C1. Przejdź do **Edit Schema**
1. W zakładce **Train** kliknij **Edit Schema**
2. **USUŃ** wszystkie poprzednie klasy (jeśli istnieją)
3. Utwórz nowe 4 klasy dokumentów:

### C2. Dodaj 4 klasy dokumentów (Document Type)
```
1. zaswiadczenie_o_podatku_od_spadkow_i_darowizn
2. zaswiadczenie_o_rewitalizacji
3. odpis_skrocony_aktu_urodzenia
4. wypis_z_rejestru_gruntow
```

### C3. Zapisz schemat
- Kliknij **Save**
- Potwierdź zmiany

---

## 📂 CZĘŚĆ D: ORGANIZACJA DANYCH TRENINGOWYCH

### D1. Struktura folderów dla Twoich dokumentów
```
training_data/
├── zaswiadczenie_podatek_spadki_darowizny/     # zaswiadczenie_o_podatku_od_spadkow_i_darowizn
├── zaswiadczenie_rewitalizacja/                # zaswiadczenie_o_rewitalizacji
├── odpis_skrocony_akt_urodzenia/               # odpis_skrocony_aktu_urodzenia
└── wypis_rejestr_gruntow/                      # wypis_z_rejestru_gruntow
```

### D2. Wymagania treningowe dla 4 klas
- **Minimum:** 10 dokumentów na klasę (40 dokumentów total)
- **Optymalne:** 20-30 dokumentów na klasę (80-120 dokumentów total)
- **Podział:** 80% training, 20% test (automatyczny)

---

## 📥 CZĘŚĆ E: IMPORT DOKUMENTÓW

### E1. Import pierwszej klasy
1. **Import documents** → **Import documents from Cloud Storage**
2. **Source path:** `training_data/zaswiadczenie_podatek_spadki_darowizny/`
3. **Data split:** Auto-split (80% training, 20% test)
4. **Apply labels:** Wybierz `zaswiadczenie_o_podatku_od_spadkow_i_darowizn`
5. **Import**

### E2. Powtórz dla pozostałych 3 klas
```
Klasa 2: zaswiadczenie_rewitalizacja/ → zaswiadczenie_o_rewitalizacji
Klasa 3: odpis_skrocony_akt_urodzenia/ → odpis_skrocony_aktu_urodzenia  
Klasa 4: wypis_rejestr_gruntow/ → wypis_z_rejestru_gruntow
```

---

## 🏷️ CZĘŚĆ F: WERYFIKACJA LABELINGU

### F1. Sprawdź auto-labeled dokumenty
1. Przejdź do sekcji **Auto-labeled**
2. Otwórz każdy dokument z każdej klasy
3. Zweryfikuj poprawność klasyfikacji:
   - Czy zaświadczenie o podatku zostało poprawnie oznaczone?
   - Czy odpis aktu urodzenia jest w dobrej klasie?
   - Czy wypis z rejestru gruntów jest właściwie sklasyfikowany?
4. **Mark as Labeled** po weryfikacji

### F2. Kontrola jakości
- Upewnij się, że każda klasa ma wystarczającą reprezentację
- Sprawdź czy dokumenty są czytelne i wysokiej jakości
- Usuń nieczytelne lub uszkodzone dokumenty

---

## 🎓 CZĘŚĆ G: TRENING MODELU

### G1. Sprawdź statystyki treningu
1. **View Label Stats** - sprawdź pokrycie 4 klas
2. Upewnij się że każda klasa ma minimum 10 dokumentów
3. Sprawdź balans między klasami

### G2. Rozpocznij trening
1. **Train New Version**
2. **Version name:** `notai-4-classes-v1`
3. **Description:** "Pierwsza wersja - 4 typy dokumentów: zaświadczenia podatek/rewitalizacja, odpis urodzenia, wypis gruntów"
4. **Start training**
5. ⏳ Trening może trwać 2-4 godziny dla 4 klas

---

## 📊 CZĘŚĆ H: EWALUACJA I WDROŻENIE

### H1. Sprawdź metryki dla 4 klas
1. **Manage Versions** → znajdź `notai-4-classes-v1`
2. **Evaluate & Test** → **View full evaluation**
3. Sprawdź metryki dla każdej z 4 klas:
   ```
   ✅ zaswiadczenie_o_podatku_od_spadkow_i_darowizn: F1 > 85%
   ✅ zaswiadczenie_o_rewitalizacji: F1 > 85%
   ✅ odpis_skrocony_aktu_urodzenia: F1 > 85%
   ✅ wypis_z_rejestru_gruntow: F1 > 85%
   ```

### H2. Wdróż model
1. **Deploy version** 
2. Poczekaj na deployment
3. **Set as default**

---

## 🧪 CZĘŚĆ I: TESTOWANIE NA RZECZYWISTYCH DOKUMENTACH

### I1. Test przez Console
1. **Evaluate & Test** → **Upload Test Document**
2. Prześlij przykłady z każdej z 4 klas
3. Sprawdź czy klasyfikacja jest poprawna

### I2. Test przez API
```bash
# Zaktualizuj test_custom_classifier.js z nowym processor ID
node test_custom_classifier.js
```

---

## 🎯 OCZEKIWANE REZULTATY

### Metryki sukcesu:
- **F1 Score:** > 90% dla każdej klasy
- **Precision:** > 85% dla każdej klasy  
- **Recall:** > 85% dla każdej klasy
- **Równomierne performance** - brak faworyzowania

### Workflow po implementacji:
```
Dokument → Universal Classifier → Typ dokumentu → Custom Extractor → Dane → AI Generator → Opis
```

---

## 🚨 ROZWIĄZYWANIE PROBLEMÓW

### Problem: Niska dokładność dla niektórych klas
**Rozwiązanie:** Dodaj więcej dokumentów treningowych dla problematycznych klas

### Problem: Confusion między podobnymi klasami
**Rozwiązanie:** Popraw jakość labelingu, dodaj więcej przykładów różnicujących

### Problem: Długi czas treningu
**Rozwiązanie:** Normalne dla 4 klas - może trwać 2-4 godziny

---

## 📈 NASTĘPNE KROKI

Po pomyślnym wdrożeniu Universal Classifier:

1. **Krok 1.2:** Integracja z aplikacją React Native
2. **Krok 1.3:** Custom Extractor dla każdego typu dokumentu
3. **Krok 1.4:** AI Generator opisów w stylu notariusza
4. **Krok 1.5:** End-to-end workflow testing

---

## 💡 WSKAZÓWKI

- **Jakość danych > Ilość:** Lepiej mniej, ale dobrze oznaczonych dokumentów
- **Balans klas:** Staraj się mieć podobną liczbę dokumentów w każdej klasie
- **Iteracyjne doskonalenie:** Rozpocznij od podstawowych klas, dodawaj kolejne
- **Monitoring:** Regularnie sprawdzaj performance w produkcji 