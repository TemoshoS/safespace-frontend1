import { Stack, usePathname } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import ToggleMenu from './toggle-menu';

export default function RootLayout() {
  const pathname = usePathname();

  // Show menu only on index, contact-us, and about-us pages
  const showMenu =  pathname === '/contact-us' || pathname === '/about-us';

  return (
    <View style={{ flex: 1 }}>
      {showMenu && <ToggleMenu />}

      <Stack screenOptions={{ headerShown: false }} />
    </View>
  );
}