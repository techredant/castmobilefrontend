import { Stack, Tabs } from 'expo-router';
import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';

export default function TabLayout() {
  const { theme, isDark } = useTheme();

  return (
       <><StatusBar
      translucent
      backgroundColor="transparent"
      barStyle={isDark ? "light-content" : "dark-content"} /><Stack
        screenOptions={{}}
      >
        <Stack.Screen
          name="index"
          options={{
            title: '',
            headerShown: false,
          }} />
      </Stack></>
  );
}
