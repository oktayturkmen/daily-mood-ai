/**
 * DailyEntryScreen - Günlük giriş ekranı
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import { useJournal } from '../hooks/useJournal';
import { getBackgroundColorBySentiment } from '../utils/sentimentUtils';
import { colors } from '../constants/colors';

const DailyEntryScreen = ({ navigation }) => {
  const [text, setText] = useState('');
  const [lastEntry, setLastEntry] = useState(null);
  const { addEntry, loading } = useJournal();

  const handleAnalyze = async () => {
    if (!text || text.trim().length === 0) {
      Alert.alert('Uyarı', 'Lütfen bir metin girin.');
      return;
    }

    try {
      const newEntry = await addEntry(text);
      setLastEntry(newEntry);
      setText(''); // Input'u temizle
    } catch (error) {
      Alert.alert('Hata', error.message || 'Bir hata oluştu.');
    }
  };

  const backgroundColor = lastEntry
    ? getBackgroundColorBySentiment(lastEntry.sentiment)
    : colors.background;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor }]}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Bugün nasılsınız?</Text>
        <TextInput
          style={styles.input}
          placeholder="Bugünkü duygularınızı, düşüncelerinizi yazın..."
          placeholderTextColor={colors.textSecondary}
          value={text}
          onChangeText={setText}
          multiline
          numberOfLines={6}
          editable={!loading}
        />
        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleAnalyze}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={colors.text} />
          ) : (
            <Text style={styles.buttonText}>Analiz Et</Text>
          )}
        </TouchableOpacity>
      </View>

      {lastEntry && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultTitle}>Analiz Sonucu</Text>
          <View style={styles.resultItem}>
            <Text style={styles.resultLabel}>Duygu:</Text>
            <Text style={styles.resultValue}>
              {lastEntry.sentiment === 'positive'
                ? 'Pozitif 😊'
                : lastEntry.sentiment === 'negative'
                ? 'Negatif 😔'
                : 'Nötr 😐'}
            </Text>
          </View>
          <View style={styles.resultItem}>
            <Text style={styles.resultLabel}>Özet:</Text>
            <Text style={styles.resultText}>{lastEntry.summary}</Text>
          </View>
          <View style={styles.resultItem}>
            <Text style={styles.resultLabel}>Öneri:</Text>
            <Text style={styles.resultText}>{lastEntry.suggestion}</Text>
          </View>
        </View>
      )}

      <TouchableOpacity
        style={styles.historyButton}
        onPress={() => navigation.navigate('History')}
      >
        <Text style={styles.historyButtonText}>Geçmişi Görüntüle</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    color: colors.text,
    fontSize: 16,
    minHeight: 120,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  resultContainer: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  resultItem: {
    marginBottom: 12,
  },
  resultLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 4,
  },
  resultValue: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
  },
  resultText: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
  },
  historyButton: {
    backgroundColor: colors.secondary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  historyButtonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default DailyEntryScreen;

