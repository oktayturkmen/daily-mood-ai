/**
 * SentimentBadge - Sentiment'e göre emoji ve renk gösteren badge bileşeni
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getEmojiBySentiment, getColorBySentiment } from '../utils/sentimentUtils';
import { colors } from '../constants/colors';

const SentimentBadge = ({ sentiment, showEmoji = true, showText = true }) => {
  const emoji = getEmojiBySentiment(sentiment);
  const backgroundColor = getColorBySentiment(sentiment);

  const getSentimentText = () => {
    switch (sentiment) {
      case 'positive':
        return 'Pozitif';
      case 'negative':
        return 'Negatif';
      case 'neutral':
      default:
        return 'Nötr';
    }
  };

  return (
    <View style={[styles.badge, { backgroundColor }]}>
      {showEmoji && <Text style={styles.emoji}>{emoji}</Text>}
      {showText && <Text style={styles.text}>{getSentimentText()}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  emoji: {
    fontSize: 16,
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
  },
});

export default SentimentBadge;

