/**
 * AsyncStorage işlemleri için servis
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'JOURNAL_ENTRIES';

/**
 * Tüm entry'leri AsyncStorage'dan okur
 * @returns {Promise<Array>} Entry dizisi
 */
export const getEntries = async () => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
    return [];
  } catch (error) {
    console.error('Error reading entries from storage:', error);
    return [];
  }
};

/**
 * Entry dizisini AsyncStorage'a kaydeder
 * @param {Array} entries - Kaydedilecek entry dizisi
 */
export const saveEntries = async (entries) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch (error) {
    console.error('Error saving entries to storage:', error);
    throw error;
  }
};

