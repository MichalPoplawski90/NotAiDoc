import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, Card, Button, FAB, useTheme, Chip } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';

const mockStyles = [
  {
    id: '1',
    name: 'Akt notarialny',
    examplesCount: 3,
    lastUpdated: '2023-10-15T09:30:00Z',
    status: 'active',
  },
  {
    id: '2',
    name: 'Testament',
    examplesCount: 2,
    lastUpdated: '2023-10-05T14:45:00Z',
    status: 'active',
  },
  {
    id: '3',
    name: 'Pełnomocnictwo',
    examplesCount: 1,
    lastUpdated: '2023-09-28T11:20:00Z',
    status: 'learning',
  },
];

const StylesScreen = ({ navigation }) => {
  const theme = useTheme();

  const renderStyleItem = ({ item }) => (
    <Card
      style={styles.styleCard}
      onPress={() => {
        navigation.navigate('StyleLearning');
      }}
    >
      <Card.Content>
        <View style={styles.styleHeader}>
          <Text style={styles.styleName}>{item.name}</Text>
          <Chip
            style={{
              backgroundColor: item.status === 'active' ? theme.colors.success + '20' : theme.colors.warning + '20',
            }}
            textStyle={{
              color: item.status === 'active' ? theme.colors.success : theme.colors.warning,
            }}
          >
            {item.status === 'active' ? 'Aktywny' : 'W trakcie uczenia'}
          </Chip>
        </View>

        <View style={styles.styleInfo}>
          <Text style={styles.styleInfoText}>
            <MaterialIcons name="description" size={16} color="#666" /> {item.examplesCount} przykłady
          </Text>
          <Text style={styles.styleInfoText}>
            <MaterialIcons name="update" size={16} color="#666" /> {new Date(item.lastUpdated).toLocaleDateString('pl-PL')}
          </Text>
        </View>

        <View style={styles.styleActions}>
          <Button
            mode="outlined"
            onPress={() => navigation.navigate('StyleLearning')}
            style={styles.styleButton}
            icon="pencil"
          >
            Edytuj
          </Button>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      {mockStyles.length > 0 ? (
        <FlatList
          data={mockStyles}
          renderItem={renderStyleItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Brak zdefiniowanych stylów</Text>
          <Button
            mode="contained"
            onPress={() => navigation.navigate('StyleLearning')}
          >
            Dodaj pierwszy styl
          </Button>
        </View>
      )}

      <FAB
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        icon="plus"
        onPress={() => navigation.navigate('StyleLearning')}
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
  styleCard: {
    marginBottom: 16,
    elevation: 2,
  },
  styleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  styleName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  styleInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  styleInfoText: {
    fontSize: 14,
    color: '#666',
  },
  styleActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  styleButton: {
    marginLeft: 8,
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

export default StylesScreen; 