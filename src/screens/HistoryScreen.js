/**
 * HistoryScreen - Geçmiş girişler ekranı
 */

import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
} from 'react-native';
import { useJournal } from '../hooks/useJournal';
import EntryCard from '../components/EntryCard';
import { colors } from '../constants/colors';

const HistoryScreen = () => {
  const { entries } = useJournal();

  /**
   * Son 7 günün özetini hesaplar
   */
  const getWeeklySummary = () => {
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const lastWeekEntries = entries.filter((entry) => {
      const entryDate = new Date(entry.date);
      return entryDate >= sevenDaysAgo;
    });

    const summary = {
      positive: 0,
      neutral: 0,
      negative: 0,
      total: lastWeekEntries.length,
    };

    lastWeekEntries.forEach((entry) => {
      if (entry.sentiment === 'positive') {
        summary.positive++;
      } else if (entry.sentiment === 'negative') {
        summary.negative++;
      } else {
        summary.neutral++;
      }
    });

    return summary;
  };

  const weeklySummary = getWeeklySummary();

  const renderEntry = ({ item }) => {
    return <EntryCard entry={item} />;
  };

  if (entries.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Henüz giriş yok</Text>
        <Text style={styles.emptySubtext}>
          İlk günlük girişinizi yapmak için ana ekrana dönün.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {weeklySummary.total > 0 && (
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryTitle}>Son 7 Gün Özeti</Text>
          <View style={styles.summaryStats}>
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryEmoji, { color: colors.positive }]}>
                😊
              </Text>
              <Text style={styles.summaryNumber}>{weeklySummary.positive}</Text>
              <Text style={styles.summaryLabel}>Pozitif</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryEmoji, { color: colors.neutral }]}>
                😐
              </Text>
              <Text style={styles.summaryNumber}>{weeklySummary.neutral}</Text>
              <Text style={styles.summaryLabel}>Nötr</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryEmoji, { color: colors.negative }]}>
                😔
              </Text>
              <Text style={styles.summaryNumber}>{weeklySummary.negative}</Text>
              <Text style={styles.summaryLabel}>Negatif</Text>
            </View>
          </View>
        </View>
      )}
      <FlatList
        data={entries}
        renderItem={renderEntry}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContainer: {
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  summaryContainer: {
    backgroundColor: colors.surface,
    margin: 16,
    marginBottom: 0,
    borderRadius: 12,
    padding: 16,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  summaryNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});

export default HistoryScreen;

