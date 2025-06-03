import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';

export default function DocumentScanner({ onScanComplete }) {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!permission) {
    // Camera permissions are still loading
    return <View style={styles.container}><Text style={styles.text}>Ładowanie uprawnień...</Text></View>;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View style={styles.container}>
        <Text style={[styles.text, styles.errorText]}>Brak dostępu do kamery.</Text>
        <Text style={styles.text}>Aplikacja wymaga dostępu do kamery, aby skanować dokumenty.</Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
          <Text style={styles.permissionButtonText}>Udziel uprawnienia</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const takePicture = async () => {
    if (cameraRef.current && !isProcessing) {
      try {
        setIsProcessing(true);
        
        // Zrób zdjęcie używając nowego API
        const photo = await cameraRef.current.takePictureAsync({
          quality: 1,
          skipProcessing: false,
        });
        
        // Przetwórz zdjęcie, np. popraw kontrast dla lepszego OCR
        const processedImage = await manipulateAsync(
          photo.uri,
          [
            { resize: { width: 2000 } },
            { contrast: 1.2 },
          ],
          { compress: 0.9, format: SaveFormat.JPEG }
        );
        
        // Przekaż URI przetworzonego zdjęcia do komponentu nadrzędnego
        onScanComplete(processedImage.uri);
        
      } catch (error) {
        console.error("Błąd podczas skanowania:", error);
        Alert.alert("Błąd", "Wystąpił problem podczas skanowania dokumentu.");
      } finally {
        setIsProcessing(false);
      }
    }
  };

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing="back"
        mode="picture"
      >
        <View style={styles.overlay}>
          {/* Ramka pomocnicza do pozycjonowania dokumentu */}
          <View style={styles.documentFrame} />
          
          {/* Informacja dla użytkownika */}
          <Text style={styles.instruction}>
            Umieść dokument w ramce i zrób zdjęcie
          </Text>
          
          {/* Przycisk do robienia zdjęcia */}
          <TouchableOpacity 
            style={styles.captureButton} 
            onPress={takePicture}
            disabled={isProcessing}
          >
            <Text style={styles.captureButtonText}>
              {isProcessing ? "Przetwarzanie..." : "Skanuj"}
            </Text>
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    margin: 10,
  },
  camera: {
    flex: 1,
    width: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  documentFrame: {
    width: '90%',
    height: '70%',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 10,
    marginTop: 50,
  },
  instruction: {
    color: 'white',
    fontSize: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 10,
    borderRadius: 5,
    position: 'absolute',
    top: 20,
    textAlign: 'center',
  },
  captureButton: {
    backgroundColor: '#2196F3',
    borderRadius: 50,
    padding: 15,
    width: 150,
    alignItems: 'center',
    marginBottom: 30,
  },
  captureButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    fontSize: 18,
    marginBottom: 10,
  },
  permissionButton: {
    backgroundColor: '#2196F3',
    borderRadius: 8,
    padding: 12,
    marginTop: 20,
  },
  permissionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 