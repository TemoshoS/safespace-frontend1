import { useRouter } from "expo-router";
import React, { useRef, useEffect, useState } from "react";
import { Modal } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions
} from "react-native";

const { width, height } = Dimensions.get("window");

export default function Index() {
  const router = useRouter();
  const [showCookie, setShowCookie] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
  const checkConsent = async () => {
    try {
      const accepted = await AsyncStorage.getItem("cookieConsent");
      if (!accepted) {
        setShowCookie(true); 
      }
    } catch (error) {
      console.error("Error reading cookie consent:", error);
      setShowCookie(true); 
    }
  };

  checkConsent();
}, []);

  const acceptCookies = async () => {
    await AsyncStorage.setItem("cookieConsent", "all");
    setShowCookie(false);
  };

 
  const rejectAll = async () => {
    await AsyncStorage.setItem("cookieConsent", "rejected");
    setShowCookie(false);
  };


  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* Main Scrollable Content */}
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={[styles.container, { paddingTop: 70 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.logoWrapper}>
          <Image
            source={require("../assets/images/Logo.jpg")}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        {/* Hero Section */}
        <View style={styles.heroSection}>



          <Text style={styles.heroTitle}>
            Report Abuse{"\n"}Safely and{"\n"}Anonymously
          </Text>



          <Image
            source={require("../assets/images/schoolgirls.jpeg")}
            style={styles.heroImage}
            resizeMode="cover"
          />

          {/* Action Buttons */}
          <View style={styles.buttonsContainer}>
            {/* Report Button */}
            <View style={styles.whiteButton}>
              <TouchableOpacity
                style={styles.buttonContent}
                activeOpacity={0.8}
                onPress={() => router.push("/report-screen")}
              >
                <Text style={styles.buttonText}>Report Now</Text>
              </TouchableOpacity>
            </View>

            {/* Check Status Button */}
            <View style={styles.whiteButton}>
              <TouchableOpacity
                style={styles.buttonContent}
                activeOpacity={0.8}
                onPress={() => router.push("/check-status")}
              >
                <Text style={styles.buttonText}>Check Status</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
      {/* ================= COOKIE MODAL ================= */}
      <Modal visible={showCookie} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Cookies Settings</Text>

            <Text style={styles.modalText}>
            We use essential cookies to keep Safe Space secure and working properly. This includes safety features like anonymous sessions, secure logins, and improving support services.By continuing, you accept these cookies.
            </Text>

            <View style={styles.modalButtons}>
              {/* Accept All */}
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: "#c7da30" }]}
                onPress={acceptCookies}
              >
                <Text style={styles.modalButtonText}>Accept All</Text>
              </TouchableOpacity>


              {/* Reject All */}
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: "red" }]}
                onPress={rejectAll}
              >
                <Text style={styles.modalButtonText}>Reject All</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

export const options = { headerShown: false };

// Styles
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#FFFFFF",
    paddingBottom: 60,
  },

  heroSection: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: height * 0.05,
    paddingHorizontal: width * 0.05,
  },

  logo: {
    width: width * 0.25,
    height: width * 0.25,

  },
  logoWrapper: {
    width: "100%",
    alignItems: "flex-start",
    paddingLeft: width * 0.08,

  },


  heroTitle: {
    fontSize: width * 0.1,
    fontWeight: "bold",
    color: "#c7da30",
    textAlign: "center",
    marginBottom: 10,
  },

  heroSubtitle: {
    fontSize: 18,
    color: "#545454",
    marginBottom: 30,
    textAlign: "center",
  },

  heroImage: {
    width: "90%",
    height: height * 0.3,
    aspectRatio: 16 / 9,
    borderRadius: 10,
    marginBottom: 30,
  },

  buttonsContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,

  },
  whiteButton: {
    flex: 1,
    borderRadius: 30,
    marginVertical: 8,
    marginHorizontal: 5,
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#c7da30",
  },

  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: height * 0.015
    ,
  },

  buttonText: {
    fontSize: width * 0.04,
    color: "#1aaed3ff",
    fontFamily:
      Platform.OS === "web"
        ? `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif`
        : "System",
    marginLeft: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalBox: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    color: "#1aaed3ff",
  },

  modalText: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 20,
    color: "#444",
  },

  modalButtons: {
    width: "100%",
  },

  modalButton: {
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 10,
  },

  modalButtonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 15,
  },

});
