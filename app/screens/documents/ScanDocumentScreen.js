import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, Alert } from 'react-native';
import { Text, Button, ActivityIndicator, useTheme } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';

const ScanDocumentScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const theme = useTheme();

  // Ten ekran będzie wykorzystywał kamerę do skanowania dokumentów
  // Tymczasowo możemy utworzyć prosty placeholder

  const handleScan = () => {
    setLoading(true);
    
    // Symulacja skanowania
    setTimeout(() => {
      setLoading(false);
      Alert.alert(
        'Dokument zeskanowany',
        'Dokument został pomyślnie zeskanowany i rozpoznany jako "Akt notarialny"',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('DocumentDetails')
          }
        ]
      );
    }, 2000);
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Przetwarzanie dokumentu...</Text>
        </View>
      ) : (
        <>
          <View style={styles.previewContainer}>
            <View style={styles.cameraPlaceholder}>
              <MaterialIcons name="camera-alt" size={64} color="#aaa" />
              <Text style={styles.placeholderText}>Podgląd kamery</Text>
            </View>
          </View>

          <View style={styles.instructionsContainer}>
            <Text style={styles.instructionsTitle}>Instrukcje skanowania:</Text>
            <Text style={styles.instructionsText}>
              1. Umieść dokument na płaskiej powierzchni{'\n'}
              2. Upewnij się, że całość dokumentu jest widoczna{'\n'}
              3. Upewnij się, że oświetlenie jest dobre{'\n'}
              4. Trzymaj telefon stabilnie podczas skanowania
            </Text>
          </View>

          <View style={styles.buttonsContainer}>
            <Button
              mode="contained"
              onPress={handleScan}
              style={styles.scanButton}
              icon="camera"
            >
              Zeskanuj dokument
            </Button>
            
            <Button
              mode="outlined"
              onPress={() => navigation.goBack()}
              style={styles.cancelButton}
            >
              Anuluj
            </Button>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  previewContainer: {
    flex: 3,
    margin: 16,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraPlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#222',
  },
  placeholderText: {
    color: '#aaa',
    marginTop: 16,
  },
  instructionsContainer: {
    flex: 1,
    padding: 16,
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  instructionsText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#555',
  },
  buttonsContainer: {
    padding: 16,
  },
  scanButton: {
    marginBottom: 12,
    paddingVertical: 8,
  },
  cancelButton: {
    paddingVertical: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
});

export default ScanDocumentScreen; 