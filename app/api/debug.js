import supabase from '../utils/supabase';

/**
 * Sprawdza połączenie z bazą danych i strukturę tabel
 */
export async function debugDatabaseConnection() {
  try {
    console.log('🔍 Sprawdzanie połączenia z bazą danych...');
    
    // 1. Sprawdź użytkownika
    const user = supabase.auth.user();
    console.log('👤 Użytkownik:', user ? { id: user.id, email: user.email } : 'BRAK');
    
    // 2. Sprawdź tabele
    console.log('📋 Sprawdzanie tabel...');
    
    // Sprawdź users
    const { data: usersData, error: usersError } = await supabase
      .from('users')
      .select('count')
      .limit(1);
    console.log('👥 Tabela users:', usersError ? `BŁĄD: ${usersError.message}` : 'OK');
    
    // Sprawdź cases
    const { data: casesData, error: casesError } = await supabase
      .from('cases')
      .select('count')
      .limit(1);
    console.log('📁 Tabela cases:', casesError ? `BŁĄD: ${casesError.message}` : 'OK');
    
    // Sprawdź documents
    const { data: documentsData, error: documentsError } = await supabase
      .from('documents')
      .select('count')
      .limit(1);
    console.log('📄 Tabela documents:', documentsError ? `BŁĄD: ${documentsError.message}` : 'OK');
    
    // Sprawdź document_types
    const { data: typesData, error: typesError } = await supabase
      .from('document_types')
      .select('*')
      .limit(5);
    console.log('📝 Tabela document_types:', typesError ? `BŁĄD: ${typesError.message}` : `OK (${typesData?.length || 0} typów)`);
    
    // 3. Sprawdź foreign key relationships
    if (user) {
      console.log('🔗 Sprawdzanie relacji...');
      
      // Sprawdź czy user istnieje w tabeli users
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('id', user.id)
        .single();
      console.log('👤 User w tabeli users:', userError ? `BŁĄD: ${userError.message}` : 'OK');
      
      // Sprawdź sprawy użytkownika
      const { data: userCases, error: userCasesError } = await supabase
        .from('cases')
        .select('id, title')
        .eq('user_id', user.id)
        .limit(3);
      console.log('📁 Sprawy użytkownika:', userCasesError ? `BŁĄD: ${userCasesError.message}` : `OK (${userCases?.length || 0} spraw)`);
    }
    
    return {
      success: true,
      user: user ? { id: user.id, email: user.email } : null,
      tables: {
        users: !usersError,
        cases: !casesError,
        documents: !documentsError,
        document_types: !typesError
      }
    };
    
  } catch (error) {
    console.error('❌ Błąd debugowania bazy danych:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Testuje tworzenie dokumentu z dodatkowymi logami
 */
export async function testCreateDocument(caseId) {
  try {
    console.log('🧪 Test tworzenia dokumentu...');
    
    const result = await debugDatabaseConnection();
    if (!result.success) {
      throw new Error(`Problem z bazą danych: ${result.error}`);
    }
    
    // Pobierz pierwszy typ dokumentu
    const { data: documentTypes, error: typesError } = await supabase
      .from('document_types')
      .select('*')
      .limit(1);
      
    if (typesError || !documentTypes?.length) {
      throw new Error('Brak typów dokumentów w bazie');
    }
    
    const testData = {
      caseId: caseId,
      documentTypeId: documentTypes[0].id,
      originalFilename: 'test_document.jpg',
      scanFilePath: '/test/path/test_document.jpg'
    };
    
    console.log('📝 Dane testowe:', testData);
    
    // Próba utworzenia dokumentu
    const { createDocument } = await import('./documents');
    const document = await createDocument(testData);
    
    console.log('✅ Test zakończony sukcesem:', document);
    return document;
    
  } catch (error) {
    console.error('❌ Test nie powiódł się:', error);
    throw error;
  }
} 