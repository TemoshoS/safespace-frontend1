import { Montserrat_400Regular, Montserrat_700Bold, useFonts } from '@expo-google-fonts/montserrat';
import { Stack } from 'expo-router';
import React from 'react';

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Montserrat: Montserrat_400Regular,
    MontserratBold: Montserrat_700Bold,
  });

  if (!fontsLoaded) return null;

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}