import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, TouchableOpacity, Image } from 'react-native';
import { Text, Card, Button, useTheme, Chip, ActivityIndicator, IconButton, Menu, Divider } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';

// API
import { getDocuments, deleteDocument, updateDocument, getDocumentTypes } from '../../api/documents';

const CaseDetailScreen = ({ route, navigation }) => {
  const theme = useTheme();
  const { caseData } = route.params;

  // Stan komponentu
  const [documents, setDocuments] = useState([]);
  const [documentTypes, setDocumentTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [menuVisible, setMenuVisible] = useState({});

  // Załaduj dokumenty i typy przy pierwszym renderze
  useEffect(() => {
    loadData();
  }, []);

  // Odśwież dane po powrocie z skanera
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (!loading) {
        refreshData();
      }
    });
    return unsubscribe;
  }, [navigation, loading]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [documentsData, typesData] = await Promise.all([
        getDocuments(caseData.id),
        getDocumentTypes()
      ]);
      setDocuments(documentsData);
      setDocumentTypes(typesData);
    } catch (error) {
      console.error('Błąd ładowania danych:', error);
      Alert.alert('Błąd', 'Nie udało się załadować dokumentów');
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    try {
      setRefreshing(true);
      const documentsData = await getDocuments(caseData.id);
      setDocuments(documentsData);
    } catch (error) {
      console.error('Błąd odświeżania:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleScanDocument = () => {
    navigation.navigate('DocumentScanner', { caseData });
  };

  const handleImportDocument = async () => {
    try {
      // Wybór obrazu z galerii
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        // Przekazuj dane do DocumentScanner w trybie import
        navigation.navigate('DocumentScanner', { 
          caseData, 
          importedImage: asset.uri,
          importedFilename: asset.fileName || `import_${Date.now()}.jpg`
        });
      }
    } catch (error) {
      console.error('Błąd importu dokumentu:', error);
    }
  };

  const handleGenerateDescription = () => {
    // TODO: Nawigacja do generatora opisów
    console.log('Generuj opis dla sprawy:', caseData.id);
  };

  // Funkcje zarządzania dokumentami
  const handleDocumentPreview = (document) => {
    // TODO: Nawigacja do podglądu dokumentu
    navigation.navigate('DocumentPreview', { document });
  };

  const handleChangeDocumentType = async (documentId, newTypeId) => {
    try {
      await updateDocument(documentId, { document_type_id: newTypeId });
      await refreshData();
      setMenuVisible(prev => ({ ...prev, [documentId]: false }));
      Alert.alert('Sukces', 'Typ dokumentu został zmieniony');
    } catch (error) {
      console.error('Błąd zmiany typu:', error);
      Alert.alert('Błąd', 'Nie udało się zmienić typu dokumentu');
    }
  };

  const handleDeleteDocument = (documentId) => {
    Alert.alert(
      'Usuń dokument',
      'Czy na pewno chcesz usunąć ten dokument? Ta operacja jest nieodwracalna.',
      [
        { text: 'Anuluj', style: 'cancel' },
        {
          text: 'Usuń',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteDocument(documentId);
              await refreshData();
              Alert.alert('Sukces', 'Dokument został usunięty');
            } catch (error) {
              console.error('Błąd usuwania:', error);
              Alert.alert('Błąd', 'Nie udało się usunąć dokumentu');
            }
          }
        }
      ]
    );
  };

  const toggleMenu = (documentId) => {
    setMenuVisible(prev => ({
      ...prev,
      [documentId]: !prev[documentId]
    }));
  };

  const getDocumentTypeColor = (processed) => {
    return processed ? theme.colors.primary : theme.colors.outline;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pl-PL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Komponent pojedynczego dokumentu
  const DocumentItem = ({ document }) => (
    <Card style={styles.documentCard} key={document.id}>
      <Card.Content>
        <View style={styles.documentHeader}>
          <TouchableOpacity 
            style={styles.documentPreview}
            onPress={() => handleDocumentPreview(document)}
          >
            <Image 
              source={{ uri: document.scan_file_path }}
              style={styles.documentThumbnail}
              resizeMode="cover"
            />
            <View style={styles.previewOverlay}>
              <MaterialIcons name="zoom-in" size={24} color="white" />
            </View>
          </TouchableOpacity>

          <View style={styles.documentInfo}>
            <Text style={styles.documentFilename} numberOfLines={1}>
              {document.original_filename}
            </Text>
            
            <View style={styles.documentMeta}>
              <Chip
                mode="outlined"
                compact
                style={[
                  styles.typeChip,
                  { borderColor: getDocumentTypeColor(document.processed) }
                ]}
              >
                {document.document_types?.name || 'Nieznany typ'}
              </Chip>
              
              {!document.processed && (
                <Chip
                  mode="outlined"
                  compact
                  icon="clock-outline"
                  style={styles.processingChip}
                >
                  Przetwarzanie...
                </Chip>
              )}

              {document.auto_recognized && (
                <Chip
                  mode="outlined"
                  compact
                  icon="robot"
                  style={[styles.aiChip, { borderColor: theme.colors.tertiary }]}
                >
                  AI
                </Chip>
              )}
            </View>

            <Text style={styles.documentDate}>
              {formatDate(document.scan_date)}
            </Text>
          </View>

          <Menu
            visible={menuVisible[document.id] || false}
            onDismiss={() => toggleMenu(document.id)}
            anchor={
              <IconButton
                icon="dots-vertical"
                size={20}
                onPress={() => toggleMenu(document.id)}
              />
            }
          >
            <Menu.Item
              leadingIcon="eye"
              title="Podgląd"
              onPress={() => {
                toggleMenu(document.id);
                handleDocumentPreview(document);
              }}
            />
            <Menu.Item
              leadingIcon="tag"
              title="Zmień typ"
              onPress={() => {
                // Pokaż submenu z typami dokumentów
                toggleMenu(document.id);
                showDocumentTypeMenu(document);
              }}
            />
            <Divider />
            <Menu.Item
              leadingIcon="delete"
              title="Usuń"
              onPress={() => {
                toggleMenu(document.id);
                handleDeleteDocument(document.id);
              }}
            />
          </Menu>
        </View>
      </Card.Content>
    </Card>
  );

  const showDocumentTypeMenu = (document) => {
    const options = documentTypes.map(type => ({
      text: type.name,
      onPress: () => handleChangeDocumentType(document.id, type.id)
    }));

    Alert.alert(
      'Wybierz typ dokumentu',
      `Aktualny typ: ${document.document_types?.name || 'Nieznany'}`,
      [
        ...options,
        { text: 'Anuluj', style: 'cancel' }
      ]
    );
  };

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
              onPress={handleScanDocument}
            >
              Skanuj dokument
            </Button>
            
            <Button
              mode="outlined"
              icon="file-plus"
              style={styles.actionButton}
              onPress={handleImportDocument}
            >
              Importuj dokument
            </Button>

            <Button
              mode="outlined"
              icon="text"
              style={styles.actionButton}
              onPress={handleGenerateDescription}
            >
              Generuj opis
            </Button>
          </View>
        </Card.Content>
      </Card>

      {/* Sekcja dokumentów */}
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              Dokumenty ({documents.length})
            </Text>
            {refreshing && <ActivityIndicator size="small" />}
          </View>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={theme.colors.primary} />
              <Text style={styles.loadingText}>Ładowanie dokumentów...</Text>
            </View>
          ) : documents.length === 0 ? (
            <View style={styles.emptyContainer}>
              <MaterialIcons name="description" size={48} color={theme.colors.outline} />
              <Text style={styles.emptyText}>Brak dokumentów</Text>
              <Text style={styles.emptySubtext}>
                Zeskanuj lub zaimportuj pierwszy dokument dla tej sprawy
              </Text>
            </View>
          ) : (
            <View style={styles.documentsContainer}>
              {documents.map(document => (
                <DocumentItem document={document} key={document.id} />
              ))}
            </View>
          )}
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
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    color: '#666',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  documentsContainer: {
    gap: 12,
  },
  documentCard: {
    marginBottom: 12,
    elevation: 1,
  },
  documentHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  documentPreview: {
    position: 'relative',
    width: 80,
    height: 80,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
  },
  documentThumbnail: {
    width: '100%',
    height: '100%',
  },
  previewOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.8,
  },
  documentInfo: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  documentFilename: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  documentMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginBottom: 8,
  },
  typeChip: {
    marginRight: 8,
    marginBottom: 4,
  },
  processingChip: {
    marginRight: 8,
    marginBottom: 4,
  },
  documentDate: {
    fontSize: 12,
    color: '#666',
  },
  aiChip: {
    marginRight: 8,
    marginBottom: 4,
  },
});

export default CaseDetailScreen; 