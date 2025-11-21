import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

export default function ReportCaseScreen() {
  const router = useRouter();
  const [menuVisible, setMenuVisible] = useState(false);
  const slideAnim = useState(new Animated.Value(width))[0];

  const handleSelect = (choice: string) => {
    router.push({
      pathname: "/abuse-types",
      params: { anonymous: choice },
    });
  };

  const toggleMenu = () => {
    if (menuVisible) {
      Animated.timing(slideAnim, {
        toValue: width,
        duration: 250,
        useNativeDriver: true,
      }).start(() => setMenuVisible(false));
    } else {
      setMenuVisible(true);
      Animated.timing(slideAnim, {
        toValue: width * 0.3,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  };

  const navigate = (path: string) => {
    toggleMenu();
    setTimeout(() => {
      router.push({ pathname: path as any });
    }, 250);
  };

  return (
    <View style={styles.container}>
      {/* Top bar: logo and menu icon */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()}>
          <Image
            source={require('../assets/images/Logo.jpg')}
            style={styles.logo}
            resizeMode="contain"
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={toggleMenu}>
          <Ionicons name="menu" size={30} color="#c7da30" />
        </TouchableOpacity>
      </View>

      {/* Centered content */}
      <View style={styles.centerContent}>
        <Text style={styles.questionText}>REPORT ANONYMOUSLY?</Text>

        <View style={styles.conditionBox}>
          <View style={styles.buttonRow}>
            <TouchableOpacity onPress={() => handleSelect("yes")}>
              <LinearGradient
                colors={["#FFFFFF", "#FFFFFF"]}
                style={styles.gradientButton}
                start={[0, 0]}
                end={[1, 1]}
              >
                <Text style={styles.choiceText}>Yes</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => handleSelect("no")}>
              <LinearGradient
                colors={["#FFFFFF", "#FFFFFF"]}
                style={styles.gradientButton}
                start={[0, 0]}
                end={[1, 1]}
              >
                <Text style={styles.choiceText}>No</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Slide-in menu from right */}
      {menuVisible && (
        <TouchableOpacity style={styles.overlay} onPress={toggleMenu} />
      )}
      <Animated.View style={[styles.menu, { transform: [{ translateX: slideAnim }] }]}>
        {/* Close button centered at the top of the menu */}
        <View style={styles.closeButtonContainer}>
          <TouchableOpacity onPress={toggleMenu} style={styles.closeButton}>
            <Ionicons name="close" size={50} color="#c7da30" />
          </TouchableOpacity>
        </View>

        <View style={styles.menuContent}>
          {/* Home button with centered text */}
          <TouchableOpacity style={styles.menuItem} onPress={() => navigate("/")}>
            <Text style={[styles.menuText, styles.homeText]}>Home</Text>
          </TouchableOpacity>
          {/* Report button with shadow */}
          <TouchableOpacity style={[styles.menuItem, styles.reportItem]} onPress={() => navigate("/report-screen")}>
            <Text style={[styles.menuText, styles.reportText]}>Report</Text>
          </TouchableOpacity>
          {/* Check Status button with separate styling */}
          <TouchableOpacity style={[styles.menuItem, styles.checkStatusItem]} onPress={() => navigate("/check-status")}>
            <Text style={[styles.menuText, styles.checkStatusText]}>Check Status</Text>
          </TouchableOpacity>
          {/* Back button with separate styling */}
          <TouchableOpacity style={[styles.menuItem, styles.backItem]} onPress={() => navigate("/")}>
            <Text style={[styles.menuText, styles.backText]}>Back</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
  },
  logo: {
    width: 100,
    height: 100,
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  questionText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 40,
    textAlign: "center",
    color: "#000",
  },
  conditionBox: {
    borderColor: '#c7da30',
    borderWidth: 2,
    padding: 20,
    borderRadius: 10,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 40,
    justifyContent: "center",
  },
  gradientButton: {
    paddingVertical: 8,
    paddingHorizontal: 30,
    borderRadius: 255,
    minWidth: 120,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "#c7da30",
  },
  choiceText: {
    color: "#1aaed3ff",
    fontSize: 18,
    fontWeight: "bold",
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 40,
    paddingHorizontal: 10,
  },
  menu: {
    position: "absolute",
    top: 0,
    right: 0,
    width: width * 0.7,
    height: "100%",
    backgroundColor: "#FFFFFF",
    zIndex: 10,
  },
  // Close button container to center it
  closeButtonContainer: {
    position: "absolute",
    top: 40,
    left: 0,
    right: 120,
    alignItems: "center",
    zIndex: 11,
  },
  closeButton: {
    padding: 10,
  },
  menuContent: {
    marginTop: 120,
    paddingHorizontal: 20,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.3)",
    zIndex: 5,
  },
  menuItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#fff",
  },
  menuText: {
    alignItems:"center",
    fontSize: 20,
    //  paddingLeft: 15,
    color: "#91cae0ff",
  },
   homeText: {
    paddingLeft: 30,
    fontSize: 20,
  },
  // Report item with shadow
  reportItem: {
    paddingLeft: 30,
    borderRadius: 25,
    width: '55%',
  paddingVertical: 4, // This won't affect text alignment
  justifyContent: 'center', 
    // width: '55%',
    // height:40,
    backgroundColor: "#87CEEB",  // Blue border color
  },
  reportText:{
     color:"white",
     fontSize: 20,
  },
   checkStatusItem: {
    paddingLeft: 10, // Starts a bit later than the others
  },
   checkStatusText: {
    fontSize: 20,
  },
   backItem: {
    paddingLeft: 35, // Adjust this value as needed
  },
  backText: {
    fontSize: 20,
    // Add any other styles you want for Back text
  },
});