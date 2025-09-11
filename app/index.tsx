import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function Index() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      
      <Image
        source={require('../assets/images/Logo.jpg')}
        style={styles.logo}
        resizeMode="contain"
      />

      {/* Welcome section */}
      <View style={styles.welcomeContainer}>
        <Text style={styles.welcomeText}>Welcome to SafeSpace</Text>
      </View>

      {/* Buttons section */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/abuse-types')}
        >
          <Text style={styles.buttonText}>Report Abuse</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/admin-login')}
        >
          <Text style={styles.buttonText}>School Admin</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/')}
        >
          <Text style={styles.buttonText}>Status</Text>
        </TouchableOpacity>
      </View>
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
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  logo: {
    width: 120,
    height: 120,
    position: 'absolute',
    top: 10,
    left: 10,
  },
  welcomeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
  },
  buttonsContainer: {
    marginBottom: 50,
  },
  button: {
    backgroundColor: '#20C997',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    fontWeight: '600',
  },
});
