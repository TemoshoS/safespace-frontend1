import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";

export default function ReportCaseScreen() {
  const router = useRouter();
  const [anonymous, setAnonymous] = useState("no");

  const handleSelect = (choice: string) => {
    setAnonymous(choice);
    router.push({
      pathname: "/abuse-types",
      params: { anonymous: choice },
    });
  };

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image
        source={require("../assets/images/Logo.jpg")}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.title}>Report Case</Text>
      <Text style={styles.question}>Would you like to report anonymously?</Text>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[
            styles.choiceButton,
            anonymous === "yes" && styles.selectedButton,
          ]}
          onPress={() => handleSelect("yes")}
        >
          <Text style={styles.choiceText}>Yes</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.choiceButton,
            anonymous === "no" && styles.selectedButton,
          ]}
          onPress={() => handleSelect("no")}
        >
          <Text style={styles.choiceText}>No</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  logo: { width: 350, height: 200, marginTop: 10, marginLeft: -125 },
  title: { fontSize: 22, fontWeight: "bold", marginVertical: 15 },
  question: { fontSize: 16, textAlign: "center", marginBottom: 20 },
  buttonRow: { flexDirection: "row", justifyContent: "center", gap: 15 },
  choiceButton: {
    borderWidth: 1,
    borderColor: "#24ae1a",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  selectedButton: { backgroundColor: "#24ae1a11" },
  choiceText: { fontSize: 16, color: "#24ae1a", fontWeight: "600" },
});
