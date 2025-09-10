import { View, Image, Button, StyleSheet, Text } from 'react-native';
import { useRouter } from 'expo-router';
import React from 'react';

export default function Index() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      
      <Image
        source={require('../assets/images/Logo.jpg')}
        style={styles.logo}
        resizeMode="contain"
      />

<Text>Welcome to SafeSpace</Text>
      {/* Navigation buttons */}
     
        <Button title="Abuse Types" onPress={() => router.push('/abuse-types')} />
        <Button title="Screen 2" onPress={() => router.push('/')} />
        <Button title="Screen 3" onPress={() => router.push('/')} />
     
    </View>
  );
}

// Remove header for this screen
export const options = {
  headerShown: false,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,       
    paddingLeft: 16,      
    backgroundColor: '#fff',
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 40,     
  },
    welcomeText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  }
});
