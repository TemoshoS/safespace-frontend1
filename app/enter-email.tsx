import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function EnterEmail() {
  const { username, password } = useLocalSearchParams<{ username: string; password: string }>();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendCode = async () => {
    if (!email) {
      setError('Email is required');
      return;
    }
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:3000/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, email }),
      });

      const data = await response.json();
      setLoading(false);

      if (response.ok && data.message.includes('Verification code sent')) {
        // Save username in AsyncStorage for later use
        await AsyncStorage.setItem('adminUsername', username);
        // Move to verification page
        router.push({ pathname: '/verify-page', params: { username } });
      } else {
        // Display backend error (invalid credentials or email mismatch)
        setError(data.message || 'Failed to send code');
      }
    } catch (err) {
      setLoading(false);
      Alert.alert('Error', 'Something went wrong');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter Admin Email</Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TouchableOpacity style={styles.button} onPress={handleSendCode} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Send Code</Text>}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', paddingHorizontal: 24, backgroundColor: '#fff' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 32, textAlign: 'center', color: '#20C997' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 12, marginBottom: 16, borderRadius: 8, fontSize: 16 },
  button: { backgroundColor: '#20C997', paddingVertical: 14, borderRadius: 8, marginTop: 10 },
  buttonText: { color: '#fff', fontSize: 18, textAlign: 'center', fontWeight: '600' },
  error: { color: 'red', marginBottom: 12, textAlign: 'center' },
});
