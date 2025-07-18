# FINALNA INSTRUKCJA TRENINGU - Custom Document Classifier

## 🎓 ETAP 5: ROZPOCZĘCIE TRENINGU

### **SPRAWDZENIE PRZED TRENINGIEM**
1. **Przejdź** do zakładki **"Train"**
2. **Kliknij "View Label Stats"**
3. **Sprawdź pokrycie:**
   ```
   ✅ zaswiadczenie_o_podatku_od_spadkow_i_darowizn: ~10 dokumentów
   ✅ zaswiadczenie_o_rewitalizacji: ~10 dokumentów  
   ✅ odpis_skrocony_aktu_urodzenia: ~10 dokumentów
   ✅ wypis_z_rejestru_gruntow: ~10 dokumentów
   
   📊 Total: ~40 dokumentów (80% training, 20% test)
   ```

### **ROZPOCZNIJ TRENING**
1. **Kliknij "Train New Version"**
2. **Version name:** `notai-4-classes-v1`
3. **Description:** 
   ```
   Pierwsza wersja Universal Classifier - 4 typy dokumentów notarialnych:
   - Zaświadczenia o podatku od spadków i darowizn
   - Zaświadczenia o rewitalizacji  
   - Odpisy skrócone aktu urodzenia
   - Wypisy z rejestru gruntów
   ```
4. **Kliknij "Start training"**

### **OCZEKIWANIA CZASOWE**
- ⏳ **Czas treningu:** 2-4 godziny dla 4 klas
- 📊 **Monitoring:** Sprawdzaj status co 30-60 minut
- 🔔 **Powiadomienia:** Włącz email notifications

---

## 📊 ETAP 6: EWALUACJA MODELU

### **Po zakończeniu treningu:**
1. **Przejdź** do **"Manage Versions"**
2. **Znajdź** `notai-4-classes-v1`
3. **Kliknij "Evaluate & Test"**
4. **Sprawdź "View full evaluation"**

### **METRYKI SUKCESU - OCZEKIWANE WARTOŚCI:**
```
🎯 TARGET PERFORMANCE dla każdej klasy:

zaswiadczenie_o_podatku_od_spadkow_i_darowizn:
  ✅ F1 Score: > 85%
  ✅ Precision: > 85%  
  ✅ Recall: > 85%

zaswiadczenie_o_rewitalizacji:
  ✅ F1 Score: > 85%
  ✅ Precision: > 85%
  ✅ Recall: > 85%

odpis_skrocony_aktu_urodzenia:
  ✅ F1 Score: > 85%
  ✅ Precision: > 85%
  ✅ Recall: > 85%

wypis_z_rejestru_gruntow:
  ✅ F1 Score: > 85%
  ✅ Precision: > 85%
  ✅ Recall: > 85%
```

### **ANALIZA CONFUSION MATRIX:**
- Sprawdź czy nie ma confusion między podobnymi klasami
- Zwróć uwagę na false positives/negatives
- Identyfikuj klasy wymagające dodatkowych danych

---

## 🚀 ETAP 7: DEPLOYMENT

### **WDROŻENIE MODELU:**
1. **Jeśli metryki są zadowalające (>85% F1 dla każdej klasy):**
   - Kliknij **"Deploy version"**
   - Poczekaj na deployment (~10-15 minut)
   - Kliknij **"Set as default"**

2. **Jeśli metryki są niskie (<85% F1):**
   - Dodaj więcej dokumentów treningowych dla problematycznych klas
   - Popraw jakość labelingu
   - Uruchom ponowny trening

---

## 🧪 ETAP 8: TESTOWANIE

### **TEST 1: Console Testing**
1. **"Evaluate & Test"** → **"Upload Test Document"**
2. **Prześlij po 1 przykładzie z każdej klasy**
3. **Sprawdź czy klasyfikacja jest poprawna**

### **TEST 2: API Testing**
```bash
# Uruchom test przez API
node test_universal_classifier.js
```

**Oczekiwany output:**
```
🧪 Testowanie klasyfikacji: dokument_1.pdf
📋 Oczekiwana klasa: zaswiadczenie_o_podatku_od_spadkow_i_darowizn
✅ Klasyfikacja poprawna: 94.2% confidence

🧪 Testowanie klasyfikacji: dokument_2.pdf  
📋 Oczekiwana klasa: zaswiadczenie_o_rewitalizacji
✅ Klasyfikacja poprawna: 91.8% confidence

🧪 Testowanie klasyfikacji: dokument_3.pdf
📋 Oczekiwana klasa: odpis_skrocony_aktu_urodzenia  
✅ Klasyfikacja poprawna: 96.5% confidence

🧪 Testowanie klasyfikacji: dokument_4.pdf
📋 Oczekiwana klasa: wypis_z_rejestru_gruntow
✅ Klasyfikacja poprawna: 89.3% confidence
```

---

## 🎯 KRYTERIUM SUKCESU

### **Model gotowy do produkcji gdy:**
- ✅ F1 Score > 85% dla wszystkich 4 klas
- ✅ Brak confusion między klasami > 10%
- ✅ Test API zwraca poprawne klasyfikacje
- ✅ Model deployed i ustawiony jako default

### **Next steps po sukcesie:**
1. **Integracja z aplikacją React Native**
2. **Custom Extractors dla każdego typu dokumentu**
3. **AI Generator opisów w stylu notariusza**
4. **End-to-end workflow testing**

---

## 🚨 TROUBLESHOOTING

### **Problem: Niska dokładność (<85% F1)**
**Rozwiązania:**
- Dodaj więcej dokumentów treningowych (15-20 na klasę)
- Popraw jakość danych (usuń nieczytelne dokumenty)
- Sprawdź consistency labelingu

### **Problem: Confusion między klasami**
**Rozwiązania:**  
- Dodaj więcej różnicujących przykładów
- Sprawdź czy dokumenty nie są mylące wizualnie
- Rozważ dodanie neg

### **Problem: Długi czas treningu (>6h)**
**Rozwiązania:**
- Sprawdź rozmiar uploadowanych plików
- Zmniejsz rozdzielczość obrazów (jeśli >300 DPI)
- Kontakt z Google Cloud Support

### **Problem: Deployment fails**
**Rozwiązania:**
- Sprawdź quota dla Document AI
- Sprawdź permissions dla service account
- Retry deployment po 15 minutach 