import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, FAB } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

// Przykładowe dane dokumentów
const documents = [
  { id: '1', title: 'Dokument 1' },
  { id: '2', title: 'Dokument 2' },
];

export default function DocumentsListScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Twoje dokumenty</Text>
      <FlatList
        data={documents}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}><Text>{item.title}</Text></View>
        )}
      />
      <FAB
        style={styles.fab}
        icon="camera"
        label="Skanuj dokument"
        onPress={() => navigation.navigate('ScanDocument')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
  item: { padding: 12, borderBottomWidth: 1, borderBottomColor: '#eee' },
  fab: { position: 'absolute', right: 16, bottom: 16 },
}); 