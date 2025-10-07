import React, { useState } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';

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
        router.push({ pathname: '/verify-page', params: { username, email } });
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
      {/* ✅ Logo at the top */}
      <TouchableOpacity style={styles.logoContainer} onPress={() => router.back()}>
        <Image
          source={require('../assets/images/Logo.jpg')}
          style={styles.logo}
          resizeMode="contain"
        />
      </TouchableOpacity>
      <Text style={styles.title}>Admin Verification</Text>
      <View style={styles.inputContainer}>
       {/* <Text style={styles.titleInfo}>Enter your email to receive a login code</Text> */}
        {/* <Text style={styles.label}>Email Address</Text> */}
        <TextInput
          placeholder='email address'
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <LinearGradient
          colors={['#c7da30', '#d7e47a']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.button, { opacity: loading ? 0.7 : 1 }]}
        >
          <TouchableOpacity onPress={handleSendCode} disabled={loading} style={{ alignItems: 'center' }}>
            {loading ? (
              <ActivityIndicator color="black" />
            ) : (
              <Text style={styles.buttonText}>Send OTP</Text>
            )}
          </TouchableOpacity>
        </LinearGradient>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  logoContainer: {
    position: 'absolute',
    top: 40,
    left: 20,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  inputContainer: {
    width: '80%',
    borderWidth: 2,
    borderColor: '#c7da30',
    borderRadius: 10,
    padding: 20,
  },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 32, textAlign: 'center' },
  titleInfo: { fontSize: 18, marginBottom: 32, textAlign: 'center', color: 'grey' },
  label: { fontSize: 16, textAlign: 'center', marginBottom: 12, color: 'grey' },
  input: {
    borderWidth: 2,
    borderColor: '#c7da30',
    color: '#8b8b8bff',
    padding: 12,
    marginBottom: 16,
    borderRadius: 8,
    fontSize: 16,
  },
  button: {

    paddingVertical: 14,
    borderRadius: 30,
    marginTop: 10,
  },
  buttonText: {
    color: '#545454',
    fontSize: 18,
    textAlign: 'center',

  },
  error: { color: 'red', marginBottom: 12, textAlign: 'center' },
});