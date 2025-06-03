import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';

export default function CameraTest() {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState('back');

  if (!permission) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Sprawdzanie uprawnień kamery...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Brak dostępu do kamery</Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Udziel uprawnienia</Text>
        </TouchableOpacity>
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={facing}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <Text style={styles.buttonText}>Przełącz kamerę</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.button} 
            onPress={() => Alert.alert('Sukces!', 'Camera działa poprawnie!')}
          >
            <Text style={styles.buttonText}>Test OK</Text>
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  text: {
    textAlign: 'center',
    fontSize: 18,
    color: 'white',
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 15,
    margin: 5,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
}); 