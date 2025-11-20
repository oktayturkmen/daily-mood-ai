/**
 * EntryCard - Günlük giriş kartı bileşeni
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import SentimentBadge from './SentimentBadge';
import { colors } from '../constants/colors';

const EntryCard = ({ entry }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.date}>{formatDate(entry.date)}</Text>
        </View>
        <SentimentBadge sentiment={entry.sentiment} />
      </View>

      <Text style={styles.text}>{entry.text}</Text>

      {entry.summary && (
        <View style={styles.detail}>
          <Text style={styles.detailLabel}>Özet:</Text>
          <Text style={styles.detailText}>{entry.summary}</Text>
        </View>
      )}

      {entry.suggestion && (
        <View style={styles.detail}>
          <Text style={styles.detailLabel}>Öneri:</Text>
          <Text style={styles.detailText}>{entry.suggestion}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerLeft: {
    flex: 1,
  },
  date: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  text: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
    marginBottom: 12,
  },
  detail: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.background,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 4,
  },
  detailText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
});

export default EntryCard;

