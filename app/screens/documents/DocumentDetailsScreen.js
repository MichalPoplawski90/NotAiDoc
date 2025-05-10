import React from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import { Text, Card, Chip, Button, Divider, useTheme } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';

const mockDocument = {
  id: '1',
  title: 'Akt notarialny - Maria Nowak i Jan Kowalski',
  documentType: 'Akt notarialny',
  caseId: '1',
  caseName: 'Sprzedaż nieruchomości',
  createdAt: '2023-10-06T14:30:00Z',
  processed: true,
  extractedData: {
    date: '01.09.2023',
    notaryName: 'Jan Kowalski',
    repertoryNumber: '1234/2023',
    parties: [
      {
        name: 'Anna Maria Nowak',
        parents: 'Tomasz i Maria',
        address: 'Warszawa, ul. Kwiatowa 5',
        idNumber: 'ABC123456',
        pesel: '12345678901'
      },
      {
        name: 'Piotr Adam Wiśniewski',
        parents: 'Adam i Ewa',
        address: 'Kraków, ul. Słoneczna 10',
        idNumber: 'DEF789012',
        pesel: '98765432109'
      }
    ],
    propertyDetails: {
      address: 'Warszawa, ul. Nowa 15',
      landRegistryNumber: 'WA1M/12345/6',
      area: '150m²'
    },
    transactionValue: '750000 PLN'
  },
  generatedDescription: "Dnia pierwszego września dwa tysiące dwudziestego trzeciego roku (01.09.2023 r.) przed notariuszem Janem Kowalskim stawili się: 1. Anna Maria Nowak, córka Tomasza i Marii, zamieszkała w Warszawie przy ulicy Kwiatowej 5, legitymująca się dowodem osobistym ABC123456, PESEL 12345678901, 2. Piotr Adam Wiśniewski, syn Adama i Ewy, zamieszkały w Krakowie przy ulicy Słonecznej 10, legitymujący się dowodem osobistym DEF789012, PESEL 98765432109. Stawający oświadczają, że zawierają umowę sprzedaży nieruchomości położonej w Warszawie przy ulicy Nowej 15, dla której Sąd Rejonowy dla Warszawy-Mokotowa prowadzi księgę wieczystą nr WA1M/12345/6, o powierzchni 150m². Cena sprzedaży wynosi 750000 zł (siedemset pięćdziesiąt tysięcy złotych)."
};

const DocumentDetailsScreen = ({ navigation }) => {
  const theme = useTheme();

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.documentCard}>
        <Card.Content>
          <View style={styles.headerContainer}>
            <Chip
              style={{ backgroundColor: theme.colors.primary + '20' }}
              textStyle={{ color: theme.colors.primary }}
            >
              {mockDocument.documentType}
            </Chip>
            {mockDocument.processed ? (
              <Chip
                style={{ backgroundColor: theme.colors.success + '20' }}
                textStyle={{ color: theme.colors.success }}
                icon={() => <MaterialIcons name="check" size={16} color={theme.colors.success} />}
              >
                Przetworzony
              </Chip>
            ) : (
              <Chip
                style={{ backgroundColor: theme.colors.warning + '20' }}
                textStyle={{ color: theme.colors.warning }}
                icon={() => <MaterialIcons name="hourglass-empty" size={16} color={theme.colors.warning} />}
              >
                W trakcie
              </Chip>
            )}
          </View>

          <Text style={styles.documentTitle}>{mockDocument.title}</Text>
          <Text style={styles.documentDate}>Data utworzenia: {new Date(mockDocument.createdAt).toLocaleDateString('pl-PL')}</Text>
          
          <Divider style={styles.divider} />
          
          <Text style={styles.sectionTitle}>Podgląd dokumentu</Text>
          <View style={styles.imagePlaceholder}>
            <MaterialIcons name="description" size={48} color="#aaa" />
            <Text style={styles.placeholderText}>Podgląd dokumentu</Text>
          </View>
          
          <Divider style={styles.divider} />
          
          <Text style={styles.sectionTitle}>Wyekstrahowane dane</Text>
          <View style={styles.extractedDataContainer}>
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Data:</Text>
              <Text style={styles.dataValue}>{mockDocument.extractedData.date}</Text>
            </View>
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Notariusz:</Text>
              <Text style={styles.dataValue}>{mockDocument.extractedData.notaryName}</Text>
            </View>
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Nr repertorium:</Text>
              <Text style={styles.dataValue}>{mockDocument.extractedData.repertoryNumber}</Text>
            </View>
            
            <Text style={styles.subSectionTitle}>Strony:</Text>
            {mockDocument.extractedData.parties.map((party, index) => (
              <View key={index} style={styles.partyContainer}>
                <Text style={styles.partyName}>{party.name}</Text>
                <Text style={styles.partyDetails}>Rodzice: {party.parents}</Text>
                <Text style={styles.partyDetails}>Adres: {party.address}</Text>
                <Text style={styles.partyDetails}>Nr dowodu: {party.idNumber}</Text>
                <Text style={styles.partyDetails}>PESEL: {party.pesel}</Text>
              </View>
            ))}
            
            <Text style={styles.subSectionTitle}>Nieruchomość:</Text>
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Adres:</Text>
              <Text style={styles.dataValue}>{mockDocument.extractedData.propertyDetails.address}</Text>
            </View>
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Nr księgi wieczystej:</Text>
              <Text style={styles.dataValue}>{mockDocument.extractedData.propertyDetails.landRegistryNumber}</Text>
            </View>
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Powierzchnia:</Text>
              <Text style={styles.dataValue}>{mockDocument.extractedData.propertyDetails.area}</Text>
            </View>
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Cena transakcji:</Text>
              <Text style={styles.dataValue}>{mockDocument.extractedData.transactionValue}</Text>
            </View>
          </View>
          
          <Divider style={styles.divider} />
          
          <Text style={styles.sectionTitle}>Wygenerowany opis</Text>
          <Card style={styles.descriptionCard}>
            <Card.Content>
              <Text style={styles.descriptionText}>{mockDocument.generatedDescription}</Text>
            </Card.Content>
          </Card>
          
          <View style={styles.actionsContainer}>
            <Button
              mode="contained"
              onPress={() => navigation.navigate('EditDocumentDescription')}
              style={styles.actionButton}
              icon="pencil"
            >
              Edytuj opis
            </Button>
            <Button
              mode="outlined"
              onPress={() => {}}
              style={styles.actionButton}
              icon="download"
            >
              Eksportuj
            </Button>
          </View>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
    padding: 16,
  },
  documentCard: {
    marginBottom: 16,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  documentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  documentDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  divider: {
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  imagePlaceholder: {
    height: 200,
    backgroundColor: '#eee',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  placeholderText: {
    marginTop: 8,
    color: '#888',
  },
  extractedDataContainer: {
    marginBottom: 16,
  },
  dataRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  dataLabel: {
    width: 140,
    fontWeight: '500',
    color: '#555',
  },
  dataValue: {
    flex: 1,
    color: '#333',
  },
  subSectionTitle: {
    fontSize: 15,
    fontWeight: '500',
    marginTop: 12,
    marginBottom: 8,
  },
  partyContainer: {
    marginBottom: 12,
    paddingLeft: 16,
  },
  partyName: {
    fontWeight: '500',
    marginBottom: 4,
  },
  partyDetails: {
    color: '#555',
    marginBottom: 2,
  },
  descriptionCard: {
    backgroundColor: '#f9f9f9',
    marginBottom: 16,
  },
  descriptionText: {
    lineHeight: 22,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
  },
});

export default DocumentDetailsScreen; 