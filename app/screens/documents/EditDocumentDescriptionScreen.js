import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, TextInput, Button, useTheme } from 'react-native-paper';

const EditDocumentDescriptionScreen = ({ navigation, route }) => {
  // W rzeczywistej implementacji opis byłaby przekazywany przez route.params
  const [description, setDescription] = useState(
    "Dnia pierwszego września dwa tysiące dwudziestego trzeciego roku (01.09.2023 r.) przed notariuszem Janem Kowalskim stawili się: 1. Anna Maria Nowak, córka Tomasza i Marii, zamieszkała w Warszawie przy ulicy Kwiatowej 5, legitymująca się dowodem osobistym ABC123456, PESEL 12345678901, 2. Piotr Adam Wiśniewski, syn Adama i Ewy, zamieszkały w Krakowie przy ulicy Słonecznej 10, legitymujący się dowodem osobistym DEF789012, PESEL 98765432109. Stawający oświadczają, że zawierają umowę sprzedaży nieruchomości położonej w Warszawie przy ulicy Nowej 15, dla której Sąd Rejonowy dla Warszawy-Mokotowa prowadzi księgę wieczystą nr WA1M/12345/6, o powierzchni 150m². Cena sprzedaży wynosi 750000 zł (siedemset pięćdziesiąt tysięcy złotych)."
  );
  const theme = useTheme();

  const handleSave = () => {
    // Tutaj byłoby zapisywanie opisu do API
    console.log('Zapisano opis:', description);
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.instructionText}>
          Edytuj opis dokumentu. Aplikacja zapamiętuje Twoje poprawki, aby
          doskonalić swoje przyszłe sugestie.
        </Text>

        <TextInput
          multiline
          mode="outlined"
          value={description}
          onChangeText={setDescription}
          style={styles.input}
          numberOfLines={12}
        />

        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={handleSave}
            style={styles.saveButton}
          >
            Zapisz
          </Button>
          <Button
            mode="outlined"
            onPress={() => navigation.goBack()}
            style={styles.cancelButton}
          >
            Anuluj
          </Button>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  formContainer: {
    padding: 16,
  },
  instructionText: {
    marginBottom: 16,
    fontSize: 14,
    color: '#666',
  },
  input: {
    marginBottom: 20,
    minHeight: 200,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  saveButton: {
    flex: 1,
    marginRight: 8,
  },
  cancelButton: {
    flex: 1,
    marginLeft: 8,
  },
});

export default EditDocumentDescriptionScreen; 