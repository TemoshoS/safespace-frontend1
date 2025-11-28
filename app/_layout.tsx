import { Montserrat_400Regular, Montserrat_700Bold, useFonts } from '@expo-google-fonts/montserrat';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Dimensions, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useFonts, Montserrat_400Regular, Montserrat_700Bold } from '@expo-google-fonts/montserrat';

const { width, height } = Dimensions.get('window');

export default function RootLayout() {
  const [showCookie, setShowCookie] = useState(false);

  // Load fonts globally
  const [fontsLoaded] = useFonts({
    Montserrat: Montserrat_400Regular,
    MontserratBold: Montserrat_700Bold,
  });

  useEffect(() => {
    setShowCookie(true);
  }, []);

  const acceptCookies = async () => {
    await AsyncStorage.setItem('cookieConsent', 'all');
    setShowCookie(false);
  };

  const rejectAll = async () => {
    await AsyncStorage.setItem('cookieConsent', 'rejected');
    setShowCookie(false);
  };

  if (!fontsLoaded) return null;

  return (
    <View style={{ flex: 1 }}>
      {/* Apply Montserrat globally */}
      <View style={{ flex: 1, fontFamily: 'Montserrat' }}>
        <Stack screenOptions={{ headerShown: false }} />

        <Modal visible={showCookie} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalBox}>
              <Text style={styles.modalTitle}>Cookies Policy</Text>

              <Text style={styles.modalText}>
                We use essential cookies to keep Safe Space secure and working properly.
                This includes safety features like anonymous sessions, secure logins,
                and improving support services. By continuing, you accept these cookies.
              </Text>

              <View style={styles.modalButtons}>
                <TouchableOpacity style={styles.modalButton} onPress={acceptCookies}>
                  <Text style={styles.modalButtonAccept}>Accept All</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.modalButton} onPress={rejectAll}>
                  <Text style={styles.modalButtonReject}>Reject All</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalBox: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#1aaed3ff',
    fontFamily: 'Montserrat'
  },
  modalText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
    color: '#444',
    fontFamily: 'Montserrat'
  },
  modalButtons: {
    width: '100%'
  },
  modalButton: {
    paddingVertical: 12,
    borderRadius: 50,
    marginBottom: 10,
    backgroundColor: '#fff',
    borderColor: '#c7da30',
    borderWidth: 2
  },
  modalButtonAccept: {
    color: '#1aaed3ff',
    textAlign: 'center',
    fontSize: 15,
    fontFamily: 'Montserrat'
  },
  modalButtonReject: {
    color: 'red',
    textAlign: 'center',
    fontSize: 15,
    fontFamily: 'Montserrat'
  },
});