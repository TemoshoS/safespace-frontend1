import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
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

const { width } = Dimensions.get('window');

export default function AdminLogin() {
  const BACKEND_URL =
    Platform.OS === 'web'
      ? 'http://localhost:3000'
      : 'http://192.168.2.116:3000';

  const router = useRouter();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [menuVisible, setMenuVisible] = useState(false);
  const slideAnim = useState(new Animated.Value(width))[0];

  // Login handler
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

  // Menu toggle
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
  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()}>
          <Image
            source={require('../assets/images/Logo.jpg')}
            style={styles.logo}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={toggleMenu}>
          <Ionicons name="menu" size={30} color="#c7da30" />
        </TouchableOpacity>
      </View>

      {/* Centered Login Form */}
      <View style={styles.content}>
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
            style={{ alignSelf: 'flex-end', marginBottom: 10 }}
            onPress={() => router.push('/forgot-password')}
          >
            <Text style={{ color: 'blue', textAlign: 'right' }}>
              Forgot Password?
            </Text>
          </TouchableOpacity>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <LinearGradient
            colors={['#c7da30', '#d7e47a']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.button, { opacity: loading ? 0.7 : 1 }]}
          >
            <TouchableOpacity
              onPress={handleNext}
              disabled={loading}
              style={{ alignItems: 'center' }}
            >
              {loading ? (
                <ActivityIndicator color="black" />
              ) : (
                <Text style={styles.buttonText}>Login</Text>
              )}
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </View>

      {/* Menu Overlay */}
      {menuVisible && <TouchableOpacity style={styles.overlay} onPress={toggleMenu} />}

      {/* Slide-in Menu */}
      <Animated.View
        style={[styles.menu, { transform: [{ translateX: slideAnim }] }]}
      >
        <TouchableOpacity style={styles.menuItem} onPress={() => navigate('/')}>
          <Text style={styles.menuText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigate('/about-us')}
        >
          <Text style={styles.menuText}>About Us</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigate('/contact-us')}
        >
          <Text style={styles.menuText}>Contact Us</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    backgroundColor: '#fff',
    zIndex: 10,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  inputContainer: {
    width: '100%',
    borderWidth: 2,
    borderColor: '#c7da30',
    borderRadius: 10,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
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
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.3)',
    zIndex: 5,
  },
  menu: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: width * 0.7,
    height: '100%',
    backgroundColor: '#c7da30',
    paddingTop: 100,
    paddingHorizontal: 20,
    zIndex: 10,
  },
  menuItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#fff',
  },
  menuText: {
    fontSize: 18,
    color: '333',
  },
  error: {
    color: 'red',
    marginBottom: 12,
    textAlign: 'center',
  },
});
