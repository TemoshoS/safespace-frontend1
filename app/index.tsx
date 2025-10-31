import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
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
  findNodeHandle,
} from "react-native";
import ToggleMenu from "./toggle-menu";

export default function Index() {
  const router = useRouter();
  const scrollRef = useRef<ScrollView>(null);

  // Refs for About Us & Contact Us sections
  const aboutRef = useRef<View>(null);
  const contactRef = useRef<View>(null);

  // Function to scroll to section
  const scrollToSection = (ref: React.RefObject<View>) => {
    if (ref.current && scrollRef.current) {
      ref.current.measureLayout(
        findNodeHandle(scrollRef.current) as number,
        (x, y) => {
          scrollRef.current?.scrollTo({ y: y, animated: true });
        },
        () => {}
      );
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* Toggle menu (hamburger) */}
      <ToggleMenu
        onNavigate={(section) => {
          if (section === "about") scrollToSection(aboutRef);
          if (section === "contact") scrollToSection(contactRef);
        }}
      />

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

        {/* About Us Section */}
        <View ref={aboutRef} style={styles.aboutSection}>
          <Text style={styles.aboutTitle}>About Us</Text>
          <Text style={styles.aboutParagraph}>
            A confidential platform designed to protect and empower learners
            and employees to speak out - with the option to report anonymously.
          </Text>

          <Text style={styles.aboutParagraph}>
            Your voice matters. Your identity is protected. Whether you choose
            to report with your name or anonymously, Safe Space by Moepi Publishing
            ensures every report is handled with confidentiality and urgency.
          </Text>

          <Text style={styles.aboutSubtitle}>
            You can report any of the following through Safe Space:
          </Text>

          <Text style={styles.aboutList}>
            • Bullying{"\n"}
            • Substance Abuse{"\n"}
            • Sexual abuse or Harassment{"\n"}
            • Weapons{"\n"}
            • Teenage Pregnancy{"\n"}
            • Other issues
          </Text>
        </View>

        {/* Contact Us Section */}
        <View ref={contactRef} style={styles.aboutSection}>
          <Text style={styles.aboutTitle}>Contact Us</Text>

          <Text style={styles.aboutParagraph}>
            If you have questions, need assistance, or want to report a concern,
            you can reach us safely through the following channels:
          </Text>

          {/* Email */}
          <TouchableOpacity
            style={styles.contactRow}
            onPress={() => {
              const mailto = "sales@teketesafespace.co.za";
              router.push(`mailto:${mailto}`);
            }}
          >
            <FontAwesome5 name="envelope" size={20} color="#c7da30" style={{ marginRight: 10 }} />
            <Text style={styles.contactText}>sales@teketesafespace.co.za</Text>
          </TouchableOpacity>

          {/* Phone */}
          <TouchableOpacity
            style={styles.contactRow}
            onPress={() => {
              const tel = "0872656716";
              router.push(`tel:${tel}`);
            }}
          >
            <FontAwesome5 name="phone" size={20} color="#c7da30" style={{ marginRight: 10 }} />
            <Text style={styles.contactText}>087 265 6716</Text>
          </TouchableOpacity>

          {/* Social Media */}
          <TouchableOpacity
            style={styles.contactRow}
            onPress={() =>
              router.push(
                "https://www.instagram.com/moepipublishing?utm_source=qr&igsh=MXB3dTVkcHBseXlyaA=="
              )
            }
          >
            <FontAwesome5 name="instagram" size={20} color="#c7da30" style={{ marginRight: 10 }} />
            <Text style={styles.contactText}>moepipublishing</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.contactRow}
            onPress={() =>
              router.push("https://www.facebook.com/moepiTechInstitute")
            }
          >
            <FontAwesome5 name="facebook" size={20} color="#c7da30" style={{ marginRight: 10 }} />
            <Text style={styles.contactText}>moepiTechInstitute</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.contactRow}
            onPress={() => router.push("https://x.com/moepipublishing?s=11")}
          >
            <FontAwesome5 name="twitter" size={20} color="#c7da30" style={{ marginRight: 10 }} />
            <Text style={styles.contactText}>@moepipublishing</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.contactRow}
            onPress={() => router.push("https://www.tiktok.com/@moepi_publishing")}
          >
            <FontAwesome5 name="tiktok" size={20} color="#c7da30" style={{ marginRight: 10 }} />
            <Text style={styles.contactText}>moepi_publishing</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

export const options = { headerShown: false };

// Styles remain the same + added contact/about styling reused from original files
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
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
    justifyContent: "center",
  },
  contactText: {
    fontSize: 20,
    color: "#545454",
    fontWeight: "600",
    textAlign: "center",
  },
});
