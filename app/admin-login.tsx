import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';

export default function AdminLogin() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleNext = async () => {
    if (!username || !password) {
      setError('Username and password are required');
      return;
    }
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:3000/admin/validate-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      setLoading(false);

      if (response.ok) {
        // Credentials valid → go to email page
        router.push({ pathname: '/enter-email', params: { username, password } });
      } else {
        setError(data.message || 'Invalid username or password');
      }
    } catch (err) {
      setLoading(false);
      Alert.alert('Error', 'Something went wrong');
    }
  };

  return (
    <View style={styles.container}>
      {/* ✅ Go Back button */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Admin Login</Text>

      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={styles.input}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TouchableOpacity style={styles.button} onPress={handleNext} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Login</Text>}
      </TouchableOpacity>

      <TouchableOpacity
        style={{ marginTop: 20, alignItems: 'center' }}
        onPress={() => router.push('/forgot-password')}
      >
        <Text style={{ color: '#CCDD45', textAlign: 'center' }}>Forgot Password?</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', paddingHorizontal: 24, backgroundColor: '#fff' },
  backButton: {
    position: 'absolute',
    top: 50, // adjust for safe area
    left: 20,
    padding: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: '#CCDD45',
    fontWeight: 'bold',
  },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 32, textAlign: 'center', color: '#CCDD45' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 12, marginBottom: 16, borderRadius: 8, fontSize: 16 },
  button: { backgroundColor: '#CCDD45', paddingVertical: 14, borderRadius: 8, marginTop: 10 },
  buttonText: { color: '#fff', fontSize: 18, textAlign: 'center', fontWeight: '600' },
  error: { color: 'red', marginBottom: 12, textAlign: 'center' },
});
