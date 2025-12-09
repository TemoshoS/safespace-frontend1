import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useRef } from "react";
import {
  Dimensions,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

export default function Index() {
  const router = useRouter();
  const scrollRef = useRef<ScrollView>(null);

  return (
    
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView
        ref={scrollRef}
        
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Logo */}
        <View style={styles.logoWrapper}>
          <Image
            source={require("../assets/images/Logo.jpg")}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Image
            source={require("../assets/images/schoolgirls.jpeg")}
            style={styles.heroImage}
            resizeMode="contain"
          />

          {/* Action Buttons */}
          <View style={styles.buttonsContainer}>
            {/* REPORT NOW */}
            <TouchableOpacity
              style={styles.buttonWrapper}
              activeOpacity={0.8}
              onPress={() => router.replace("/report-screen")}
            >
              <LinearGradient
                colors={["#FFFFFF", "#FFFFFF"]}
                style={styles.gradientButton}
                start={[0, 0]}
                end={[1, 1]}
              >
                <Text style={styles.choiceText}>Report Now</Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* CHECK STATUS */}
            <TouchableOpacity
              style={styles.buttonWrapper}
              activeOpacity={0.8}
              onPress={() => router.replace("/check-status")}
            >
              <LinearGradient
                colors={["#FFFFFF", "#FFFFFF"]}
                style={styles.gradientButton}
                start={[0, 0]}
                end={[1, 1]}
              >
                <Text style={styles.choiceText}>Check Status</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
    // 4. Ensure you run: npx expo install react-native-safe-area-context
  );
}

export const options = { headerShown: false };

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#FFFFFF",
  },

  heroSection: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: height * 0.05,
    paddingHorizontal: width * 0.05,
  },

  // Bigger logo
  logo: {
    width: width * 0.35,
    height: width * 0.35,
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

  heroImage: {
    width: "100%",
    height: height * 0.35,
    borderRadius: 10,
    marginTop: height * 0.03,
    marginBottom: 30,
  },

  /* Equal buttons row */
  buttonsContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    paddingHorizontal: 10,
  },

  /* Wrapper that ensures equal size */
  buttonWrapper: {
    flex: 1,
    maxWidth: "48%", // ensures they are exactly equal
  },

  /* Matching your provided style */
  gradientButton: {
    paddingVertical: height * 0.015,
    borderRadius: 255,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#c7da30",
  },

  choiceText: {
    color: "#1aaed3ff",
    fontSize: width * 0.04,
    fontWeight: "bold",
    textAlign: "center",
    fontFamily:
      Platform.OS === "web"
        ? `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif`
        : "System",
  },
});