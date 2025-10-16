import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';

export default function ForgotPassword() {
   const BACKEND_URL =
    Platform.OS === "web"
      ? "http://localhost:3000" // ✅ Web browser
      : Platform.OS === "android"
      ? "http://10.0.2.2:3000" // ✅ Android emulator
      : "http://192.168.2.116:3000"; // ✅ iOS simulator (Mac) or physical device
    
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!email) {
      setError('Email is required');
      return;
    }
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${BACKEND_URL}/admin/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      setLoading(false);

      if (response.ok) {
        Alert.alert('Success', data.message || 'Verification code sent to your email');
        // Navigate to ResetPassword screen with the email
        router.push({ pathname: '/reset-password', params: { email } });
      } else {
        setError(data.message || 'Failed to send verification code');
      }
    } catch (err) {
      setLoading(false);
      Alert.alert('Error', 'Something went wrong');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Forgot Password</Text>
      <Text style={styles.subtitle}>Enter your email below to receive a verification code</Text>

      <TextInput
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Send Code</Text>}
      </TouchableOpacity>

      <TouchableOpacity style={{ marginTop: 20, alignItems: 'center' }} onPress={() => router.push('/admin-login')}>
        <Text style={{ color: '#c7da30' }}>Back to Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', paddingHorizontal: 24, backgroundColor: '#fff' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 32, textAlign: 'center', color: '#c7da30' },
  subtitle: { fontSize: 16, marginBottom: 24, textAlign: 'center', color: '#555' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 12, marginBottom: 16, borderRadius: 8, fontSize: 16, color: '#727171ff' },
  button: { backgroundColor: '#c7da30', paddingVertical: 14, borderRadius: 8, marginTop: 10 },
  buttonText: { color: '#fff', fontSize: 18, textAlign: 'center', fontWeight: '600' },
  error: { color: 'red', marginBottom: 12, textAlign: 'center' },
});