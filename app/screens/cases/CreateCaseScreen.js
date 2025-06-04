import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { 
  Text, 
  TextInput, 
  Button, 
  Card, 
  Menu, 
  Provider,
  Divider,
  useTheme 
} from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';

// Import API
import { createCase } from '../../api/cases';

// Typowe akty notarialne
const DOCUMENT_TYPES = [
  { id: 'sprzedaz', label: 'Sprzedaż nieruchomości' },
  { id: 'pelnomocnictwo', label: 'Pełnomocnictwo' },
  { id: 'darowizna', label: 'Darowizna' },
  { id: 'testament', label: 'Testament' },
  { id: 'hipoteka', label: 'Hipoteka' },
  { id: 'spolka', label: 'Umowa spółki' },
  { id: 'inne', label: 'Inne' },
];

const CreateCaseScreen = ({ navigation }) => {
  const theme = useTheme();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    documentType: null,
  });
  const [menuVisible, setMenuVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    // Walidacja formularza
    if (!formData.title.trim()) {
      Alert.alert('Błąd', 'Nazwa sprawy jest wymagana');
      return;
    }

    setIsLoading(true);
    try {
      // Rzeczywisty zapis do Supabase
      const newCase = await createCase({
        title: formData.title,
        description: formData.description,
        documentType: formData.documentType,
      });

      console.log('✅ Nowa sprawa utworzona:', newCase);
      
      Alert.alert(
        'Sukces',
        'Sprawa została utworzona pomyślnie!',
        [{ 
          text: 'OK', 
          onPress: () => {
            // Przekaż informację o nowej sprawie z powrotem do listy
            navigation.navigate('CasesList', { 
              newCase: newCase,
              refresh: true 
            });
          }
        }]
      );
    } catch (error) {
      console.error('Błąd tworzenia sprawy:', error);
      
      let errorMessage = 'Nie udało się utworzyć sprawy';
      if (error.message.includes('nie jest zalogowany')) {
        errorMessage = 'Musisz być zalogowany, aby utworzyć sprawę';
      } else if (error.message.includes('relation "cases" does not exist')) {
        errorMessage = 'Baza danych nie jest skonfigurowana. Skontaktuj się z administratorem.';
      }
      
      Alert.alert('Błąd', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleScanDocument = () => {
    Alert.alert(
      'Skanowanie dokumentu',
      'Wybierz źródło',
      [
        { text: 'Aparat', onPress: () => console.log('Otwieranie aparatu') },
        { text: 'Galeria', onPress: () => console.log('Otwieranie galerii') },
        { text: 'Anuluj', style: 'cancel' },
      ]
    );
  };

  return (
    <Provider>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* Formularz podstawowy */}
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Informacje o sprawie</Text>
            
            <TextInput
              label="Nazwa sprawy *"
              value={formData.title}
              onChangeText={(text) => setFormData(prev => ({ ...prev, title: text }))}
              mode="outlined"
              style={styles.input}
              placeholder="np. Sprzedaż nieruchomości - ul. Kwiatowa 5"
              disabled={isLoading}
            />

            <TextInput
              label="Opis sprawy"
              value={formData.description}
              onChangeText={(text) => setFormData(prev => ({ ...prev, description: text }))}
              mode="outlined"
              multiline
              numberOfLines={3}
              style={styles.input}
              placeholder="Krótki opis sprawy (opcjonalne)"
              disabled={isLoading}
            />

            {/* Wybór typu aktu */}
            <Text style={styles.label}>Typ aktu notarialnego</Text>
            <Menu
              visible={menuVisible}
              onDismiss={() => setMenuVisible(false)}
              anchor={
                <Button
                  mode="outlined"
                  onPress={() => setMenuVisible(true)}
                  style={styles.dropdownButton}
                  contentStyle={styles.dropdownContent}
                  icon="chevron-down"
                  disabled={isLoading}
                >
                  {formData.documentType ? 
                    DOCUMENT_TYPES.find(type => type.id === formData.documentType)?.label :
                    'Wybierz typ aktu (opcjonalne)'
                  }
                </Button>
              }
            >
              {DOCUMENT_TYPES.map((type) => (
                <Menu.Item
                  key={type.id}
                  onPress={() => {
                    setFormData(prev => ({ ...prev, documentType: type.id }));
                    setMenuVisible(false);
                  }}
                  title={type.label}
                />
              ))}
            </Menu>
          </Card.Content>
        </Card>

        {/* Sekcja dokumentów */}
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Dokumenty</Text>
            <Text style={styles.sectionDescription}>
              Możesz od razu dodać dokumenty do sprawy
            </Text>
            
            <Divider style={styles.divider} />
            
            <Button
              mode="contained"
              icon="camera"
              onPress={handleScanDocument}
              style={styles.scanButton}
              contentStyle={styles.buttonContent}
              disabled={isLoading}
            >
              Skanuj / Importuj dokument
            </Button>
          </Card.Content>
        </Card>

        {/* Przyciski akcji */}
        <View style={styles.actionButtons}>
          <Button
            mode="outlined"
            onPress={() => navigation.goBack()}
            style={[styles.button, styles.cancelButton]}
            disabled={isLoading}
          >
            Anuluj
          </Button>
          
          <Button
            mode="contained"
            onPress={handleSave}
            style={[styles.button, styles.saveButton]}
            loading={isLoading}
            disabled={isLoading || !formData.title.trim()}
          >
            Utwórz sprawę
          </Button>
        </View>
      </ScrollView>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  card: {
    marginBottom: 16,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#2c3e50',
  },
  sectionDescription: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 16,
  },
  input: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#2c3e50',
  },
  dropdownButton: {
    marginBottom: 16,
    justifyContent: 'flex-start',
  },
  dropdownContent: {
    justifyContent: 'flex-start',
    height: 48,
  },
  divider: {
    marginVertical: 16,
  },
  scanButton: {
    marginTop: 8,
  },
  buttonContent: {
    height: 48,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  button: {
    flex: 1,
    marginHorizontal: 8,
  },
  cancelButton: {
    // Dodatkowe style dla przycisku anuluj
  },
  saveButton: {
    // Dodatkowe style dla przycisku zapisz
  },
});

export default CreateCaseScreen; 