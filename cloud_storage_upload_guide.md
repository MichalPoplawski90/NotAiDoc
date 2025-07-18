# BACKUP: Upload przez Cloud Storage

## 🗂️ JEŚLI BRAK OPCJI DIRECT UPLOAD

### KROK 1: Utwórz Cloud Storage Bucket
1. Przejdź do Cloud Storage w Google Cloud Console
2. "Create Bucket" → nazwa: `notai-training-documents`
3. Lokalizacja: Europe (zgodnie z processorem)

### KROK 2: Struktura folderów w bucket
```
notai-training-documents/
├── zaswiadczenie_podatek_spadki_darowizny/
├── zaswiadczenie_rewitalizacja/
├── odpis_skrocony_akt_urodzenia/
└── wypis_rejestr_gruntow/
```

### KROK 3: Upload dokumentów do Cloud Storage
- Prześlij wszystkie pliki z `training_data/` do odpowiednich folderów w bucket

### KROK 4: Import z Cloud Storage do Document AI
1. W Document AI: "IMPORTUJ DOKUMENTY"
2. "Import from Cloud Storage"
3. Wskaż ścieżkę: `gs://notai-training-documents/nazwa_folderu/`
4. Assign labels zgodnie z klasami 