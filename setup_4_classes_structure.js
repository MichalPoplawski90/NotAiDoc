const fs = require('fs');
const path = require('path');

// 4 klasy dokumentów do trenowania
const documentClasses = {
    'zaswiadczenie_o_podatku_od_spadkow_i_darowizn': {
        folderName: 'zaswiadczenie_podatek_spadki_darowizny',
        description: 'Zaświadczenie o podatku od spadków i darowizn',
        examples: [
            'zaswiadczenie_podatek_spadek_001.pdf',
            'zaswiadczenie_podatek_darowizna_002.pdf',
            'zaswiadczenie_spadki_podatek_003.pdf'
        ]
    },
    'zaswiadczenie_o_rewitalizacji': {
        folderName: 'zaswiadczenie_rewitalizacja', 
        description: 'Zaświadczenie o rewitalizacji',
        examples: [
            'zaswiadczenie_rewitalizacja_001.pdf',
            'zaswiadczenie_rewitalizacja_002.pdf',
            'zaswiadczenie_rewitalizacja_003.pdf'
        ]
    },
    'odpis_skrocony_aktu_urodzenia': {
        folderName: 'odpis_skrocony_akt_urodzenia',
        description: 'Odpis skrócony aktu urodzenia',
        examples: [
            'odpis_skrocony_urodzenie_001.pdf',
            'odpis_skrocony_urodzenie_002.pdf', 
            'odpis_skrocony_urodzenie_003.pdf'
        ]
    },
    'wypis_z_rejestru_gruntow': {
        folderName: 'wypis_rejestr_gruntow',
        description: 'Wypis z rejestru gruntów',
        examples: [
            'wypis_rejestr_gruntow_001.pdf',
            'wypis_rejestr_gruntow_002.pdf',
            'wypis_rejestr_gruntow_003.pdf'
        ]
    }
};

function createTrainingStructure() {
    console.log('📁 TWORZENIE STRUKTURY FOLDERÓW DLA 4 KLAS DOKUMENTÓW');
    console.log('====================================================');

    const baseDir = './training_data';
    
    // Utwórz główny folder training_data
    if (!fs.existsSync(baseDir)) {
        fs.mkdirSync(baseDir);
        console.log(`✅ Utworzono folder: ${baseDir}`);
    }

    // Utwórz README w głównym folderze
    const readmeContent = `# Training Data - 4 Klasy Dokumentów

## Struktura folderów:

${Object.entries(documentClasses).map(([className, config]) => 
`### ${config.folderName}/
- **Klasa:** ${className}
- **Opis:** ${config.description}
- **Minimalne wymagania:** 10+ dokumentów PDF
- **Optymalne:** 20-30 dokumentów PDF
- **Format:** PDF, JPG, PNG
- **Jakość:** Czytelne, wysokiej rozdzielczości`
).join('\n\n')}

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
`;

    fs.writeFileSync(path.join(baseDir, 'README.md'), readmeContent);
    console.log(`✅ Utworzono: ${path.join(baseDir, 'README.md')}`);

    // Utwórz foldery dla każdej klasy
    Object.entries(documentClasses).forEach(([className, config]) => {
        const folderPath = path.join(baseDir, config.folderName);
        
        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath);
            console.log(`✅ Utworzono folder: ${folderPath}`);
        }

        // Utwórz README dla każdej klasy
        const classReadme = `# ${config.description}

**Klasa Document AI:** \`${className}\`

## Wymagania:

- **Minimum:** 10 dokumentów tego typu
- **Optymalne:** 20-30 dokumentów
- **Format:** PDF (preferowany), JPG, PNG
- **Jakość:** Czytelne skanowanie/zdjęcie
- **Rozdzielczość:** Minimum 300 DPI dla skanów

## Przykłady nazw plików:

${config.examples.map(example => `- ${example}`).join('\n')}

## Uwagi:

- Dokumenty muszą być prawdziwe (nie symulacje)
- Różnorodność formatów i układów jest pomocna
- Upewnij się że tekst jest czytelny
- Usuń dokumenty uszkodzone lub nieczytelne

## Status:

- [ ] Zebrano dokumenty (minimum 10)
- [ ] Sprawdzono jakość
- [ ] Zaimportowano do Google Cloud
- [ ] Oznaczono (labeled) dokumenty
- [ ] Gotowe do treningu
`;

        fs.writeFileSync(path.join(folderPath, 'README.md'), classReadme);
        console.log(`✅ Utworzono: ${path.join(folderPath, 'README.md')}`);

        // Utwórz przykładowy plik .gitkeep
        fs.writeFileSync(path.join(folderPath, '.gitkeep'), '');
    });

    console.log('\n🎯 NASTĘPNE KROKI:');
    console.log('1. Umieść dokumenty w odpowiednich folderach');
    console.log('2. Sprawdź czy każdy folder ma minimum 10 dokumentów');
    console.log('3. Przejdź do Google Cloud Console');
    console.log('4. Zaimportuj dokumenty z każdego folderu');
    console.log('5. Przypisz odpowiednie klasy podczas importu');
    console.log('6. Wytrenuj model');

    console.log('\n📊 CELE TRENINGU:');
    console.log('✅ F1 Score > 85% dla każdej klasy');
    console.log('✅ Balanced performance (bez faworyzowania)');
    console.log('✅ Praktyczne rozpoznawanie dokumentów notarialnych');

    console.log('\n📂 UTWORZONA STRUKTURA:');
    console.log('training_data/');
    Object.values(documentClasses).forEach(config => {
        console.log(`├── ${config.folderName}/`);
        console.log(`│   ├── README.md`);
        console.log(`│   └── .gitkeep`);
    });
    console.log('└── README.md');
}

