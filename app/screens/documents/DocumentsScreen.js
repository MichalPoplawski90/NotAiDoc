import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, Card, Button, Chip, FAB, useTheme } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';

const mockDocuments = [
  {
    id: '1',
    title: 'Akt notarialny - Maria Nowak i Jan Kowalski',
    documentType: 'Akt notarialny',
    caseId: '1',
    caseName: 'Sprzedaż nieruchomości',
    createdAt: '2023-10-06T14:30:00Z',
    processed: true,
  },
  {
    id: '2',
    title: 'Pełnomocnictwo - Antoni Wiśniewski',
    documentType: 'Pełnomocnictwo',
    caseId: '3',
    caseName: 'Pełnomocnictwo',
    createdAt: '2023-10-05T09:15:00Z',
    processed: true,
  },
  {
    id: '3',
    title: 'Testament - Jan Kowalski',
    documentType: 'Testament',
    caseId: '2',
    caseName: 'Testament',
    createdAt: '2023-10-01T11:45:00Z',
    processed: false,
  },
];

const DocumentsScreen = ({ navigation }) => {
  const theme = useTheme();

  // Funkcja renderująca element dokumentu
  const renderDocumentItem = ({ item }) => (
    <Card
      style={styles.documentCard}
      onPress={() => {
        // Tutaj będzie nawigacja do szczegółów dokumentu
        console.log('Wybrano dokument:', item.id);
      }}
    >
      <Card.Content>
        <View style={styles.documentHeader}>
          <Chip
            style={{ backgroundColor: theme.colors.primary + '20' }}
            textStyle={{ color: theme.colors.primary }}
          >
            {item.documentType}
          </Chip>
          {item.processed ? (
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

        <Text style={styles.documentTitle}>{item.title}</Text>
        
        <View style={styles.documentFooter}>
          <Text style={styles.documentCase}>
            <MaterialIcons name="folder" size={14} color="#666" /> {item.caseName}
          </Text>
          <Text style={styles.documentDate}>
            {new Date(item.createdAt).toLocaleDateString('pl-PL')}
          </Text>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      {mockDocuments.length > 0 ? (
        <FlatList
          data={mockDocuments}
          renderItem={renderDocumentItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Brak dokumentów</Text>
          <Button
            mode="contained"
            onPress={() => navigation.navigate('ScanDocument')}
          >
            Dodaj pierwszy dokument
          </Button>
        </View>
      )}

      <FAB
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        icon="camera"
        onPress={() => navigation.navigate('ScanDocument')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  listContent: {
    padding: 16,
  },
  documentCard: {
    marginBottom: 16,
    elevation: 2,
  },
  documentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  documentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  documentFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  documentCase: {
    fontSize: 14,
    color: '#666',
  },
  documentDate: {
    fontSize: 12,
    color: '#999',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default DocumentsScreen; 