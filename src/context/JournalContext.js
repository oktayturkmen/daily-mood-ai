/**
 * Journal Context - Global state yönetimi
 */

import React, { createContext, useState, useEffect, useContext } from 'react';
import { getEntries, saveEntries } from '../services/storageService';
import { analyzeText } from '../services/aiService';

const JournalContext = createContext();

/**
 * Journal Provider
 */
export const JournalProvider = ({ children }) => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);

  // Uygulama açılışında entry'leri yükle
  useEffect(() => {
    loadEntries();
  }, []);

  /**
   * AsyncStorage'dan entry'leri yükler
   */
  const loadEntries = async () => {
    try {
      const storedEntries = await getEntries();
      setEntries(storedEntries);
    } catch (error) {
      console.error('Error loading entries:', error);
    }
  };

  /**
   * Yeni entry ekler
   * @param {string} text - Kullanıcının yazdığı metin
   */
  const addEntry = async (text) => {
    if (!text || text.trim().length === 0) {
      throw new Error('Metin boş olamaz');
    }

    setLoading(true);
    try {
      // AI analizi yap
      const analysis = await analyzeText(text.trim());

      // Yeni entry oluştur
      const newEntry = {
        id: Date.now().toString(),
        text: text.trim(),
        date: new Date().toISOString(),
        sentiment: analysis.sentiment,
        summary: analysis.summary,
        suggestion: analysis.suggestion,
      };

      // State'e ekle (başa ekle - en yeni önce)
      const updatedEntries = [newEntry, ...entries];
      setEntries(updatedEntries);

      // AsyncStorage'a kaydet
      await saveEntries(updatedEntries);

      return newEntry;
    } catch (error) {
      console.error('Error adding entry:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    entries,
    loading,
    addEntry,
    loadEntries,
  };

  return (
    <JournalContext.Provider value={value}>
      {children}
    </JournalContext.Provider>
  );
};

/**
 * Journal hook - Context'i kullanmak için
 */
export const useJournal = () => {
  const context = useContext(JournalContext);
  if (!context) {
    throw new Error('useJournal must be used within JournalProvider');
  }
  return context;
};

