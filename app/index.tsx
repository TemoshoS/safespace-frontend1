import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';

export default function Index() {
  const router = useRouter();

  return (
    <LinearGradient
      colors={['#e9ebdcff', '#dee988ff']}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Logo */}
        <Image
          source={require('../assets/images/Logo.jpg')}
          style={styles.logo}
          resizeMode="contain"
        />

        {/* Welcome Section */}
        <View style={styles.welcomeContainer}>
          <Text style={styles.title}>Welcome to</Text>
          <Text style={styles.titleHighlight}>SafeSpace</Text>
          <Text style={styles.subtitle}>
            A confidential platform designed to protect and empower learners and employees to speak out — with the option to report anonymously.
          </Text>

          {/* Optional illustration/icon below subtitle */}
          <FontAwesome5 
            name="hands-helping" 
            size={50} 
            color="#c7da30" 
            style={styles.icon} 
          />
        </View>

        {/* Buttons Section */}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={styles.buttonPrimary}
            onPress={() => router.push('/report-screen')}
          >
            
            <Text style={styles.buttonText}>Report Now</Text>
          </TouchableOpacity>

         
          <TouchableOpacity
            style={styles.buttonSecondary}
            onPress={() => router.push('/admin-login')}
          >
            
            <Text style={styles.buttonTextSecondary}>School Admin </Text>
          </TouchableOpacity>

           <TouchableOpacity
            style={styles.buttonSecondary}
            onPress={() => router.push('/check-status')}
          >
            
            <Text style={styles.buttonTextSecondary}>Check Status</Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </LinearGradient>
  );
}

export const options = {
  headerShown: false,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    width: 140,
    height: 140,
    marginBottom: 25,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginBottom: 40,
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: '#333',
  },
  titleHighlight: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#c7da30',
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginTop: 15,
    lineHeight: 24,
  },
  icon: {
    marginTop: 20,
  },
  buttonsContainer: {
    width: '100%',
  },
  buttonPrimary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#c7da30',
    paddingVertical: 15,
    borderRadius: 50,
    marginBottom: 15,
    gap: 10,
  },
  buttonText: {
    color: 'black',
    fontSize: 18,
    
  },
  buttonSecondary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#c7da30', 
    paddingVertical: 15,
    borderRadius: 50,
    marginBottom: 15,
    gap: 10,
  },
  buttonTextSecondary: {
    color: 'black',
    fontSize: 18,
  },
});