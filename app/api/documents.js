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