import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Image,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const { width, height } = Dimensions.get("window");

export default function VerifyPage() {
  const BACKEND_URL =
    Platform.OS === "web"
      ? "http://localhost:3000"
      : "http://192.168.2.116:3000";

  const { username, email } = useLocalSearchParams<{ username: string; email: string }>();
  const router = useRouter();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const inputsRef = useRef<Array<TextInput | null>>([]);

  // Menu state
  const [menuVisible, setMenuVisible] = useState(false);
  const slideAnim = useState(new Animated.Value(width))[0];

  const toggleMenu = () => {
    if (menuVisible) {
      Animated.timing(slideAnim, {
        toValue: width,
        duration: 250,
        useNativeDriver: true,
      }).start(() => setMenuVisible(false));
    } else {
      setMenuVisible(true);
      Animated.timing(slideAnim, {
        toValue: width * 0.3,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  };

  const navigate = (path: string) => {
    toggleMenu();
    setTimeout(() => {
      router.push({ pathname: path as any });
    }, 250);
  };

  const handleChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text.slice(-1);
    setOtp(newOtp);

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
      const response = await fetch(`${BACKEND_URL}/admin/verify`, {
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

  // Resend OTP state
  const [resending, setResending] = useState(false);
  const [resendMessage, setResendMessage] = useState('');
  const [cooldown, setCooldown] = useState(0); // in seconds

  const handleResendOtp = async () => {
    if (cooldown > 0) return; // prevent spamming

    setResending(true);
    setResendMessage('');

    try {
      const response = await fetch(`${BACKEND_URL}/admin/resend-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email }),
      });

      const data = await response.json();
      setResending(false);

      if (response.ok) {
        setResendMessage('OTP resent successfully!');
        setCooldown(60); // start 30s cooldown

        // Countdown timer
        const interval = setInterval(() => {
          setCooldown(prev => {
            if (prev <= 1) {
              clearInterval(interval);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        setResendMessage(data.message || 'Failed to resend OTP');
      }
    } catch (err) {
      setResending(false);
      setResendMessage('Something went wrong. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()}>
          <Image
            source={require("../assets/images/Logo.jpg")}
            style={styles.logo}
            resizeMode="contain"
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={toggleMenu}>
          <Ionicons name="menu" size={30} color="#c7da30" />
        </TouchableOpacity>
      </View>

      {/* Centered Content */}
      <View style={styles.content}>
        <Text style={styles.title}>Verify Admin</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.infoText}>An OTP has been sent to {email}</Text>

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
              {loading ? <ActivityIndicator color="black" /> : <Text style={styles.buttonText}>Verify</Text>}
            </TouchableOpacity>
          </LinearGradient>

          {/* Resend OTP */}
          <TouchableOpacity
            onPress={handleResendOtp}
            disabled={resending || cooldown > 0}
            style={{ marginTop: 10, alignSelf: 'center' }}
          >
            <Text style={{ color: '#c7da30', fontWeight: 'bold', fontSize: 16 }}>
              {resending ? 'Resending...' : cooldown > 0 ? `Resend OTP in ${cooldown}s` : 'Resend OTP'}
            </Text>
          </TouchableOpacity>

          {resendMessage ? (
            <Text style={{ textAlign: 'center', marginTop: 5, color: 'green' }}>
              {resendMessage}
            </Text>
          ) : null}
        </View>
      </View>

      {/* Overlay */}
      {menuVisible && <TouchableOpacity style={styles.overlay} onPress={toggleMenu} />}

      {/* Slide Menu */}
      <Animated.View
        style={[styles.menu, { transform: [{ translateX: slideAnim }] }]}
      >
        <TouchableOpacity style={styles.menuItem} onPress={() => navigate('/')}>
          <Text style={styles.menuText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => navigate('/about-us')}>
          <Text style={styles.menuText}>About Us</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => navigate('/contact-us')}>
          <Text style={styles.menuText}>Contact Us</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    backgroundColor: "#fff",
    zIndex: 10,
  },
  logo: { width: 80, height: 80, borderRadius: 10 },

  content: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 },
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
  buttonText: { color: '#545454', fontSize: 18, textAlign: 'center' },
  error: { color: 'red', marginBottom: 12, textAlign: 'center' },
  overlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.3)' },
  menu: { position: 'absolute', top: 0, right: 0, width: width * 0.7, height: height, backgroundColor: '#c7da30', paddingTop: 100, paddingHorizontal: 20 },
  menuItem: { paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#fff' },
  menuText: { fontSize: 18, color: '#333' },
});
