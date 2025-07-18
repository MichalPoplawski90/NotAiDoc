# Training Data - 4 Klasy Dokumentów

## Struktura folderów:

### zaswiadczenie_podatek_spadki_darowizny/
- **Klasa:** zaswiadczenie_o_podatku_od_spadkow_i_darowizn
- **Opis:** Zaświadczenie o podatku od spadków i darowizn
- **Minimalne wymagania:** 10+ dokumentów PDF
- **Optymalne:** 20-30 dokumentów PDF
- **Format:** PDF, JPG, PNG
- **Jakość:** Czytelne, wysokiej rozdzielczości

### zaswiadczenie_rewitalizacja/
- **Klasa:** zaswiadczenie_o_rewitalizacji
- **Opis:** Zaświadczenie o rewitalizacji
- **Minimalne wymagania:** 10+ dokumentów PDF
- **Optymalne:** 20-30 dokumentów PDF
- **Format:** PDF, JPG, PNG
- **Jakość:** Czytelne, wysokiej rozdzielczości

### odpis_skrocony_akt_urodzenia/
- **Klasa:** odpis_skrocony_aktu_urodzenia
- **Opis:** Odpis skrócony aktu urodzenia
- **Minimalne wymagania:** 10+ dokumentów PDF
- **Optymalne:** 20-30 dokumentów PDF
- **Format:** PDF, JPG, PNG
- **Jakość:** Czytelne, wysokiej rozdzielczości

### wypis_rejestr_gruntow/
- **Klasa:** wypis_z_rejestru_gruntow
- **Opis:** Wypis z rejestru gruntów
- **Minimalne wymagania:** 10+ dokumentów PDF
- **Optymalne:** 20-30 dokumentów PDF
- **Format:** PDF, JPG, PNG
- **Jakość:** Czytelne, wysokiej rozdzielczości

## Instrukcje:

1. **Umieść dokumenty** w odpowiednich folderach
2. **Nazwy plików:** Używaj opisowych nazw (np. zaswiadczenie_podatek_001.pdf)
3. **Jakość:** Upewnij się że dokumenty są czytelne
4. **Format:** Preferowany PDF, akceptowane JPG/PNG
5. **Ilość:** Minimum 10 dokumentów na klasę

## Import do Google Cloud:

Po umieszczeniu dokumentów:
1. Przejdź do Google Cloud Console
2. Document AI → NotAI-Universal-Document-Classifier 
3. Train → Import documents from Cloud Storage
4. Wybierz folder i przypisz odpowiednią klasę

## Cel treningu:

🎯 **F1 Score > 85%** dla każdej z 4 klas
🎯 **Balanced accuracy** - równomierne rozpoznawanie wszystkich typów
🎯 **Real-world performance** na rzeczywistych dokumentach notarialnych
