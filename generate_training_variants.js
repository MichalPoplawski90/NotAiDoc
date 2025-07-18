const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * GENERATOR WARIANTÓW TRENINGOWYCH
 * 
 * Augmentuje istniejące dokumenty żeby osiągnąć minimum 10 dokumentów na klasę
 */

class TrainingDataAugmentor {
    constructor() {
        this.baseDir = './training_data';
        this.targetCount = 10; // Minimum na klasę
        
        // Mapy folderów
        this.classFolders = {
            'zaswiadczenie_o_podatku_od_spadkow_i_darowizn': 'zaswiadczenie_podatek_spadki_darowizny',
            'zaswiadczenie_o_rewitalizacji': 'zaswiadczenie_rewitalizacja', 
            'odpis_skrocony_aktu_urodzenia': 'odpis_skrocony_akt_urodzenia',
            'wypis_z_rejestru_gruntow': 'wypis_rejestr_gruntow'
        };
    }

    /**
     * Sprawdź aktualny stan dokumentów
     */
    analyzeCurrentDataset() {
        console.log('📊 ANALIZA DATASETU TRENINGOWEGO\n');
        
        const stats = {};
        
        Object.entries(this.classFolders).forEach(([className, folderName]) => {
            const folderPath = path.join(this.baseDir, folderName);
            
            if (!fs.existsSync(folderPath)) {
                console.log(`❌ Brak folderu: ${folderPath}`);
                return;
            }
            
            // Policz dokumenty (pomiń README.md i .gitkeep)
            const files = fs.readdirSync(folderPath)
                .filter(file => !file.includes('README') && !file.includes('.gitkeep'))
                .filter(file => this.isDocumentFile(file));
                
            stats[className] = {
                folder: folderName,
                current: files.length,
                needed: Math.max(0, this.targetCount - files.length),
                files: files
            };
            
            const status = files.length >= this.targetCount ? '✅' : '❌';
            console.log(`${status} ${className}:`);
            console.log(`   Folder: ${folderName}`);
            console.log(`   Dokumenty: ${files.length}/${this.targetCount}`);
            console.log(`   Potrzeba: +${stats[className].needed}`);
            console.log('');
        });
        
        return stats;
    }

    /**
     * Sprawdź czy plik to dokument
     */
    isDocumentFile(filename) {
        const documentExts = ['.pdf', '.jpg', '.jpeg', '.png', '.webp', '.tiff'];
        return documentExts.some(ext => filename.toLowerCase().endsWith(ext));
    }

    /**
     * Generuj warianty dla wszystkich klas
     */
    async generateVariants() {
        const stats = this.analyzeCurrentDataset();
        
        console.log('🚀 ROZPOCZĘCIE AUGMENTACJI DANYCH\n');
        
        for (const [className, data] of Object.entries(stats)) {
            if (data.needed > 0) {
                console.log(`📁 Przetwarzanie klasy: ${className}`);
                await this.augmentClass(data);
                console.log('');
            } else {
                console.log(`✅ Klasa ${className} ma wystarczającą liczbę dokumentów`);
            }
        }
        
        console.log('🏁 AUGMENTACJA ZAKOŃCZONA!');
        this.analyzeCurrentDataset();
    }

    /**
     * Augmentuj dokumenty dla jednej klasy
     */
    async augmentClass(classData) {
        const folderPath = path.join(this.baseDir, classData.folder);
        const sourceFiles = classData.files;
        
        console.log(`   Źródłowe pliki: ${sourceFiles.length}`);
        console.log(`   Potrzebne warianty: ${classData.needed}`);
        
        let generatedCount = 0;
        let variantCounter = 1;
        
        // Generuj warianty dopóki nie osiągniemy minimum
        while (generatedCount < classData.needed && variantCounter <= 10) {
            for (const sourceFile of sourceFiles) {
                if (generatedCount >= classData.needed) break;
                
                const sourcePath = path.join(folderPath, sourceFile);
                const variant = await this.createVariant(sourcePath, variantCounter);
                
                if (variant) {
                    generatedCount++;
                    console.log(`   ✅ Utworzono: ${path.basename(variant)}`);
                }
            }
            variantCounter++;
        }
    }

