import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";

interface TopBarProps {
  menuVisible: boolean;
  onBack: () => void;
  onToggleMenu: () => void;
}

export default function TopBar({ menuVisible, onBack, onToggleMenu }: TopBarProps) {
  return (
    <View style={styles.topBar}>
      {!menuVisible && (
        <>
          <TouchableOpacity onPress={onBack}>
            <Image
              source={require("../assets/images/Logo.jpg")}
              style={styles.logo}
              resizeMode="contain"
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={onToggleMenu}>
            <Ionicons name="menu" size={30} color="#c7da30" />
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: "#fff",
  },
  logo: {
    width: 120,
    height: 40,
  },
});
