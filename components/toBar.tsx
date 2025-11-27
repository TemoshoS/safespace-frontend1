import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Dimensions, Image, StyleSheet, TouchableOpacity, View } from "react-native";

const { width, height } = Dimensions.get("window");

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

          <Image
            source={require("../assets/images/Logo.jpg")}
            style={styles.logo}
            resizeMode="contain"
          />


          <TouchableOpacity onPress={onToggleMenu}>
            <Ionicons name="menu" size={width * 0.08} color="#c7da30" />
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: height * 0.05,
    marginBottom: height * 0.025,
    paddingHorizontal: width * 0.04,
    zIndex: 100,
  },
  logo: {
    width: width * 0.25,
    height: height * 0.1,
  },
});
