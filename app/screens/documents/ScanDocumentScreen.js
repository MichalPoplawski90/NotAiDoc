import React, { useState } from 'react';
import { View, Image, StyleSheet, Alert } from 'react-native';
import { Button, Text, ActivityIndicator } from 'react-native-paper';
import DocumentScanner from '../../components/DocumentScanner';
import { uploadDocumentImage, processDocumentOnBackend } from '../../api/documents';

export default function ScanDocumentScreen() {
  const [imageUri, setImageUri] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleScanComplete = (uri) => setImageUri(uri);

  const handleUpload = async () => {
    setUploading(true);
    setError(null);
    try {
      // Upload do Supabase
      const uploadResult = await uploadDocumentImage(imageUri, 'test-case');
      // Wywołanie backendu (OCR/analiza)
      await processDocumentOnBackend(uploadResult.path, 'test-case');
      Alert.alert('Sukces', 'Dokument przesłany i przekazany do analizy!');
      setImageUri(null);
    } catch (e) {
      setError('Błąd przesyłania lub analizy dokumentu');
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      {!imageUri ? (
        <DocumentScanner onScanComplete={handleScanComplete} />
      ) : (
        <>
          <Image source={{ uri: imageUri }} style={styles.preview} />
          {error && <Text style={styles.error}>{error}</Text>}
          {uploading ? (
            <ActivityIndicator style={{ margin: 16 }} />
          ) : (
            <>
              <Button mode="contained" onPress={handleUpload} style={styles.button}>
                Prześlij dokument
              </Button>
              <Button onPress={() => setImageUri(null)} style={styles.button}>
                Skanuj ponownie
              </Button>
            </>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  preview: { width: '100%', height: 400, marginVertical: 20, borderRadius: 8 },
  button: { marginHorizontal: 16, marginBottom: 16 },
  error: { color: 'red', textAlign: 'center', marginBottom: 8 },
}); 