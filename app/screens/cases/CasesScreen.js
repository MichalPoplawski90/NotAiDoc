import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { Text, Card, Button, FAB, useTheme, ActivityIndicator } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';

// Import API
import { getCases } from '../../api/cases';

const CasesScreen = ({ navigation, route }) => {
  const theme = useTheme();
  const [cases, setCases] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const handleCreateCase = () => {
    navigation.navigate('CreateCase');
  };

  const loadCases = async (showLoader = true) => {
    if (showLoader) setIsLoading(true);
    setError(null);
    
    try {
      const data = await getCases();
      setCases(data);
      console.log('✅ Załadowano sprawy:', data.length);
    } catch (error) {
      console.error('Błąd ładowania spraw:', error);
      setError(error.message);
      
      // Jeśli błąd dotyczy braku tabel, pokaż pomocne info
      if (error.message.includes('relation "cases" does not exist')) {
        setError('Baza danych nie jest skonfigurowana. Uruchom schemat bazy danych.');
      }
    } finally {
      if (showLoader) setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadCases(false);
    setIsRefreshing(false);
  };

  // Załaduj sprawy przy pierwszym renderze
  useEffect(() => {
    loadCases();
  }, []);

  // Sprawdź czy wróciliśmy z formularza z nową sprawą
  useFocusEffect(
    useCallback(() => {
      if (route.params?.refresh) {
        console.log('🔄 Odświeżanie listy spraw...');
        loadCases(false);
        
        // Wyczyść parametr, żeby nie odświeżać za każdym razem
        navigation.setParams({ refresh: undefined, newCase: undefined });
      }
    }, [route.params])
  );

  const renderCaseItem = ({ item }) => (
    <Card
      style={styles.caseCard}
      onPress={() => {
        console.log('Wybrano sprawę:', item.id);
        navigation.navigate('CaseDetail', { caseData: item });
      }}
    >
      <Card.Content>
        <Text style={styles.caseTitle}>{item.title}</Text>
        {item.description && (
          <Text style={styles.caseDescription}>{item.description}</Text>
        )}
        <View style={styles.caseFooter}>
          <Text style={[styles.caseStatus, { color: item.status === 'active' ? theme.colors.primary : theme.colors.success }]}>
            {item.status === 'active' ? 'Aktywna' : 'Zakończona'}
          </Text>
          <Text style={styles.caseDate}>
            {new Date(item.created_at).toLocaleDateString('pl-PL')}
          </Text>
        </View>
      </Card.Content>
    </Card>
  );

  // Loading state
  if (isLoading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Ładowanie spraw...</Text>
      </View>
    );
  }

  // Error state
  if (error) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>Błąd: {error}</Text>
        <Button
          mode="contained"
          onPress={() => loadCases()}
          style={styles.retryButton}
        >
          Spróbuj ponownie
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {cases.length > 0 ? (
        <FlatList
          data={cases}
          renderItem={renderCaseItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              colors={[theme.colors.primary]}
            />
          }
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Brak spraw</Text>
          <Text style={styles.emptySubtext}>
            Utwórz pierwszą sprawę, aby rozpocząć pracę
          </Text>
          <Button
            mode="contained"
            onPress={handleCreateCase}
            style={styles.emptyButton}
          >
            Utwórz pierwszą sprawę
          </Button>
        </View>
      )}

      <FAB
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        icon="plus"
        onPress={handleCreateCase}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
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
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginBottom: 24,
  },
  emptyButton: {
    // style dla przycisku w pustym stanie
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    color: '#e74c3c',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  retryButton: {
    // style dla przycisku retry
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default CasesScreen; 