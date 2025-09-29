import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function VerifyPage() {
  const { username } = useLocalSearchParams<{ username: string }>();
  const router = useRouter();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const handleVerify = async () => {
    setError(''); // Reset error before verifying
    try {
      const response = await fetch('http://localhost:3000/admin/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, code }),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        // Save JWT to AsyncStorage
         await AsyncStorage.setItem('adminToken', data.token);
         await AsyncStorage.setItem('adminUsername', data.username);
        // Navigate to admin home
        router.push('/admin-dashboard');
      } else {
        setError(data.message || 'Verification failed');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verify Admin</Text>

      <TextInput
        placeholder="Verification Code"
        value={code}
        onChangeText={setCode}
        style={styles.input}
        keyboardType="numeric"
      />

      {error !== '' && <Text style={styles.error}>{error}</Text>}

      <TouchableOpacity style={styles.button} onPress={handleVerify}>
        <Text style={styles.buttonText}>Verify</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 32,
    textAlign: 'center',
    color: '#CCDD45',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    marginBottom: 16,
    borderRadius: 8,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#CCDD45',
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    fontWeight: '600',
  },
  error: {
    color: 'red',
    marginBottom: 12,
    textAlign: 'center',
  },
});
