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

const { width, height } = Dimensions.get("window");

export default function Index() {
  const router = useRouter();
  const scrollRef = useRef<ScrollView>(null);

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={[styles.container, { paddingTop: 70 }]}
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
            <View style={styles.whiteButton}>
              <TouchableOpacity
                style={styles.buttonContent}
                activeOpacity={0.8}
                onPress={() => router.replace("/report-screen")}
              >
                <Text style={styles.buttonText}>Report Now</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.whiteButton}>
              <TouchableOpacity
                style={styles.buttonContent}
                activeOpacity={0.8}
                onPress={() => router.replace("/check-status")}
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
  container: { flexGrow: 1, backgroundColor: "#FFFFFF" },
  heroSection: { alignItems: "center", justifyContent: "center", paddingVertical: height * 0.05, paddingHorizontal: width * 0.05 },
  logo: { width: width * 0.25, height: width * 0.25 },
  logoWrapper: { width: "100%", alignItems: "flex-start", paddingLeft: width * 0.08 },
  heroTitle: { fontSize: width * 0.1, fontWeight: "bold", color: "#c7da30", textAlign: "center", marginBottom: 10 },
  heroImage: { width: "100%", height: height * 0.35, borderRadius: 10, marginBottom: 30 },
  buttonsContainer: { width: "100%", flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 10 },
  whiteButton: { flex: 1, borderRadius: 30, marginVertical: 8, marginHorizontal: 5, backgroundColor: "#fff", borderWidth: 2, borderColor: "#c7da30" },
  buttonContent: { flexDirection: "row", alignItems: "center", justifyContent: "center", paddingVertical: height * 0.015 },
  buttonText: { fontSize: width * 0.04, color: "#1aaed3ff", marginLeft: 10, fontFamily: Platform.OS === "web" ? `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif` : "System" },
});
