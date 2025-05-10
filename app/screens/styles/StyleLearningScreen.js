import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, TextInput, Button, Card, useTheme, Divider } from 'react-native-paper';

const StyleLearningScreen = ({ navigation, route }) => {
  const [examples, setExamples] = useState([
    {
      id: '1',
      text: 'Dnia pierwszego sierpnia dwa tysiące dwudziestego trzeciego roku (01.08.2023 r.) przed notariuszem stawili się...',
    },
    {
      id: '2',
      text: '',
    },
    {
      id: '3',
      text: '',
    },
  ]);
  
  const [documentType, setDocumentType] = useState('Akt notarialny');
  const theme = useTheme();

  const handleExampleChange = (text, index) => {
    const newExamples = [...examples];
    newExamples[index] = { ...examples[index], text };
    setExamples(newExamples);
  };

  const handleSave = () => {
    // Filtrujemy przykłady, aby uwzględnić tylko te z tekstem
    const filledExamples = examples.filter(example => example.text.trim() !== '');
    
    if (filledExamples.length < 1) {
      alert('Proszę wprowadzić co najmniej jeden przykład stylu.');
      return;
    }
    
    console.log('Zapisano przykłady stylu:', filledExamples);
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.infoCard}>
        <Card.Content>
          <Text style={styles.infoTitle}>Uczenie się stylu notariusza</Text>
          <Text style={styles.infoText}>
            Wprowadź 1-3 przykłady opisów dokumentów typu "{documentType}" w Twoim stylu.
            Na ich podstawie system nauczy się generować podobne opisy dla przyszłych dokumentów.
          </Text>
        </Card.Content>
      </Card>

      {examples.map((example, index) => (
        <View key={example.id} style={styles.exampleContainer}>
          <Text style={styles.exampleTitle}>Przykład {index + 1}</Text>
          <TextInput
            mode="outlined"
            multiline
            value={example.text}
            onChangeText={(text) => handleExampleChange(text, index)}
            placeholder="Wprowadź przykładowy opis dokumentu..."
            style={styles.exampleInput}
            numberOfLines={6}
          />
          <Divider style={styles.divider} />
        </View>
      ))}

      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={handleSave}
          style={styles.saveButton}
        >
          Zapisz przykłady
        </Button>
        <Button
          mode="outlined"
          onPress={() => navigation.goBack()}
          style={styles.cancelButton}
        >
          Anuluj
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
    padding: 16,
  },
  infoCard: {
    marginBottom: 20,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  exampleContainer: {
    marginBottom: 16,
  },
  exampleTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  exampleInput: {
    marginBottom: 8,
  },
  divider: {
    marginTop: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    marginBottom: 32,
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

export default StyleLearningScreen; 