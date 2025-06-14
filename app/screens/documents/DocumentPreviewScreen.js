import React, { useState } from 'react';
import { View, StyleSheet, Dimensions, ScrollView, Alert } from 'react-native';
import { Text, Card, Button, useTheme, Chip, IconButton, Appbar } from 'react-native-paper';
import { Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as Sharing from 'expo-sharing';

const { width, height } = Dimensions.get('window');

const DocumentPreviewScreen = ({ route, navigation }) => {
  const theme = useTheme();
  const { document } = route.params;
  
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const handleShare = async () => {
    try {
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(document.scan_file_path, {
          mimeType: 'image/jpeg',
          dialogTitle: `Udostępnij dokument: ${document.original_filename}`,
        });
      } else {
        Alert.alert('Błąd', 'Udostępnianie nie jest dostępne na tym urządzeniu');
      }
    } catch (error) {
      console.error('Błąd udostępniania:', error);
      Alert.alert('Błąd', 'Nie udało się udostępnić dokumentu');
    }
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

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Podgląd dokumentu" />
        <Appbar.Action icon="share" onPress={handleShare} />
      </Appbar.Header>

      <ScrollView style={styles.content}>
        {/* Podgląd obrazu */}
        <Card style={styles.imageCard}>
          <Card.Content style={styles.imageContainer}>
            {imageError ? (
              <View style={styles.errorContainer}>
                <MaterialIcons name="broken-image" size={64} color={theme.colors.outline} />
                <Text style={styles.errorText}>Nie można załadować obrazu</Text>
              </View>
            ) : (
              <Image
                source={{ uri: document.scan_file_path }}
                style={styles.documentImage}
                resizeMode="contain"
                onLoadStart={() => setImageLoading(true)}
                onLoadEnd={() => setImageLoading(false)}
                onError={() => {
                  setImageError(true);
                  setImageLoading(false);
                }}
              />
            )}
          </Card.Content>
        </Card>

        {/* Informacje o dokumencie */}
        <Card style={styles.infoCard}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Informacje o dokumencie</Text>
            
            <View style={styles.infoRow}>
              <MaterialIcons name="description" size={20} color={theme.colors.primary} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Nazwa pliku</Text>
                <Text style={styles.infoValue}>{document.original_filename}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <MaterialIcons name="category" size={20} color={theme.colors.primary} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Typ dokumentu</Text>
                <Chip
                  mode="outlined"
                  style={[
                    styles.typeChip,
                    { borderColor: document.processed ? theme.colors.primary : theme.colors.outline }
                  ]}
                >
                  {document.document_types?.name || 'Nieznany typ'}
                </Chip>
              </View>
            </View>

            <View style={styles.infoRow}>
              <MaterialIcons name="schedule" size={20} color={theme.colors.primary} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Data skanowania</Text>
                <Text style={styles.infoValue}>{formatDate(document.scan_date)}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <MaterialIcons name="folder" size={20} color={theme.colors.primary} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Sprawa</Text>
                <Text style={styles.infoValue}>{document.cases?.title || 'Nieznana sprawa'}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <MaterialIcons 
                name={document.processed ? "check-circle" : "hourglass-empty"} 
                size={20} 
                color={document.processed ? theme.colors.primary : theme.colors.outline} 
              />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Status przetwarzania</Text>
                <Text style={[
                  styles.infoValue,
                  { color: document.processed ? theme.colors.primary : theme.colors.outline }
                ]}>
                  {document.processed ? 'Przetworzony' : 'W trakcie przetwarzania'}
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Akcje */}
        <Card style={styles.actionsCard}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Akcje</Text>
            
            <Button
              mode="outlined"
              icon="share"
              style={styles.actionButton}
              onPress={handleShare}
            >
              Udostępnij dokument
            </Button>

            <Button
              mode="outlined"
              icon="text"
              style={styles.actionButton}
              onPress={() => {
                // TODO: Nawigacja do generatora opisów
                Alert.alert('Wkrótce', 'Funkcja generowania opisów będzie dostępna wkrótce');
              }}
            >
              Generuj opis
            </Button>
          </Card.Content>
        </Card>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  content: {
    flex: 1,
  },
  imageCard: {
    margin: 16,
    elevation: 2,
  },
  imageContainer: {
    alignItems: 'center',
    minHeight: height * 0.4,
    justifyContent: 'center',
  },
  documentImage: {
    width: width - 64,
    height: height * 0.4,
  },
  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  infoCard: {
    margin: 16,
    marginTop: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#333',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  infoContent: {
    flex: 1,
    marginLeft: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  typeChip: {
    alignSelf: 'flex-start',
  },
  actionsCard: {
    margin: 16,
    marginTop: 8,
    marginBottom: 32,
    elevation: 2,
  },
  actionButton: {
    marginBottom: 12,
  },
});

export default DocumentPreviewScreen; 