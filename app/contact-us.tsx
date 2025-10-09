import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Platform,
  Image,
  Linking,
  TouchableOpacity,
} from "react-native";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import ToggleMenu from "./toggle-menu";

export default function ContactUs() {
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

      {/* Scrollable Content */}
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

        {/* Header Section */}
        <Text style={styles.title}>Contact Safe Space</Text>

        {/* Content Section */}
        <View style={styles.textContainer}>
          <Text style={styles.text}>
            If you have questions, need assistance, or want to report a concern,
            you can reach us safely through the following channels:
          </Text>

          {/* Email */}
          <TouchableOpacity
            style={styles.contactRow}
            onPress={() => handlePress("email", "sales@teketesafespace.co.za")}
          >
            <Ionicons name="mail" size={30} color="#c7da30" style={styles.icon} />
            <Text style={styles.contactText}>sales@teketesafespace.co.za</Text>
          </TouchableOpacity>

          {/* Phone */}
          <TouchableOpacity
            style={styles.contactRow}
            onPress={() => handlePress("phone", "0872656716")}
          >
            <Ionicons name="call" size={30} color="#c7da30" style={styles.icon} />
            <Text style={styles.contactText}>087 265 6716</Text>
          </TouchableOpacity>

          {/* Social Media */}
          <TouchableOpacity
            style={styles.contactRow}
            onPress={() => handlePress("url", "https://www.instagram.com/moepipublishing?utm_source=qr&igsh=MXB3dTVkcHBseXlyaA==")}
          >
            <FontAwesome5 name="instagram" size={30} color="#c7da30" style={styles.icon} />
            <Text style={styles.contactText}>moepipublishing</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.contactRow}
            onPress={() => handlePress("url", "https://www.facebook.com/moepiTechInstitute")}
          >
            <FontAwesome5 name="facebook" size={30} color="#c7da30" style={styles.icon} />
            <Text style={styles.contactText}>moepiTechInstitute</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.contactRow}
            onPress={() => handlePress("url", "https://x.com/moepipublishing?s=11")}
          >
            <FontAwesome5 name="twitter" size={30} color="#c7da30" style={styles.icon} />
            <Text style={styles.contactText}>@moepipublishing</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.contactRow}
            onPress={() => handlePress("url", "https://www.tiktok.com/@moepi_publishing")}
          >
            <FontAwesome5 name="tiktok" size={30} color="#c7da30" style={styles.icon} />
            <Text style={styles.contactText}>moepi_publishing</Text>
          </TouchableOpacity>

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
