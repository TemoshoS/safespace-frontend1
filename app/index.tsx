import React, { useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import ToggleMenu from "./toggle-menu";

export default function Index() {
  const router = useRouter();

  return (
    <View style={{ flex: 1 }}>
      {/* Sticky Menu */}
      <View style={styles.stickyMenu}>
        <ToggleMenu />
      </View>

      {/* Main Scrollable Content */}
      <ScrollView
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
            resizeMode="contain"
          />

          <View style={styles.buttonsContainer}>
            <LinearGradient
              colors={["#c7da30", "#d7e47a"]}
              style={styles.gradientButton}
            >
              <TouchableOpacity
                style={styles.buttonContent}
                activeOpacity={0.7}
                onPress={() => router.push("/report-screen")}
              >
                <FontAwesome5
                  name="exclamation-triangle"
                  size={18}
                  color="#545454"
                />
                <Text style={styles.buttonText}>Report Now</Text>
              </TouchableOpacity>
            </LinearGradient>

            <LinearGradient
              colors={["#c7da30", "#d7e47a"]}
              style={styles.gradientButton}
            >
              <TouchableOpacity
                style={styles.buttonContent}
                activeOpacity={0.7}
                onPress={() => router.push("/admin-login")}
              >
                <FontAwesome5 name="user-shield" size={18} color="#545454" />
                <Text style={styles.buttonText}>Administrator</Text>
              </TouchableOpacity>
            </LinearGradient>

            <LinearGradient
              colors={["#c7da30", "#d7e47a"]}
              style={styles.gradientButton}
            >
              <TouchableOpacity
                style={styles.buttonContent}
                activeOpacity={0.7}
                onPress={() => router.push("/check-status")}
              >
                <MaterialIcons
                  name="check-circle-outline"
                  size={20}
                  color="#545454"
                />
                <Text style={styles.buttonText}>Check Status</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>© 2025 Safe Space. All rights reserved.</Text>
      </ScrollView>
    </View>
  );
}

export const options = { headerShown: false };

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#FFFFFF",
    paddingBottom: 40,
  },
  stickyMenu: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
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
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  heroTitle: {
    fontSize: 32,
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
    width: 280,
    height: 280,
    marginBottom: 30,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  buttonsContainer: {
    width: "100%",
    alignItems: "center",
  },
  gradientButton: {
    width: "90%",
    borderRadius: 25,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
  },
  buttonText: {
    fontSize: 14,
    color: "#545454",
    fontFamily:
      Platform.OS === "web"
        ? `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif`
        : "System",
    marginLeft: 10,
  },
  footer: {
    fontSize: 13,
    color: "#777",
    textAlign: "center",
    marginTop: 40,
  },
});
