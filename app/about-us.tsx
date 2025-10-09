import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Platform,
  Image,
  TouchableOpacity,
  Linking,
} from "react-native";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import ToggleMenu from "./toggle-menu";

export default function AboutUs() {
  const handlePress = (type: string, value: string) => {
    switch (type) {
      case "email":
        Linking.openURL(`mailto:${value}`);
        break;
      case "phone":
        Linking.openURL(`tel:${value}`);
        break;
      case "url":
        Linking.openURL(value);
        break;
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* Sticky Menu */}
      <View style={styles.stickyMenu}>
        <ToggleMenu />
      </View>

      <ScrollView
        contentContainerStyle={[styles.container, { paddingTop: 100 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Image
            source={require("../assets/images/Logo.jpg")}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        {/* Header */}
        <Text style={styles.title}>ABOUT SAFE SPACE</Text>

        <View style={styles.textContainer}>
          <Text style={styles.text}>
            A confidential platform designed to protect and empower learners
            and employees to speak out - with the option to report anonymously.
          </Text>

          <Text style={styles.text}>
            Your voice matters. Your identity is protected. Whether you choose
            to report with your name or anonymously, Safe Space by Moepi Publishing
            ensures every report is handled with confidentiality and urgency.
          </Text>

          <Text style={[styles.sectionTitle]}>
            You can report any of the following through Safe Space:
          </Text>

          <Text style={styles.text}>
            • Bullying{"\n"}
            • Substance Abuse{"\n"}
            • Sexual abuse or Harassment{"\n"}
            • Weapons{"\n"}
            • Teenage Pregnancy{"\n"}
            • Other issues
          </Text>

          <Text style={styles.footer}>
            © 2025 Safe Space. All rights reserved.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

export const options = { headerShown: false };

const styles = StyleSheet.create({
  stickyMenu: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 20,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  container: {
    flexGrow: 1,
    paddingBottom: 50,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    width: 120,
    height: 120,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#c7da30",
    textAlign: "center",
    paddingHorizontal: 20,
    marginBottom: 25,
    fontFamily:
      Platform.OS === "web"
        ? `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif`
        : "System",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginTop: 20,
    marginBottom: 10,
    color: "#333",
    textAlign: "center",
  },
  textContainer: {
    paddingHorizontal: 25,
  },
  text: {
    fontSize: 16,
    color: "#545454",
    lineHeight: 24,
    textAlign: "center",
    marginBottom: 18,
    fontFamily:
      Platform.OS === "web"
        ? `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif`
        : "System",
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
    justifyContent: "center",
  },
  icon: {
    marginRight: 12,
  },
  contactText: {
    fontSize: 20,
    color: "#545454",
    fontWeight: "600",
    textAlign: "center",
  },
  footer: {
    fontSize: 13,
    color: "#777",
    textAlign: "center",
    marginTop: 30,
    fontFamily:
      Platform.OS === "web"
        ? `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif`
        : "System",
  },
});
