/**
 * DailyMoodAI - Ana Uygulama
 */

import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PaperProvider } from 'react-native-paper';
import { JournalProvider } from './src/context/JournalContext';
import RootNavigator from './src/navigation/RootNavigator';
import { colors } from './src/constants/colors';

const paperTheme = {
  dark: true,
  colors: {
    primary: colors.primary,
    accent: colors.secondary,
    background: colors.background,
    surface: colors.surface,
    text: colors.text,
    onSurface: colors.text,
    disabled: colors.textSecondary,
    placeholder: colors.textSecondary,
    backdrop: 'rgba(0, 0, 0, 0.5)',
  },
};

function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider theme={paperTheme}>
        <JournalProvider>
          <NavigationContainer>
            <StatusBar barStyle="light-content" backgroundColor="#0F172A" />
            <RootNavigator />
          </NavigationContainer>
        </JournalProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}

export default App;
