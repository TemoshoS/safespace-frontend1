import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Animated,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

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
              colors={["#c7da30", "#b8d020"]}
              style={styles.gradientButton}
              start={[0, 0]}
              end={[1, 1]}
            >
              <Text style={styles.choiceText}>Yes</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => handleSelect("no")}>
            <LinearGradient
              colors={["#c7da30", "#b8d020"]}
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
        <TouchableOpacity style={styles.menuItem} onPress={() => navigate("/")}>
          <Text style={styles.menuText}>Home</Text>
        </TouchableOpacity>
        
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
    borderWidth: 1,
    padding: 20,
    borderRadius: 10,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 20,
  },
  gradientButton: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    minWidth: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  choiceText: {
    color: "#000",
    fontSize: 16,
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
    backgroundColor: "#c7da30",
    paddingTop: 100,
    paddingHorizontal: 20,
    zIndex: 10,
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
    fontSize: 18,
    color: "#333",
  },

});
