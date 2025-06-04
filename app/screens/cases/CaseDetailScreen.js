import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Button, useTheme, Chip } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';

const CaseDetailScreen = ({ route, navigation }) => {
  const theme = useTheme();
  const { caseData } = route.params;

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.title}>{caseData.title}</Text>
          
          <View style={styles.statusContainer}>
            <Chip
              mode="outlined"
              icon="folder"
              style={[
                styles.statusChip,
                { backgroundColor: caseData.status === 'active' ? theme.colors.primaryContainer : theme.colors.surfaceVariant }
              ]}
            >
              {caseData.status === 'active' ? 'Aktywna' : 'Zakończona'}
            </Chip>
          </View>

          {caseData.description && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Opis</Text>
              <Text style={styles.description}>{caseData.description}</Text>
            </View>
          )}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Informacje</Text>
            <View style={styles.infoRow}>
              <MaterialIcons name="event" size={20} color={theme.colors.primary} />
              <Text style={styles.infoText}>
                Utworzono: {new Date(caseData.created_at).toLocaleDateString('pl-PL')}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <MaterialIcons name="update" size={20} color={theme.colors.primary} />
              <Text style={styles.infoText}>
                Ostatnia aktualizacja: {new Date(caseData.updated_at).toLocaleDateString('pl-PL')}
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Akcje</Text>
          <View style={styles.actionsContainer}>
            <Button
              mode="contained"
              icon="camera"
              style={styles.actionButton}
              onPress={() => {
                // TODO: Nawigacja do skanowania dokumentu
                console.log('Skanuj dokument dla sprawy:', caseData.id);
              }}
            >
              Skanuj dokument
            </Button>
            
            <Button
              mode="outlined"
              icon="file-plus"
              style={styles.actionButton}
              onPress={() => {
                // TODO: Nawigacja do importu dokumentu
                console.log('Importuj dokument dla sprawy:', caseData.id);
              }}
            >
              Importuj dokument
            </Button>

            <Button
              mode="outlined"
              icon="text"
              style={styles.actionButton}
              onPress={() => {
                // TODO: Nawigacja do generatora opisów
                console.log('Generuj opis dla sprawy:', caseData.id);
              }}
            >
              Generuj opis
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
  },
  card: {
    margin: 16,
    marginBottom: 8,
    elevation: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  statusContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  statusChip: {
    alignSelf: 'flex-start',
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#666',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    marginLeft: 8,
    color: '#666',
  },
  actionsContainer: {
    gap: 12,
  },
  actionButton: {
    marginBottom: 8,
  },
});

export default CaseDetailScreen; 