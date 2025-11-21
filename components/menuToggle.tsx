import React from "react";
import {
    Animated,
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity
} from "react-native";

const { width } = Dimensions.get("window");

interface MenuToggleProps {
  menuVisible: boolean;
  slideAnim: Animated.Value;
  onNavigate: (path: string) => void;
}

export default function MenuToggle({ menuVisible, slideAnim, onNavigate }: MenuToggleProps) {
  if (!menuVisible) return null;

  return (
    <Animated.View
      style={[styles.menuContainer, { transform: [{ translateX: slideAnim }] }]}
    >
      <TouchableOpacity onPress={() => onNavigate("/home")} style={styles.menuItem}>
        <Text style={styles.menuText}>Home</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => onNavigate("/reports")} style={styles.menuItem}>
        <Text style={styles.menuText}>Reports</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => onNavigate("/profile")} style={styles.menuItem}>
        <Text style={styles.menuText}>Profile</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  menuContainer: {
    position: "absolute",
    right: 0,
    top: 0,
    width: width * 0.7,
    height: "100%",
    backgroundColor: "#fff",
    paddingTop: 60,
    paddingHorizontal: 20,
    elevation: 8,
  },
  menuItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  menuText: {
    fontSize: 18,
    color: "#000",
  },
});
