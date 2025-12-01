import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Text } from '@react-navigation/elements';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inferior',
          tabBarIcon: () => <Text>📺</Text>
        }}
      />
      <Tabs.Screen
        name="externo"
        options={{
          title: 'Externo',
          tabBarIcon: () => <Text>🌳</Text>
        }}
      />
      <Tabs.Screen
        name="superior"
        options={{
          title: 'Superior',
          tabBarIcon: () => <Text>🛏️</Text>
        }}
      />
    </Tabs>
  );
}
