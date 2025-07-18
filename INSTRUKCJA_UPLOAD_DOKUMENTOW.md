# INSTRUKCJA UPLOAD DOKUMENTÓW - Google Cloud Console

## 🎯 MAPA UPLOADU - 40 DOKUMENTÓW DO 4 KLAS

### **KLASA 1: zaswiadczenie_o_podatku_od_spadkow_i_darowizn**
**Folder:** `training_data/zaswiadczenie_podatek_spadki_darowizny/`
**Dokumenty (10):**
```
1. IMG_20190411_120547.jpg.b27f1d13e20fbbce6edda6c9757b5ebc.jpg
2. Resized_20241119_082317_1732002964511.JPEG
3. WARSZAWA, dnia 15 kwietnia 2019 roku.pdf
4. image000005.JPG
5. IMG_20190411_120547.jpg.b27f1d13e20fbbce6edda6c9757b5ebc_variant_1.jpg
6. Resized_20241119_082317_1732002964511_variant_1.JPEG
7. WARSZAWA, dnia 15 kwietnia 2019 roku_variant_1.pdf
8. image000005_variant_1.JPG
9. IMG_20190411_120547.jpg.b27f1d13e20fbbce6edda6c9757b5ebc_variant_2.jpg
10. Resized_20241119_082317_1732002964511_variant_2.JPEG
```

### **KLASA 2: zaswiadczenie_o_rewitalizacji**
**Folder:** `training_data/zaswiadczenie_rewitalizacja/`
**Dokumenty (10):**
```
1. zaświadczenie o rewitalizacji.pdf
2. zawiadomienie_rewitalizacja.pdf
3. image.webp
4. dzialka-budowlana-kretomino.webp
5. Odpowiedz_dla_notariuszy_obszar_zdegradowany_rewitalizacji_i_specjalna_strefa_rewitalizacji.pdf
6. Niesięcin rewitalizacja.jpg
7. Niesięcin rewitalizacja_variant_1.jpg
8. Odpowiedz_dla_notariuszy_obszar_zdegradowany_rewitalizacji_i_specjalna_strefa_rewitalizacji_variant_1.pdf
9. dzialka-budowlana-kretomino_variant_1.webp
10. image_variant_1.webp
```

### **KLASA 3: odpis_skrocony_aktu_urodzenia**
**Folder:** `training_data/odpis_skrocony_akt_urodzenia/`
**Dokumenty (10):**
```
1. pobrane.png
2. pobrane 2.png
3. pobrane (3).png
4. pobrane (2).png
5. pobrane (1).png
6. Skrócony akt urodzenia Natalia Kobiela.pdf
7. IMG_6516.jpg
8. oficjalny_wzor_USC.pdf
9. IMG_6516_variant_1.jpg
10. Skrócony akt urodzenia Natalia Kobiela_variant_1.pdf
```

### **KLASA 4: wypis_z_rejestru_gruntow**
**Folder:** `training_data/wypis_rejestr_gruntow/`
**Dokumenty (10):**
```
1. wypis_z_rejestru_gruntow.pdf
2. wypis i wyrys z rejestru gruntów dz 82 i 83.pdf
3. pobrane.png
4. pobrane (2).png
5. pobrane (1).png
6. Zal. Tekst 10 - wypis i wyrys 1013,66-11.pdf
7. Leleszki-B.pdf
8. Leleszki-B_variant_1.pdf
9. Zal. Tekst 10 - wypis i wyrys 1013,66-11_variant_1.pdf
10. pobrane (1)_variant_1.png
```

---

## 📤 PROCEDURA UPLOADU W GOOGLE CLOUD CONSOLE

### **KROK 1: Rozpocznij import**
1. W zakładce **"Train"** kliknij **"Import documents"**
2. Wybierz **"Upload files"**

### **KROK 2: Upload i labelowanie (dla każdej klasy osobno)**

#### **Upload klasy 1:**
1. **Wybierz pliki** z folderu `zaswiadczenie_podatek_spadki_darowizny/` (wszystkie 10)
2. **Data split:** Zostaw **"Auto-split"** (80% training, 20% test)
3. **Label:** Wybierz `zaswiadczenie_o_podatku_od_spadkow_i_darowizn`
4. **Import**

#### **Upload klasy 2:**
1. **Wybierz pliki** z folderu `zaswiadczenie_rewitalizacja/` (wszystkie 10)  
2. **Data split:** **"Auto-split"**
3. **Label:** Wybierz `zaswiadczenie_o_rewitalizacji`
4. **Import**

#### **Upload klasy 3:**
1. **Wybierz pliki** z folderu `odpis_skrocony_akt_urodzenia/` (wszystkie 10)
2. **Data split:** **"Auto-split"**
3. **Label:** Wybierz `odpis_skrocony_aktu_urodzenia`
4. **Import**

#### **Upload klasy 4:**
1. **Wybierz pliki** z folderu `wypis_rejestr_gruntow/` (wszystkie 10)
2. **Data split:** **"Auto-split"**
3. **Label:** Wybierz `wypis_z_rejestru_gruntow`
4. **Import**

---

## 🏷️ WERYFIKACJA LABELINGU

### **Po każdym uploadsie:**
1. **Przejdź** do sekcji **"Auto-labeled"**
2. **Sprawdź** kilka dokumentów z każdej klasy
3. **Zweryfikuj** poprawność klasyfikacji
4. **Mark as Labeled** po weryfikacji

### **Kontrola jakości:**
- Sprawdź czy żaden dokument nie został źle sklasyfikowany
- Usuń nieczytelne lub uszkodzone dokumenty
- Upewnij się że wszystkie 4 klasy są reprezentowane

---

## 📊 SPRAWDZENIE PRZED TRENINGIEM

Po uploadsie wszystkich dokumentów:
1. **View Label Stats** - powinno pokazać:
   ```
   zaswiadczenie_o_podatku_od_spadkow_i_darowizn: ~10 dokumentów
   zaswiadczenie_o_rewitalizacji: ~10 dokumentów
   odpis_skrocony_aktu_urodzenia: ~10 dokumentów
   wypis_z_rejestru_gruntow: ~10 dokumentów
   
   Total: ~40 dokumentów
   ```

2. **Sprawdź balans** - każda klasa powinna mieć podobną liczbę dokumentów

---

## ⚠️ NAJCZĘSTSZE BŁĘDY

### **Problem: Błędne labelowanie**
**Rozwiązanie:** Sprawdź czy nazwa klasy dokładnie odpowiada nazwie w schemacie

### **Problem: Niskie quality score**
**Rozwiązanie:** Usuń nieczytelne dokumenty, dodaj lepszej jakości przykłady

### **Problem: Niezbalansowane klasy**
**Rozwiązanie:** Dodaj więcej dokumentów do klas z mniejszą reprezentacją 