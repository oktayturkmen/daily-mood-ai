/**
 * Sentiment analizi için yardımcı fonksiyonlar
 */

import { colors } from '../constants/colors';

/**
 * Sentiment değerine göre emoji döndürür
 */
export const getEmojiBySentiment = (sentiment) => {
  switch (sentiment) {
    case 'positive':
      return '😊';
    case 'negative':
      return '😔';
    case 'neutral':
    default:
      return '😐';
  }
};

/**
 * Sentiment değerine göre arka plan rengi döndürür
 */
export const getBackgroundColorBySentiment = (sentiment) => {
  switch (sentiment) {
    case 'positive':
      return colors.bgPositive;
    case 'negative':
      return colors.bgNegative;
    case 'neutral':
    default:
      return colors.bgNeutral;
  }
};

/**
 * Sentiment değerine göre renk döndürür
 */
export const getColorBySentiment = (sentiment) => {
  switch (sentiment) {
    case 'positive':
      return colors.positive;
    case 'negative':
      return colors.negative;
    case 'neutral':
    default:
      return colors.neutral;
  }
};

/**
 * Sentiment değerine göre öneri metni döndürür (varsayılan)
 */
export const getDefaultSuggestionBySentiment = (sentiment) => {
  switch (sentiment) {
    case 'positive':
      return 'Harika! Bu pozitif enerjiyi korumaya devam edin.';
    case 'negative':
      return 'Zor bir gün geçirmişsiniz. Kendinize zaman ayırın ve dinlenin.';
    case 'neutral':
    default:
      return 'Sakin bir gün. Kendinizi dinleyin ve ihtiyaçlarınıza odaklanın.';
  }
};

