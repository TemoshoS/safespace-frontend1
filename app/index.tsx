import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect, useRouter } from "expo-router";
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
/* ------------------------------------------ */

const { width, height } = Dimensions.get("window");

export default function Index() {
  const router = useRouter();
  const [showAd, setShowAd] = useState(false);
  const [adLoaded, setAdLoaded] = useState(false);

  // Retry timer reference
  const retryTimer = useRef<any>(null);

  // Prevent constant reload
  const lastRetryTime = useRef<number>(0);

  const loadAd = () => {
    setAdLoaded(false);
    setShowAd(true);
  };

  const scheduleRetry = () => {
    const now = Date.now();

    // Only retry if 30 seconds have passed since last retry
    if (now - lastRetryTime.current < 30000) return;

    lastRetryTime.current = now;

    if (retryTimer.current) clearTimeout(retryTimer.current);

    retryTimer.current = setTimeout(() => {
      loadAd();
    }, 30000); // retry every 30 seconds
  };

  /* Load Native Test Ad */
  useEffect(() => {
    const sub = AppState.addEventListener("change", (state) => {
      if (state === "active") {
        loadAd();
      }
    });
    return () => sub.remove();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      loadAd();
    }, [])
  );

   return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView

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

            onAdLoaded={() => {
              setAdLoaded(true);
            }}

            onAdFailedToLoad={() => {
              setAdLoaded(false);
              setShowAd(false);

              // retry only every 30 seconds
              scheduleRetry();
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