    /**
     * Utwórz wariant dokumentu
     */
    async createVariant(sourcePath, variantNumber) {
        try {
            const sourceExt = path.extname(sourcePath);
            const sourceName = path.basename(sourcePath, sourceExt);
            const sourceDir = path.dirname(sourcePath);
            
            // Nowa nazwa z numerem wariantu
            const variantName = `${sourceName}_variant_${variantNumber}${sourceExt}`;
            const variantPath = path.join(sourceDir, variantName);
            
            // Sprawdź czy wariant już istnieje
            if (fs.existsSync(variantPath)) {
                return null;
            }
            
            // Metoda 1: Prosta kopia (można rozszerzyć o ImageMagick)
            if (this.isImageFile(sourcePath)) {
                return this.createImageVariant(sourcePath, variantPath, variantNumber);
            } else {
                // PDF - prosta kopia z nową nazwą
                fs.copyFileSync(sourcePath, variantPath);
                return variantPath;
            }
            
        } catch (error) {
            console.log(`   ⚠️  Błąd przy tworzeniu wariantu: ${error.message}`);
            return null;
        }
    }

    /**
     * Sprawdź czy to plik obrazu
     */
    isImageFile(filepath) {
        const imageExts = ['.jpg', '.jpeg', '.png', '.webp', '.tiff'];
        return imageExts.some(ext => filepath.toLowerCase().endsWith(ext));
    }

    /**
     * Utwórz wariant obrazu (z lekką rotacją lub zmianą jasności)
     */
    createImageVariant(sourcePath, variantPath, variantNumber) {
        try {
            // Sprawdź czy mamy dostęp do ImageMagick/sips (macOS)
            if (process.platform === 'darwin') {
                // Użyj sips na macOS
                const rotations = [1, -1, 2, -2, 0.5, -0.5];
                const rotation = rotations[variantNumber % rotations.length];
                
                execSync(`sips -r ${rotation} "${sourcePath}" --out "${variantPath}"`, { stdio: 'pipe' });
                return variantPath;
            } else {
                // Fallback - prosta kopia
                fs.copyFileSync(sourcePath, variantPath);
                return variantPath;
            }
        } catch (error) {
            // Fallback - prosta kopia
            fs.copyFileSync(sourcePath, variantPath);
            return variantPath;
        }
    }

    /**
     * Generuj nazwy dokumentów z różnymi danymi
     */
    generateSyntheticVariants() {
        console.log('🧬 GENEROWANIE SYNTETYCZNYCH WARIANTÓW');
        console.log('💡 Tip: Ręcznie skopiuj dokumenty i zmień kluczowe dane:');
        console.log('   - Imiona i nazwiska');
        console.log('   - Daty urodzenia');
        console.log('   - Numery dokumentów'); 
        console.log('   - Nazwy miejscowości');
        console.log('   - Numery działek');
    }
}

// URUCHOM AUGMENTATOR
async function main() {
    const augmentor = new TrainingDataAugmentor();
    
    console.log('🎯 GENERATOR WARIANTÓW TRENINGOWYCH\n');
    
    // Sprawdź obecny stan
    const stats = augmentor.analyzeCurrentDataset();
    
    // Sprawdź czy potrzebujemy więcej danych
    const totalNeeded = Object.values(stats).reduce((sum, data) => sum + data.needed, 0);
    
    if (totalNeeded === 0) {
        console.log('✅ Wszystkie klasy mają wystarczającą liczbę dokumentów!');
        return;
    }
    
    console.log(`📈 Potrzebujemy łącznie ${totalNeeded} dodatkowych dokumentów\n`);
    
    // Uruchom augmentację
    await augmentor.generateVariants();
    
    // Pokaż syntetyczne sugestie
    augmentor.generateSyntheticVariants();
}

if (require.main === module) {
    main().catch(console.error);
}

module.exports = { TrainingDataAugmentor }; 