import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
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

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>

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
            resizeMode="cover"
          />

          {/* Action Buttons */}
          <View style={styles.buttonsContainer}>
            <LinearGradient
              colors={["#c7da30", "#d7e47a"]}
              style={styles.gradientButton}
            >
              <TouchableOpacity
                style={styles.buttonContent}
                activeOpacity={0.8}
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
                activeOpacity={0.8}
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

        
      </ScrollView>
    </View>
  );
}

export const options = { headerShown: false };

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#FFFFFF",
    paddingBottom: 60,
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
  gradientButton: {
    width: "90%",
    borderRadius: 30,
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
    fontSize: 15,
    color: "#545454",
    fontFamily:
      Platform.OS === "web"
        ? `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif`
        : "System",
    marginLeft: 10,
  },
  aboutSection: {
    flexDirection: "column",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 40,
  },
  aboutImage: {
    width: "90%",
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  aboutTextContainer: {
    alignItems: "center",
  },
  aboutTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: "#545454",
    marginBottom: 10,
    textAlign: "center",
  },
  aboutParagraph: {
    fontSize: 16,
    color: "#000",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 22,
  },
  aboutSubtitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#545454",
    textAlign: "center",
    marginBottom: 10,
  },
  aboutList: {
    fontSize: 15,
    color: "#000",
    textAlign: "center",
    marginBottom: 40,
  },
  footer: {
    backgroundColor: "#808080",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 25,
    paddingHorizontal: 15,
  },
  footerText: {
    color: "#fff",
    fontSize: 15,
    textAlign: "center",
    marginBottom: 5,
  },
  copyright: {
    color: "#fff",
    fontSize: 14,
    textAlign: "center",
  },
});
