import { useRouter } from "expo-router";
import React, { useRef } from "react";
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Index() {
  const router = useRouter();
  const scrollRef = useRef<ScrollView>(null);

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* Main Scrollable Content */}
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={[styles.container, { paddingTop: 70 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Image
            source={require("../assets/images/Logo.jpg")}
            style={styles.logo}
            resizeMode="contain"
          />

          <Text style={styles.heroTitle}>Report Abuse</Text>
          <Text style={styles.heroSubtitle}>Safely and Anonymously</Text>

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
    paddingVertical: 40,
    paddingHorizontal: 20,
  },

  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },

  heroTitle: {
    fontSize: 34,
    fontWeight: "bold",
    color: "#c7da30",
    textAlign: "center",
  },

  heroSubtitle: {
    fontSize: 18,
    color: "#545454",
    marginBottom: 30,
    textAlign: "center",
  },

  heroImage: {
    width: "90%",
    height: 250,
    borderRadius: 10,
    marginBottom: 30,
  },

  buttonsContainer: {
    width: "100%",
    alignItems: "center",
  },

  whiteButton: {
    width: "90%",
    borderRadius: 30,
    marginVertical: 8,
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#c7da30",
    
  },

  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
  },

  buttonText: {
    fontSize: 16,
    color: "#91cae0ff",
    fontFamily:
      Platform.OS === "web"
        ? `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif`
        : "System",
    marginLeft: 10,
  },
});
