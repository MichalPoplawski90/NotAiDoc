const { DocumentProcessorServiceClient } = require('@google-cloud/documentai');

async function checkProcessors() {
    const client = new DocumentProcessorServiceClient({
        keyFilename: './credentials/google-service-account.json'
    });

    try {
        const parent = 'projects/notai-doc-ocr/locations/us';
        console.log('🔍 Sprawdzanie dostępu do Document AI...');
        console.log(`📍 Projekt: ${parent}`);
        
        const [processors] = await client.listProcessors({ parent });
        
        console.log('✅ Dostęp do Document AI OK');
        console.log(`📋 Znaleziono ${processors.length} procesorów:`);
        
        processors.forEach(p => {
            console.log(`  - ${p.displayName} (${p.type})`);
            console.log(`    ID: ${p.name.split('/').pop()}`);
            console.log(`    Stan: ${p.state}`);
            console.log('');
        });
        
        // Sprawdź czy mamy już Custom Classifier
        const classifier = processors.find(p => p.type === 'CUSTOM_CLASSIFICATION_PROCESSOR');
        if (classifier) {
            console.log('🎯 Znaleziono Custom Classifier:');
            console.log(`   Nazwa: ${classifier.displayName}`);
            console.log(`   ID: ${classifier.name.split('/').pop()}`);
        } else {
            console.log('ℹ️  Brak Custom Classifier - trzeba utworzyć przez Console');
        }
        
    } catch (error) {
        console.error('❌ Błąd dostępu do Document AI:', error.message);
        
        if (error.message.includes('PERMISSION_DENIED')) {
            console.log('\n💡 ROZWIĄZANIE:');
            console.log('1. Przejdź do Google Cloud Console');
            console.log('2. IAM & Admin → Service Accounts');
            console.log('3. Znajdź: notai-doc-service@notai-doc-ocr.iam.gserviceaccount.com');
            console.log('4. Dodaj rolę: Document AI Editor');
        }
    }
}

checkProcessors(); 