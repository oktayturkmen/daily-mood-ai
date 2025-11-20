/**
 * Root Navigator - Ana navigasyon yapısı
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DailyEntryScreen from '../screens/DailyEntryScreen';
import HistoryScreen from '../screens/HistoryScreen';

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="DailyEntry"
      screenOptions={{
        headerStyle: {
          backgroundColor: '#1E293B',
        },
        headerTintColor: '#F8FAFC',
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}
    >
      <Stack.Screen
        name="DailyEntry"
        component={DailyEntryScreen}
        options={{ title: 'Günlük Giriş' }}
      />
      <Stack.Screen
        name="History"
        component={HistoryScreen}
        options={{ title: 'Geçmiş' }}
      />
    </Stack.Navigator>
  );
};

export default RootNavigator;

