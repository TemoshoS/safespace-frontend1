import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Image,
  ScrollView,
} from "react-native";
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import axios from "axios";
import { useLocalSearchParams } from "expo-router"; // ✅ Add this import

const BACKEND_URL = "http://192.168.43.10:3000";

export default function CaseTypeScreen() { // ✅ Remove route prop
  const { name, grade, contact } = useLocalSearchParams(); // ✅ Use this instead
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [description, setDescription] = useState(""); 

  const anonymous = name ? "no" : "yes"; // determines if report is anonymous

  const caseTypes = [
    { label: "Sexual Abuse", icon: "human-male-female" },
    { label: "Substance Abuse", icon: "bottle-wine" },
    { label: "Teenage Pregnancy", icon: "baby-carriage" },
    { label: "Weapon", icon: "pistol" },
    { label: "Bullying", icon: "account-group" },
  ];

  const toggleSelection = (type) => {
    if (selectedTypes.includes(type)) {
      setSelectedTypes(selectedTypes.filter((t) => t !== type));
    } else {
      setSelectedTypes([...selectedTypes, type]);
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post(`${BACKEND_URL}/reports`, {
        anonymous,
        name,
        grade,
        contact,
        selectedTypes,
        description,
      });
      console.log("Report saved:", response.data);
      alert("Report submitted successfully!");
    } catch (error) {
      console.error("Error submitting report:", error);
      alert("Failed to submit report");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Logo  */}
      <Image
        source={require("../assets/images/Logo.jpg")}
        style={styles.logo}
        resizeMode="contain"
      />

      {/* Title */}
      <Text style={styles.title}>Case Type</Text>

      {/* Subtitle */}
      <Text style={styles.subtitle}>Select the case type</Text>

      {/* Case Types */}
      <View style={styles.checkboxContainer}>
        {caseTypes.map((item, index) => {
          const isSelected = selectedTypes.includes(item.label);
          return (
            <TouchableOpacity
              key={index}
              style={styles.checkboxRow}
              onPress={() => toggleSelection(item.label)}
            >
              <View
                style={[
                  styles.checkbox,
                  isSelected && styles.checkboxSelected,
                ]}
              >
                {isSelected && (
                  <Icon name="check-bold" size={14} color="#fff" />
                )}
              </View>
              <Icon name={item.icon} size={22} color="#444" style={styles.icon} />
              <Text style={styles.checkboxLabel}>{item.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Description + Submit */}
      <Text style={styles.descriptionLabel}>Description (Optional)</Text>
      <View style={styles.row}>
        <TextInput
          style={styles.input}
          multiline
          placeholder="Type here..."
          placeholderTextColor="#aaa"
          value={description}                  
          onChangeText={setDescription}     
        />
        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
          <Text style={styles.submitText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#fff",
    paddingLeft: 0, // Ensure no padding on container
    marginLeft: 0, // Ensure no margin on container
  },
  logo: {
    width: 340,
    height: 150,
    marginTop: 40,
    marginLeft: -110,
    alignSelf: "flex-start"
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    marginTop: -20, // Adjusted to position relative to logo
    marginLeft: 20,
    marginRight:50, // Added left margin 
  },
  subtitle: {
    fontSize: 16,
    textAlign: "left", // Changed to left alignment
    marginBottom: 20,
    color: "#444",
    marginLeft: 100, // Added left margin 
    fontWeight: '500', // Semi-bold 
  },
  checkboxContainer: {
    marginBottom: 20,
    marginLeft: 20, // Added left margin to align with text
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    marginLeft:90,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 2,
    borderColor: "#999",
    borderRadius: 4,
    marginRight: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxSelected: {
    backgroundColor: "#6c63ff",
    borderColor: "#6c63ff",
  },
  icon: {
    marginRight: 10,
  },
  checkboxLabel: {
    fontSize: 16,
    color: "#222",
  },
  descriptionLabel: {
    fontSize: 14,
    marginBottom: 5,
    color: "#444",
    marginLeft: 20, // Added left margin to align with other elements
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginHorizontal: 20, // Added horizontal margin to align with other elements
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#aaa",
    borderRadius: 8,
    padding: 10,
    height: 80,
    textAlignVertical: "top",
  },
  submitBtn: {
    backgroundColor: "#0fa417ff",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
  submitText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
});

