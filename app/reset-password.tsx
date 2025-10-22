import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function ResetPassword() {

  const BACKEND_URL =
  Platform.OS === "web"
    ? "http://localhost:3000"     // ✅ Web browser
    : "http://192.168.2.116:3000" // ✅ iOS sim or Physical Device


  const router = useRouter();
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const handleReset = async () => {
    if (!code || !newPassword || !confirmPassword) {
      return Alert.alert('Error', 'All fields are required');
    }
    if (newPassword !== confirmPassword) {
      return Alert.alert('Error', 'Passwords do not match');
    }

    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/admin/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ verificationCode: code, newPassword, confirmPassword }),
      });

      const data = await res.json();
      setLoading(false);

      if (res.ok) {
        Alert.alert('Success', 'Password reset successful');
        router.push('/admin-login');
      } else {
        Alert.alert('Error', data.message);
      }
    } catch (err) {
      setLoading(false);
      Alert.alert('Error', 'Something went wrong');
    }
  };

  const handleConfirmPasswordChange = (text: string) => {
    setConfirmPassword(text);
    setPasswordError(newPassword && text !== newPassword ? 'Passwords do not match' : '');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset Password</Text>

      <TextInput
        placeholder="Verification Code"
        value={code}
        onChangeText={setCode}
        style={styles.input}
        keyboardType="number-pad"
      />

      <TextInput
        placeholder="New Password"
        secureTextEntry={!showPassword}
        value={newPassword}
        onChangeText={setNewPassword}
        style={styles.input}
      />

      <TextInput
        placeholder="Confirm Password"
        secureTextEntry={!showPassword}
        value={confirmPassword}
        onChangeText={handleConfirmPasswordChange}
        style={styles.input}
      />

      {passwordError ? <Text style={styles.error}>{passwordError}</Text> : null}

      <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={{ marginBottom: 16 }}>
        <Text style={{ color: '#c7da30', textAlign: 'center' }}>
          {showPassword ? 'Hide Password' : 'Show Password'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={handleReset}
        disabled={loading || !!passwordError} // fixed
      >
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Reset Password</Text>}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#fff' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 24, textAlign: 'center', color: '#c7da30' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 16 },
  button: { backgroundColor: '#c7da30', padding: 14, borderRadius: 8 },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: '600', fontSize: 16 },
  error: { color: 'red', marginBottom: 12, textAlign: 'center' },
});