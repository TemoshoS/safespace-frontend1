import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, Image,Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

export default function AdminLogin() {
  const BACKEND_URL =
  Platform.OS === "web"
    ? "http://localhost:3000" // ✅ Web browser
    : Platform.OS === "android"
    ? "http://10.0.2.2:3000" // ✅ Android emulator
    : "http://192.168.2.116:3000"; // ✅ iOS simulator (Mac) or physical device
    
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
      const response = await fetch(`${BACKEND_URL}/admin/validate-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      setLoading(false);

      if (response.ok) {
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
      {/* ✅ Logo at the top */}
      <TouchableOpacity style={styles.logoContainer} onPress={() => router.back()}>
        <Image
          source={require('../assets/images/Logo.jpg')}
          style={styles.logo}
          resizeMode="contain"
        />
      </TouchableOpacity>

      <Text style={styles.title}>LOGIN PAGE</Text>

      <View style={styles.inputContainer}>
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
        <TouchableOpacity
          style={{ alignSelf: 'flex-end' }}
          onPress={() => router.push('/forgot-password')}
        >
          <Text style={{ color: 'blue', textAlign: 'right' }}>Forgot Password?</Text>
        </TouchableOpacity>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <LinearGradient
          colors={['#c7da30', '#d7e47a']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.button, { opacity: loading ? 0.7 : 1 }]}
        >
          <TouchableOpacity onPress={handleNext} disabled={loading} style={{ alignItems: 'center' }}>
            {loading ? (
              <ActivityIndicator color="black" />
            ) : (
              <Text style={styles.buttonText}>Login</Text>
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 32,
    textAlign: 'center',
    color: 'black',
  },
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
  error: {
    color: 'red',
    marginBottom: 12,
    textAlign: 'center',
  },
});
