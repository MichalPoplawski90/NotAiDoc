import * as FileSystem from 'expo-file-system';
import supabase from '../utils/supabase';
import { EXPO_PUBLIC_API_URL } from '@env';

export async function uploadDocumentImage(imageUri, caseId) {
  const fileName = `document_${Date.now()}.jpg`;
  const filePath = `${caseId || 'default'}/${fileName}`;
  // Odczytaj plik jako base64
  const fileBase64 = await FileSystem.readAsStringAsync(imageUri, { encoding: FileSystem.EncodingType.Base64 });
  // Zamień base64 na Uint8Array
  const byteArray = Uint8Array.from(atob(fileBase64), c => c.charCodeAt(0));
  // Upload do Supabase Storage
  const { data, error } = await supabase.storage
    .from('documents')
    .upload(filePath, byteArray, { contentType: 'image/jpeg' });
  if (error) throw error;
  return data;
}

export async function processDocumentOnBackend(filePath, caseId) {
  const API_URL = EXPO_PUBLIC_API_URL;
  const response = await fetch(`${API_URL}/api/ocr/process`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      storage_path: filePath,
      case_id: caseId,
    }),
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || 'Błąd backendu');
  }
  return await response.json();
} 

/**
 * Pobiera wszystkie dokumenty dla zalogowanego użytkownika
 */
