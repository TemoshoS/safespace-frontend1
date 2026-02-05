import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  AppState,
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

/* ---------- GOOGLE ADS SETUP ---------- */
let BannerAd: any = null;
let BannerAdSize: any = null;

const isNative = Platform.OS === "android" || Platform.OS === "ios";

if (isNative) {
  try {
    const ads = require("react-native-google-mobile-ads");
    BannerAd = ads.BannerAd;
    BannerAdSize = ads.BannerAdSize;
  } catch {}
}
/* ------------------------------------- */

const { width, height } = Dimensions.get("window");

export default function Index() {
  const router = useRouter();
  const scrollRef = useRef<ScrollView>(null);
  const [showAd, setShowAd] = useState(false);

  // Initial delayed load
  useEffect(() => {
    const t = setTimeout(() => setShowAd(true), 1200);
    return () => clearTimeout(t);
  }, []);

  // Reload ad when app becomes active (midnight / resume fix)
  useEffect(() => {
    const sub = AppState.addEventListener("change", state => {
      if (state === "active") {
        setShowAd(false);
        setTimeout(() => setShowAd(true), 600);
      }
    });
    return () => sub.remove();
  }, []);

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
            <TouchableOpacity
              style={styles.buttonWrapper}
              activeOpacity={0.8}
              onPress={() => router.push("/report-screen")}
            >
              <LinearGradient
                colors={["#FFFFFF", "#FFFFFF"]}
                style={styles.gradientButton}
              >
                <Text style={styles.choiceText}>Report Now</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.buttonWrapper}
              activeOpacity={0.8}
              onPress={() => router.push("/check-status")}
            >
              <LinearGradient
                colors={["#FFFFFF", "#FFFFFF"]}
                style={styles.gradientButton}
              >
                <Text style={styles.choiceText}>Check Status</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
       {/* Banner Ad */}
       {BannerAd && showAd && (
        <View style={styles.bannerWrapper}>
          <BannerAd
            unitId="ca-app-pub-3359117038124437/3952350421"
            size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}

            onAdFailedToLoad={() => {
              // retry after failure (important at night)
              setTimeout(() => setShowAd(true), 3000);
            }}
            requestOptions={{
              requestNonPersonalizedAdsOnly: true,
            }}
          />
        </View>
      )}

    </SafeAreaView>
  );
}

/* -------------------- STYLES -------------------- */

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

  logo: {
    width: width * 0.35,
    height: width * 0.35,
  },

  logoWrapper: {
    width: "100%",
    alignItems: "flex-start",
    paddingLeft: width * 0.08,
  },

  heroImage: {
    width: "100%",
    height: height * 0.45,
    alignSelf: "center",
    marginBottom: 20,
  },

  adContainer: {
    width: "100%",
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 30,
  },

  adMedia: {
    width: "100%",
    height: 180,
  },

  adContent: {
    padding: 12,
  },

  adHeadline: {
    fontSize: 16,
    fontWeight: "600",
  },

  adBody: {
    fontSize: 13,
    color: "#555",
    marginVertical: 6,
  },

  ctaButton: {
    alignSelf: "flex-start",
    backgroundColor: "#1aaed3ff",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 6,
    marginTop: 6,
  },

  ctaText: {
    color: "#fff",
    fontWeight: "600",
  },

  buttonsContainer: {
    width: "100%",
    flexDirection: "row",
    gap: 10,
  },

  buttonWrapper: {
    flex: 1,
    maxWidth: "48%",
    
  },

  gradientButton: {
    paddingVertical: height * 0.015,
    borderRadius: 255,
    borderWidth: 2,
    borderColor: "#c7da30",
    alignItems: "center",
  },

  choiceText: {
    color: "#1aaed3ff",
    fontSize: width * 0.04,
    fontWeight: "bold",
  },

  bannerWrapper: {
    width: "100%",
    alignItems: "center",
    paddingVertical: 8,
    backgroundColor: "#fff",
  },
});

