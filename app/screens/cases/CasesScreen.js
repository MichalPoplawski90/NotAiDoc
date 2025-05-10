import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, Card, Button, FAB, useTheme } from 'react-native-paper';

const mockCases = [
  {
    id: '1',
    title: 'Akt notarialny - sprzedaż nieruchomości',
    description: 'Sprawa dotyczy sprzedaży nieruchomości przy ul. Kwiatowej 5',
    status: 'active',
    createdAt: '2023-10-05T14:30:00Z',
  },
  {
    id: '2',
    title: 'Testament',
    description: 'Przygotowanie testamentu dla Jana Kowalskiego',
    status: 'completed',
    createdAt: '2023-10-01T09:15:00Z',
  },
  {
    id: '3',
    title: 'Pełnomocnictwo',
    description: 'Pełnomocnictwo do reprezentowania przed urzędami',
    status: 'active',
    createdAt: '2023-09-28T11:00:00Z',
  },
];

const CasesScreen = ({ navigation }) => {
  const theme = useTheme();

  const renderCaseItem = ({ item }) => (
    <Card
      style={styles.caseCard}
      onPress={() => {
        // Tutaj będzie nawigacja do szczegółów sprawy
        console.log('Wybrano sprawę:', item.id);
      }}
    >
      <Card.Content>
        <Text style={styles.caseTitle}>{item.title}</Text>
        <Text style={styles.caseDescription}>{item.description}</Text>
        <View style={styles.caseFooter}>
          <Text style={[styles.caseStatus, { color: item.status === 'active' ? theme.colors.primary : theme.colors.success }]}>
            {item.status === 'active' ? 'Aktywna' : 'Zakończona'}
          </Text>
          <Text style={styles.caseDate}>
            {new Date(item.createdAt).toLocaleDateString('pl-PL')}
          </Text>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      {mockCases.length > 0 ? (
        <FlatList
          data={mockCases}
          renderItem={renderCaseItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Brak spraw</Text>
          <Button
            mode="contained"
            onPress={() => {
              // Tutaj będzie tworzenie nowej sprawy
              console.log('Tworzenie nowej sprawy');
            }}
          >
            Utwórz pierwszą sprawę
          </Button>
        </View>
      )}

      <FAB
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        icon="plus"
        onPress={() => {
          // Tutaj będzie tworzenie nowej sprawy
          console.log('Dodaj nową sprawę');
        }}
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
  caseCard: {
    marginBottom: 16,
    elevation: 2,
  },
  caseTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  caseDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  caseFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  caseStatus: {
    fontWeight: '500',
  },
  caseDate: {
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

export default CasesScreen; 