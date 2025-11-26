import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Dimensions, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function RootLayout() {
  const [showCookie, setShowCookie] = useState(false);

  // Show modal every time app opens
  useEffect(() => {
    setShowCookie(true);
  }, []);

  const acceptCookies = async () => {
    await AsyncStorage.setItem('cookieConsent', 'all'); // save user consent
    setShowCookie(false);
  };

  const rejectAll = async () => {
    await AsyncStorage.setItem('cookieConsent', 'rejected'); // save user rejection
    setShowCookie(false);
  };

  return (
    <View style={{ flex: 1 }} pointerEvents="box-none">
      <Stack screenOptions={{ headerShown: false }} />

      <Modal visible={showCookie} transparent animationType="fade">
        <View style={styles.modalOverlay} pointerEvents="auto">
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
    color: '#1aaed3ff'
  },
  modalText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
    color: '#444'
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
    fontSize: 15
  },
  modalButtonReject: {
    color: 'red',
    textAlign: 'center',
    fontSize: 15
  },
});
