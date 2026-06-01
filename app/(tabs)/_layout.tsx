import React from 'react';
import { Tabs } from 'expo-router';
import { Colors } from '../../src/theme/tokens';
import { Text, View } from 'react-native';
import { useApp } from '../_layout';

function TabIcon({ glyph, focused, hasDot }: { glyph: string; focused: boolean; hasDot?: boolean }) {
  return (
    <View style={{ alignItems: 'center' }}>
      <View>
        <Text style={{ fontSize: 22, color: focused ? Colors.brand : Colors.muted }}>{glyph}</Text>
        {hasDot && (
          <View style={{
            position: 'absolute', top: -2, right: -7,
            width: 7, height: 7, borderRadius: 4,
            backgroundColor: Colors.fairs,
            borderWidth: 1.5, borderColor: Colors.surface,
          }} />
        )}
      </View>
    </View>
  );
}

export default function TabLayout() {
  const { saved } = useApp();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.surface,
          borderTopColor: Colors.hair,
          borderTopWidth: 1,
          paddingBottom: 26,
          paddingTop: 9,
          height: 80,
        },
        tabBarActiveTintColor: Colors.brand,
        tabBarInactiveTintColor: Colors.muted,
        tabBarLabelStyle: { fontSize: 10.5, fontWeight: '700' },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Browse',
          tabBarIcon: ({ focused }) => <TabIcon glyph="🦭" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ focused }) => <TabIcon glyph="⎕" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="saved"
        options={{
          title: 'Saved',
          tabBarIcon: ({ focused }) => <TabIcon glyph="♡" focused={focused} hasDot={saved.length > 0} />,
        }}
      />
      <Tabs.Screen
        name="you"
        options={{
          title: 'You',
          tabBarIcon: ({ focused }) => <TabIcon glyph="◔" focused={focused} />,
        }}
      />
    </Tabs>
  );
}
