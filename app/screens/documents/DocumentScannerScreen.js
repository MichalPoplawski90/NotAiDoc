import React, { useState, useRef } from 'react';
import { View, StyleSheet, Alert, Dimensions } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { Text, Button, IconButton, useTheme, Card, ActivityIndicator } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';

// API
import { createDocument, saveDocumentFile, getDocumentTypes, processDocumentOCR, recognizeDocumentType } from '../../api/documents';
import { debugDatabaseConnection } from '../../api/debug';

const { width, height } = Dimensions.get('window');

// Stałe dla ramki skanowania
const FRAME_WIDTH_RATIO = 0.8;  // 80% szerokości ekranu
const FRAME_HEIGHT_RATIO = 0.6; // 60% wysokości ekranu

const DocumentScannerScreen = ({ route, navigation }) => {
  const theme = useTheme();
  const { caseData, importedImage, importedFilename } = route.params;
  
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState('back');
  const [isProcessing, setIsProcessing] = useState(false);
  const [documentTypes, setDocumentTypes] = useState([]);
  const cameraRef = useRef(null);

  // Załaduj typy dokumentów
  React.useEffect(() => {
    loadDocumentTypes();
    
    // Jeśli mamy importowany obraz, od razu go przetwórz
    if (importedImage && importedFilename) {
      setIsProcessing(true);
      processDocument(importedImage, importedFilename);
    }
  }, [importedImage, importedFilename]);

  const loadDocumentTypes = async () => {
    try {
      const types = await getDocumentTypes();
      setDocumentTypes(types);
    } catch (error) {
      console.error('Błąd ładowania typów dokumentów:', error);
    }
  };

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  // Funkcja do przycinania obrazu do obszaru ramki
  const cropImageToFrame = async (imageUri) => {
    try {
      console.log('✂️ Przycinanie obrazu do ramki...');
      
      // Pobierz informacje o obrazie
      const imageInfo = await ImageManipulator.manipulateAsync(
        imageUri,
        [],
        { format: ImageManipulator.SaveFormat.JPEG }
      );
      
      const imageWidth = imageInfo.width;
      const imageHeight = imageInfo.height;
      
      // Oblicz proporcje ekranu do obrazu
      const screenAspectRatio = width / height;
      const imageAspectRatio = imageWidth / imageHeight;
      
      let cropX, cropY, cropWidth, cropHeight;
      
      if (imageAspectRatio > screenAspectRatio) {
        // Obraz jest szerszy niż ekran - przytnij boki
        const scaledImageWidth = imageHeight * screenAspectRatio;
        const offsetX = (imageWidth - scaledImageWidth) / 2;
        
        cropWidth = scaledImageWidth * FRAME_WIDTH_RATIO;
        cropHeight = imageHeight * FRAME_HEIGHT_RATIO;
        cropX = offsetX + (scaledImageWidth - cropWidth) / 2;
        cropY = (imageHeight - cropHeight) / 2;
      } else {
        // Obraz jest wyższy niż ekran - przytnij góra/dół
        const scaledImageHeight = imageWidth / screenAspectRatio;
        const offsetY = (imageHeight - scaledImageHeight) / 2;
        
        cropWidth = imageWidth * FRAME_WIDTH_RATIO;
        cropHeight = scaledImageHeight * FRAME_HEIGHT_RATIO;
        cropX = (imageWidth - cropWidth) / 2;
        cropY = offsetY + (scaledImageHeight - cropHeight) / 2;
      }
      
      // Upewnij się, że współrzędne są w granicach obrazu
      cropX = Math.max(0, Math.min(cropX, imageWidth - cropWidth));
      cropY = Math.max(0, Math.min(cropY, imageHeight - cropHeight));
      cropWidth = Math.min(cropWidth, imageWidth - cropX);
      cropHeight = Math.min(cropHeight, imageHeight - cropY);
      
      console.log(`🔍 Crop parameters: x=${Math.round(cropX)}, y=${Math.round(cropY)}, w=${Math.round(cropWidth)}, h=${Math.round(cropHeight)}`);
      
      // Przytnij obraz
      const croppedImage = await ImageManipulator.manipulateAsync(
        imageUri,
        [
          {
            crop: {
              originX: cropX,
              originY: cropY,
              width: cropWidth,
              height: cropHeight,
            },
          },
        ],
        {
          compress: 0.8,
          format: ImageManipulator.SaveFormat.JPEG,
        }
      );
      
      console.log('✅ Obraz przycięty:', croppedImage.uri);
      return croppedImage.uri;
      
    } catch (error) {
      console.error('❌ Błąd przycinania obrazu:', error);
      // W przypadku błędu, zwróć oryginalny obraz
      return imageUri;
    }
  };

  const takePicture = async () => {
    if (!cameraRef.current) return;

    try {
      setIsProcessing(true);
      
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: false,
        skipProcessing: false,
      });

      console.log('📷 Zdjęcie zrobione:', photo.uri);
      
      // Przytnij zdjęcie do obszaru ramki
      const croppedImageUri = await cropImageToFrame(photo.uri);
      
      await processDocument(croppedImageUri, `foto_${Date.now()}.jpg`);
      
    } catch (error) {
      console.error('Błąd robienia zdjęcia:', error);
      Alert.alert('Błąd', 'Nie udało się zrobić zdjęcia');
    } finally {
      setIsProcessing(false);
    }
  };

  const pickImageFromGallery = async () => {
    try {
      setIsProcessing(true);

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        console.log('📁 Obraz wybrany z galerii:', asset.uri);
        
        // Dla obrazów z galerii, użytkownik już mógł je edytować w ImagePicker
        // ale możemy dodatkowo przyciąć do ramki jeśli potrzeba
        let finalImageUri = asset.uri;
        
        // Sprawdź czy obraz wymaga dodatkowego przycinania
        // (opcjonalnie - możesz to wyłączyć jeśli allowsEditing=true wystarczy)
        if (asset.width && asset.height) {
          const imageAspectRatio = asset.width / asset.height;
          const frameAspectRatio = FRAME_WIDTH_RATIO / FRAME_HEIGHT_RATIO;
          
          // Jeśli proporcje bardzo się różnią, przytnij dodatkowo
          if (Math.abs(imageAspectRatio - frameAspectRatio) > 0.3) {
            console.log('📐 Dodatkowe przycinanie obrazu z galerii...');
            finalImageUri = await cropImageToFrame(asset.uri);
          }
        }
        
        await processDocument(finalImageUri, asset.fileName || `import_${Date.now()}.jpg`);
      }
    } catch (error) {
      console.error('Błąd wyboru obrazu:', error);
      Alert.alert('Błąd', 'Nie udało się wybrać obrazu');
    } finally {
      setIsProcessing(false);
    }
  };

  const processDocument = async (imageUri, filename) => {
    try {
      // 1. Zapisz plik lokalnie
      console.log('💾 Zapisywanie pliku...');
      const localPath = await saveDocumentFile(imageUri, filename);

      // 2. Spróbuj rozpoznać typ dokumentu
      console.log('🤖 Rozpoznawanie typu dokumentu...');
      const recognitionResult = await recognizeDocumentType(imageUri);
      
      let selectedDocumentType;
      
      if (recognitionResult && recognitionResult.confidence > 70) {
        // Wysoka pewność - pokaż dialog z potwierdzeniem
        selectedDocumentType = await new Promise((resolve) => {
          Alert.alert(
            'Rozpoznano typ dokumentu',
            `Wykryto: ${recognitionResult.type.name}\nPewność: ${recognitionResult.confidence}%\n\nCzy to jest poprawny typ?`,
            [
              {
                text: 'Nie, wybiorę inny',
                onPress: async () => {
                  const chosenType = await new Promise(showDocumentTypeSelector);
                  resolve(chosenType);
                }
              },
              {
                text: 'Tak, to jest poprawne',
                onPress: () => {
                  resolve(recognitionResult.type);
                }
              }
            ]
          );
        });
      } else {
        // Niska pewność lub brak rozpoznania - pokaż selektor
        selectedDocumentType = await new Promise((resolve) => {
          if (recognitionResult) {
            Alert.alert(
              'Niepewne rozpoznanie',
              `Możliwy typ: ${recognitionResult.type.name}\nPewność: ${recognitionResult.confidence}%\n\nProszę wybrać właściwy typ dokumentu.`,
              [{ 
                text: 'OK', 
                onPress: async () => {
                  const chosenType = await new Promise(showDocumentTypeSelector);
                  resolve(chosenType);
                }
              }]
            );
          } else {
            Alert.alert(
              'Nie rozpoznano typu',
              'Nie udało się automatycznie rozpoznać typu dokumentu.\nProszę wybrać właściwy typ.',
              [{ 
                text: 'OK', 
                onPress: async () => {
                  const chosenType = await new Promise(showDocumentTypeSelector);
                  resolve(chosenType);
                }
              }]
            );
          }
        });
      }

      // Jeśli nie wybrano typu, użyj pierwszego dostępnego
      if (!selectedDocumentType) {
        selectedDocumentType = documentTypes[0];
      }

      // 3. Utwórz rekord dokumentu w bazie
      console.log('📝 Tworzenie rekordu dokumentu...');
      const document = await createDocument({
        caseId: caseData.id,
        documentTypeId: selectedDocumentType?.id,
        originalFilename: filename,
        scanFilePath: localPath,
        autoRecognized: recognitionResult?.isAutoRecognized || false,
        recognitionConfidence: recognitionResult?.confidence || null,
      });

      // 4. Uruchom OCR w tle
      console.log('🔍 Rozpoczynanie OCR...');
      processDocumentOCR(document.id).catch(error => {
        console.error('OCR failed:', error);
      });

      // 5. Powrót do szczegółów sprawy z informacją o sukcesie
      Alert.alert(
        'Sukces!', 
        `Dokument został zeskanowany jako "${selectedDocumentType.name}". OCR jest przetwarzany w tle.`,
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          }
        ]
      );

    } catch (error) {
      console.error('Błąd przetwarzania dokumentu:', error);
      Alert.alert('Błąd', 'Nie udało się przetworzyć dokumentu: ' + error.message);
    }
  };

  const showDocumentTypeSelector = (resolve) => {
    const options = documentTypes.map(type => ({
      text: type.name,
      onPress: () => {
        resolve(type);
      }
    }));

    Alert.alert(
      'Wybierz typ dokumentu',
      'Proszę wybrać właściwy typ dokumentu:',
      [
        ...options,
        { text: 'Anuluj', style: 'cancel', onPress: () => resolve(null) }
      ]
    );
  };

  const testDatabaseConnection = async () => {
    try {
      setIsProcessing(true);
      console.log('🧪 Rozpoczynanie testu bazy danych...');
      
      const result = await debugDatabaseConnection();
      
      Alert.alert(
        'Test bazy danych',
        `Wynik: ${result.success ? 'SUKCES' : 'BŁĄD'}\n\nSprawdź logi w konsoli dla szczegółów.`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Test error:', error);
      Alert.alert('Błąd testu', error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  // Sprawdź uprawnienia
  if (!permission) {
    return (
      <View style={styles.container}>
        <Text>Sprawdzanie uprawnień kamery...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Card style={styles.permissionCard}>
          <Card.Content>
            <Text style={styles.permissionText}>
              Potrzebujemy dostępu do kamery aby skanować dokumenty
            </Text>
            <Button
              mode="contained"
              onPress={requestPermission}
              style={styles.permissionButton}
            >
              Zezwól na dostęp do kamery
            </Button>
          </Card.Content>
        </Card>
      </View>
    );
  }

  if (isProcessing) {
    return (
      <View style={[styles.container, styles.processingContainer]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.processingText}>Przetwarzanie dokumentu...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView 
        style={styles.camera} 
        facing={facing}
        ref={cameraRef}
      />

      {/* Overlay z ramką - absolute positioning */}
      <View style={styles.overlay}>
        <View style={styles.frameContainer}>
          <View style={styles.frame}>
            {/* Narożniki ramki */}
            <View style={styles.frameCorner} />
            <View style={[styles.frameCorner, styles.frameCornerTopRight]} />
            <View style={[styles.frameCorner, styles.frameCornerBottomLeft]} />
            <View style={[styles.frameCorner, styles.frameCornerBottomRight]} />
          </View>
          <Text style={styles.frameText}>Umieść dokument w zielonej ramce</Text>
          <Text style={styles.frameSubText}>Dokument zostanie automatycznie przycięty</Text>
        </View>
      </View>

      {/* Przyciski na dole - absolute positioning */}
      <View style={styles.buttonContainer}>
        <IconButton
          icon="image"
          iconColor="white"
          size={30}
          style={styles.galleryButton}
          onPress={pickImageFromGallery}
        />
        
        <IconButton
          icon="camera"
          iconColor="white"
          size={50}
          style={styles.captureButton}
          onPress={takePicture}
        />
        
        <IconButton
          icon="camera-flip"
          iconColor="white"
          size={30}
          style={styles.flipButton}
          onPress={toggleCameraFacing}
        />
      </View>

      {/* Przycisk debugowy - tylko w development */}
      {__DEV__ && (
        <View style={styles.debugContainer}>
          <Button
            mode="outlined"
            onPress={testDatabaseConnection}
            style={styles.debugButton}
            labelStyle={styles.debugButtonText}
          >
            Test DB
          </Button>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  frameContainer: {
    alignItems: 'center',
  },
  frame: {
    width: width * FRAME_WIDTH_RATIO,
    height: height * FRAME_HEIGHT_RATIO,
    borderWidth: 3,
    borderColor: '#00ff00',
    borderStyle: 'solid',
    borderRadius: 15,
    backgroundColor: 'transparent',
    // Dodaj cienie dla lepszej widoczności
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 5,
  },
  frameText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 30,
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
    overflow: 'hidden',
  },
  frameSubText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 10,
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 15,
    paddingVertical: 4,
    borderRadius: 8,
    overflow: 'hidden',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 50,
  },
  captureButton: {
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  galleryButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  flipButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  permissionCard: {
    margin: 20,
  },
  permissionText: {
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 16,
  },
  permissionButton: {
    marginTop: 10,
  },
  processingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f7fa',
  },
  processingText: {
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
  debugContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 10,
  },
  debugButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  debugButtonText: {
    color: 'white',
    fontSize: 16,
  },
  frameCorner: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderWidth: 1,
    borderColor: '#00ff00',
    borderStyle: 'solid',
    borderRadius: 5,
    backgroundColor: 'transparent',
  },
  frameCornerTopRight: {
    top: 0,
    right: 0,
  },
  frameCornerBottomLeft: {
    bottom: 0,
    left: 0,
  },
  frameCornerBottomRight: {
    bottom: 0,
    right: 0,
  },
});

export default DocumentScannerScreen; 