export async function getDocuments(caseId = null) {
  try {
    const user = supabase.auth.user();
    
    if (!user) {
      throw new Error('Użytkownik nie jest zalogowany');
    }

    let query = supabase
      .from('documents')
      .select(`
        *,
        cases(title),
        document_types(name)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    // Filtruj po sprawie jeśli podano caseId
    if (caseId) {
      query = query.eq('case_id', caseId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Błąd pobierania dokumentów:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('getDocuments error:', error);
    throw error;
  }
}

/**
 * Tworzy nowy dokument w bazie danych
 */
export async function createDocument({ 
  caseId, 
  documentTypeId, 
  originalFilename, 
  scanFilePath,
  autoRecognized = false,
  recognitionConfidence = null
}) {
  try {
    console.log('🔍 createDocument - parametry:', { 
      caseId, 
      documentTypeId, 
      originalFilename, 
      scanFilePath,
      autoRecognized,
      recognitionConfidence
    });
    
    const user = supabase.auth.user();
    console.log('👤 Aktualny użytkownik:', user ? { id: user.id, email: user.email } : 'BRAK');
    
    if (!user) {
      throw new Error('Użytkownik nie jest zalogowany');
    }

    // Sprawdź czy sprawa istnieje i należy do użytkownika
    console.log('🔍 Sprawdzanie sprawy...');
    const { data: caseData, error: caseError } = await supabase
      .from('cases')
      .select('id, title, user_id')
      .eq('id', caseId)
      .eq('user_id', user.id)
      .single();

    if (caseError) {
      console.error('❌ Błąd sprawdzania sprawy:', caseError);
      throw new Error(`Nie można znaleźć sprawy: ${caseError.message}`);
    }

    if (!caseData) {
      throw new Error('Sprawa nie istnieje lub nie masz do niej dostępu');
    }

    console.log('✅ Sprawa znaleziona:', caseData);

    const documentData = {
      case_id: caseId,
      document_type_id: documentTypeId,
      original_filename: originalFilename,
      scan_file_path: scanFilePath,
      user_id: user.id,
      processed: false,
      auto_recognized: autoRecognized,
      recognition_confidence: recognitionConfidence,
    };

    console.log('📝 Dane dokumentu do zapisu:', documentData);

    const { data, error } = await supabase
      .from('documents')
      .insert([documentData])
      .select(`
        *,
        cases(title),
        document_types(name)
      `)
      .single();

    if (error) {
      console.error('❌ Błąd tworzenia dokumentu:', error);
      throw error;
    }

    console.log('✅ Dokument utworzony:', data);
    return data;
  } catch (error) {
    console.error('createDocument error:', error);
    throw error;
  }
}

/**
 * Aktualizuje dokument
 */
export async function updateDocument(documentId, updates) {
  try {
    const user = supabase.auth.user();
    
    if (!user) {
      throw new Error('Użytkownik nie jest zalogowany');
    }

    const { data, error } = await supabase
      .from('documents')
      .update(updates)
      .eq('id', documentId)
      .eq('user_id', user.id)
      .select(`
        *,
        cases(title),
        document_types(name)
      `)
      .single();

    if (error) {
      console.error('Błąd aktualizacji dokumentu:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('updateDocument error:', error);
    throw error;
  }
}

/**
 * Usuwa dokument
 */
export async function deleteDocument(documentId) {
  try {
    const user = supabase.auth.user();
    
    if (!user) {
      throw new Error('Użytkownik nie jest zalogowany');
    }

    // Pobierz informacje o dokumencie przed usunięciem
    const { data: document } = await supabase
      .from('documents')
      .select('scan_file_path')
      .eq('id', documentId)
      .eq('user_id', user.id)
      .single();

    // Usuń plik fizyczny jeśli istnieje
    if (document?.scan_file_path) {
      try {
        await FileSystem.deleteAsync(document.scan_file_path);
      } catch (fileError) {
        console.warn('Nie udało się usunąć pliku:', fileError);
      }
    }

    // Usuń rekord z bazy danych
    const { error } = await supabase
      .from('documents')
      .delete()
      .eq('id', documentId)
      .eq('user_id', user.id);

    if (error) {
      console.error('Błąd usuwania dokumentu:', error);
      throw error;
    }

    console.log('✅ Dokument usunięty:', documentId);
    return true;
  } catch (error) {
    console.error('deleteDocument error:', error);
    throw error;
  }
}

/**
 * Zapisuje plik dokumentu lokalnie
 */
export async function saveDocumentFile(uri, filename) {
  try {
    // Utwórz katalog dokumentów jeśli nie istnieje
    const documentsDir = `${FileSystem.documentDirectory}documents/`;
    await FileSystem.makeDirectoryAsync(documentsDir, { intermediates: true });

    // Unikalna nazwa pliku z timestamp
    const timestamp = new Date().getTime();
    const extension = filename.split('.').pop() || 'jpg';
    const uniqueFilename = `${timestamp}_${filename.replace(/[^a-zA-Z0-9.-]/g, '_')}.${extension}`;
    const localPath = `${documentsDir}${uniqueFilename}`;

    // Kopiuj plik
    await FileSystem.copyAsync({
      from: uri,
      to: localPath,
    });

    console.log('✅ Plik zapisany:', localPath);
    return localPath;
  } catch (error) {
    console.error('saveDocumentFile error:', error);
    throw error;
  }
}

/**
 * Pobiera typy dokumentów
 */
export async function getDocumentTypes() {
  try {
    const { data, error } = await supabase
      .from('document_types')
      .select('*')
      .order('name');

    if (error) {
      console.error('Błąd pobierania typów dokumentów:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('getDocumentTypes error:', error);
    throw error;
  }
}

/**
 * OCR Processing (placeholder - będzie rozszerzone)
 */
export async function processDocumentOCR(documentId) {
  try {
    console.log('🔄 Rozpoczęcie OCR dla dokumentu:', documentId);
    
    // TODO: Implementacja prawdziwego OCR
    // 1. Pobierz plik dokumentu
    // 2. Wyślij do OCR service (Google Vision, Tesseract)
    // 3. Zapisz wynik w tabeli extracted_data
    // 4. Zaktualizuj dokument jako processed: true
    
    // Tymczasowa symulacja
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Zaktualizuj status na przetworzony
    await updateDocument(documentId, { processed: true });
    
    console.log('✅ OCR zakończone dla dokumentu:', documentId);
    return { success: true, extractedText: 'Przykładowy tekst z OCR...' };
  } catch (error) {
    console.error('processDocumentOCR error:', error);
    throw error;
  }
}

/**
 * Rozpoznaje typ dokumentu na podstawie zeskanowanego obrazu
 * TODO: Implementacja AI/ML do rozpoznawania typu dokumentu
 */
export async function recognizeDocumentType(imageUri) {
  try {
    console.log('🔍 Rozpoznawanie typu dokumentu dla:', imageUri);
    
    // Pobierz dostępne typy dokumentów
    const documentTypes = await getDocumentTypes();
    
    if (documentTypes.length === 0) {
      return null;
    }

    // PLACEHOLDER: Na razie zwracamy losowy typ
    // W przyszłości tutaj będzie AI/ML do rozpoznawania typu
    const randomIndex = Math.floor(Math.random() * documentTypes.length);
    const recognizedType = documentTypes[randomIndex];
    
    // Symulujemy pewność rozpoznania (0-100%)
    const confidence = Math.floor(Math.random() * 40) + 60; // 60-100%
    
    console.log('🎯 Rozpoznany typ:', recognizedType.name, 'z pewnością:', confidence + '%');
    
    return {
      type: recognizedType,
      confidence: confidence,
      isAutoRecognized: true
    };
  } catch (error) {
    console.error('Błąd rozpoznawania typu dokumentu:', error);
    return null;
  }
} 