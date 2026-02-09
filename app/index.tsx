import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
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
import {
  BannerAd,
  BannerAdSize,
  TestIds,
} from "react-native-google-mobile-ads";

/* ---------- SAFE GOOGLE ADS SETUP ---------- */
let NativeAdView: any = null;
let NativeAsset: any = null;
let NativeMediaView: any = null;
let NativeAd: any = null;

const isNative = Platform.OS === "android" || Platform.OS === "ios";

if (isNative) {
  try {
    const ads = require("react-native-google-mobile-ads") as any;
    NativeAdView = ads.NativeAdView;
    NativeAsset = ads.NativeAsset;
    NativeMediaView = ads.NativeMediaView;
    NativeAd = ads.NativeAd;
  } catch (e) {
    // Expo Go safe fallback
  }
}
/* ------------------------------------------ */

const { width, height } = Dimensions.get("window");

export default function Index() {
  const router = useRouter();
  const scrollRef = useRef<ScrollView>(null);
  const [nativeAd, setNativeAd] = useState<any>(null);

  /* Load Native Test Ad */
  useEffect(() => {
    if (NativeAd) {
      NativeAd.createForAdRequest(TestIds.NATIVE, {
        requestNonPersonalizedAdsOnly: true,
      })
        .then(setNativeAd)
        .catch(() => {});
    }
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

          {/* Native TEST Ad */}
          {nativeAd && NativeAdView && (
            <NativeAdView nativeAd={nativeAd} style={styles.adContainer}>
              <NativeMediaView style={styles.adMedia} />

              <View style={styles.adContent}>
                <NativeAsset assetType="headline">
                  <Text style={styles.adHeadline} />
                </NativeAsset>

                <NativeAsset assetType="body">
                  <Text style={styles.adBody} />
                </NativeAsset>

                <NativeAsset assetType="callToAction">
                  <View style={styles.ctaButton}>
                    <Text style={styles.ctaText} />
                  </View>
                </NativeAsset>
              </View>
            </NativeAdView>
          )}

          {/* Buttons */}
          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={styles.buttonWrapper}
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

          {/* TEST Banner Ad */}
          <View style={styles.bannerAdContainer}>
            <BannerAd
              unitId={TestIds.BANNER}
              size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
              requestOptions={{
                requestNonPersonalizedAdsOnly: true,
              }}
            />
          </View>
        </View>
      </ScrollView>
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
    justifyContent: "space-between",
    gap: 10,
    paddingHorizontal: 10,
  },

  buttonWrapper: {
    flex: 1,
    maxWidth: "48%",
  },

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
  },

  bannerAdContainer: {
    width: "100%",
    alignItems: "center",
    marginTop: height * 0.02,
    marginBottom: height * 0.01,
  },
});
