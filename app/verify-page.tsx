import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';

export default function VerifyPage() {
  const { username, email } = useLocalSearchParams<{ username: string; email: string }>();
  const router = useRouter();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const inputsRef = useRef<Array<TextInput | null>>([]);

  const handleChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text.slice(-1); // keep only last digit
    setOtp(newOtp);

    // focus next input
    if (text && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const code = otp.join('');
    if (code.length < 6) {
      setError('Please enter the full 6-digit OTP');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:3000/admin/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, code }),
      });

      const data = await response.json();
      setLoading(false);

      if (response.ok && data.token) {
        await AsyncStorage.setItem('adminToken', data.token);
        await AsyncStorage.setItem('adminUsername', data.username);
        router.push('/admin-dashboard');
      } else {
        setError(data.message || 'Verification failed');
      }
    } catch (err) {
      setLoading(false);
      setError('Something went wrong. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verify Admin</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.infoText}>An OTP has been sent to {email}</Text>

        {/* OTP Inputs */}
        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => { inputsRef.current[index] = ref; }}
              value={digit}
              onChangeText={(text) => handleChange(text, index)}
              keyboardType="numeric"
              maxLength={1}
              style={styles.otpInput}
            />
          ))}
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <LinearGradient
          colors={['#c7da30', '#d7e47a']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.button, { opacity: loading ? 0.7 : 1 }]}
        >
          <TouchableOpacity onPress={handleVerify} disabled={loading} style={{ alignItems: 'center' }}>
            {loading ? <ActivityIndicator color="black" /> : <Text style={styles.buttonText}>Verify & Login</Text>}
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', paddingHorizontal: 20 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 24, textAlign: 'center', color: '#000' },
  inputContainer: { width: '100%', borderWidth: 2, borderColor: '#c7da30', borderRadius: 15, padding: 20, backgroundColor: '#fff' },
  infoText: { fontSize: 14, color: '#444', marginBottom: 16, textAlign: 'center' },
  otpContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  otpInput: {
    borderWidth: 2,
    borderColor: '#c7da30',
    borderRadius: 8,
    width: 40,
    height: 50,
    textAlign: 'center',
    fontSize: 18,
    color: '#545454',
  },
  button: { paddingVertical: 14, borderRadius: 30, marginTop: 10 },
  buttonText: {
    color: '#545454',
    fontSize: 18,
    textAlign: 'center',

  },
  error: { color: 'red', marginBottom: 12, textAlign: 'center' },
});