// Funkcja do sprawdzenia statusu dokumentów
function checkDocumentStatus() {
    console.log('\n🔍 SPRAWDZANIE STATUSU DOKUMENTÓW');
    console.log('==================================');

    const baseDir = './training_data';
    
    if (!fs.existsSync(baseDir)) {
        console.log('❌ Folder training_data nie istnieje. Uruchom najpierw createTrainingStructure()');
        return;
    }

    let totalDocuments = 0;
    let readyClasses = 0;

    Object.entries(documentClasses).forEach(([className, config]) => {
        const folderPath = path.join(baseDir, config.folderName);
        
        if (fs.existsSync(folderPath)) {
            const files = fs.readdirSync(folderPath)
                .filter(file => file.toLowerCase().match(/\.(pdf|jpg|jpeg|png)$/));
            
            console.log(`📁 ${config.folderName}: ${files.length} dokumentów`);
            
            if (files.length >= 10) {
                console.log(`   ✅ Gotowe do treningu (${files.length} >= 10)`);
                readyClasses++;
            } else if (files.length > 0) {
                console.log(`   ⚠️  Potrzeba więcej dokumentów (${files.length} < 10)`);
            } else {
                console.log(`   ❌ Brak dokumentów`);
            }
            
            totalDocuments += files.length;
        } else {
            console.log(`📁 ${config.folderName}: Folder nie istnieje`);
        }
    });

    console.log(`\n📊 PODSUMOWANIE:`);
    console.log(`Łączna liczba dokumentów: ${totalDocuments}`);
    console.log(`Gotowe klasy: ${readyClasses}/4`);
    console.log(`Minimalne wymaganie: ${4 * 10} dokumentów (40 total)`);
    console.log(`Optymalne: ${4 * 25} dokumentów (100 total)`);

    if (readyClasses === 4) {
        console.log('\n🎉 WSZYSTKIE KLASY GOTOWE DO TRENINGU!');
        console.log('Możesz rozpocząć import w Google Cloud Console');
    } else {
        console.log(`\n⏳ Potrzebujesz więcej dokumentów dla ${4 - readyClasses} klas`);
    }
}

// Eksportuj funkcje
module.exports = {
    createTrainingStructure,
    checkDocumentStatus,
    documentClasses
};

// Uruchom jeśli wywoływane bezpośrednio
if (require.main === module) {
    createTrainingStructure();
    checkDocumentStatus();
} 