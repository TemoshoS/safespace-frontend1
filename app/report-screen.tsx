import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
} from "react-native";
import { useRouter } from "expo-router"; // ✅ Only Expo Router

const { width } = Dimensions.get("window");

export default function ReportCaseScreen() {
  const router = useRouter();
  const [anonymous, setAnonymous] = useState("no");
  const [name, setName] = useState("");
  const [grade, setGrade] = useState("");
  const [contact, setContact] = useState("");

  const handleNext = () => {
    // Navigate to case-type screen with parameters
    router.push({
      pathname: "/case-type",
      params: { 
        name: anonymous === "no" ? name : "",
        grade: anonymous === "no" ? grade : "",
        contact: anonymous === "no" ? contact : ""
      }
    });
  };

  return (
    <View style={styles.container}>
      {/* Logo */}
      <View style={styles.logoContainer}>
        <Image
          source={require("../assets/images/Logo.jpg")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* Title */}
      <Text style={styles.title}>Report Case</Text>

      {/* Question */}
      <Text style={styles.question}>Would you like to report anonymously?</Text>

      {/* Radio Buttons */}
      <View style={styles.radioRow}>
        <TouchableOpacity
          style={styles.radioOption}
          onPress={() => setAnonymous("yes")}
        >
          <View
            style={[
              styles.radioCircle,
              anonymous === "yes" && styles.selectedCircle,
            ]}
          />
          <Text style={styles.radioText}>Yes</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.radioOption}
          onPress={() => setAnonymous("no")}
        >
          <View
            style={[
              styles.radioCircle,
              anonymous === "no" && styles.selectedCircle,
            ]}
          />
          <Text style={styles.radioText}>No</Text>
        </TouchableOpacity>
      </View>

      {/* Info text */}
      {anonymous === "no" && (
        <Text style={styles.infoText}>If No, please fill in the following</Text>
      )}

      {/* Form */}
      {anonymous === "no" && (
        <View style={styles.formContainer}>
          <Text style={styles.label}>
            Name<Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Input name"
            value={name}
            onChangeText={setName}
          />

          <Text style={styles.label}>
            Grade<Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Input grade"
            value={grade}
            onChangeText={setGrade}
          />

          <Text style={styles.label}>
            Contact<Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Input contact"
            value={contact}
            onChangeText={setContact}
          />
        </View>
      )}

      {/* Next Button */}
      <TouchableOpacity style={styles.button} onPress={handleNext}>
        <Text style={styles.buttonText}>Next</Text>
        <Text style={styles.arrow}>{">"}</Text>
      </TouchableOpacity>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    padding: 20,
    paddingTop: 10,
  },
  logoContainer: {
    justifyContent: "flex-start",
    alignItems: "flex-start",
    paddingLeft: 0,
    marginLeft: 0,
    width: "100%",
    marginTop: 5,
  },
  logo: {
    width: 350,
    height: 200,
    marginTop: 10,
    marginLeft: -125,
    alignSelf: "flex-start",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginVertical: 15,
    textAlign: "center",
  },
  question: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  radioRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginBottom: 25,
  },
  radioOption: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
  },
  radioCircle: {
    height: 18,
    width: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: "#000",
    marginRight: 6,
  },
  selectedCircle: {
    backgroundColor: "#000",
  },
  radioText: {
    fontSize: 16,
  },
  infoText: {
    fontSize: 14,
    marginLeft: 5,
    marginBottom: 0,
    color: "#333",
    fontWeight: "500",
  },
  formContainer: {
    marginTop: 8,
    marginLeft: 40,
    marginRight: 20,
    width: width - 120 - 20,
  },
  label: {
    fontSize: 15,
    marginTop: 0,
  },
  required: {
    color: "red",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,
    marginTop: 4,
    marginLeft: 0,
    width: "95%",
  },
  button: {
    marginTop: 20,
    backgroundColor: "#24ae1aff",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: width * 0.5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 6,
  },
  arrow: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
