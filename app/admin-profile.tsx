import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  Image,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons } from "@expo/vector-icons";

export default function AdminProfile() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [serverImage, setServerImage] = useState<string | null>(null); // store server URL
  const router = useRouter();

  const SERVER_URL = "http://localhost:3000"; // replace with your IP if testing on device

  useEffect(() => {
    const loadProfile = async () => {
      const token = await AsyncStorage.getItem("adminToken");
      if (!token) return Alert.alert("Error", "No token found");

      try {
        const res = await fetch(`${SERVER_URL}/admin-profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch profile");
        const data = await res.json();
        setName(data.name || "");
        setEmail(data.email || "");
        setUsername(data.username || "");
        setServerImage(data.profile_image ? `${SERVER_URL}${data.profile_image}` : null);
      } catch (err) {
        Alert.alert("Error", "Could not load profile");
      }
    };

    loadProfile();
  }, []);

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission required", "Permission to access gallery is needed.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
      allowsEditing: true,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    const token = await AsyncStorage.getItem("adminToken");
    if (!token) return Alert.alert("Error", "No token found");

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("username", username);

    if (imageUri) {
      const filename = imageUri.split("/").pop()!;
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : "image/jpeg";

      formData.append("profile_image", {
        uri: Platform.OS === "android" && !imageUri.startsWith("file://") ? "file://" + imageUri : imageUri,
        name: filename,
        type,
      } as any);
    }

    try {
      const res = await fetch(`${SERVER_URL}/admin-profile`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` }, // DO NOT set Content-Type manually
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        // Update serverImage so React Native can display the uploaded image
        setServerImage(data.profile_image ? `${SERVER_URL}${data.profile_image}` : null);
        setImageUri(null); // clear local preview
        Alert.alert("Success", "Profile updated successfully");
      } else {
        const data = await res.json();
        Alert.alert("Error", data.message || "Failed to update profile");
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Something went wrong");
    }
  };

  // Display either local image (selected) or server image
  const displayImage = imageUri ? imageUri : serverImage;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity style={styles.backBtn} onPress={() => router.push("/admin-dashboard")}>
        <MaterialIcons name="arrow-back" size={24} color="#CCDD45" />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>👤 Admin Profile</Text>

      <TouchableOpacity onPress={pickImage} style={styles.imageContainer}>
        {displayImage ? (
          <Image source={{ uri: displayImage }} style={styles.image} />
        ) : (
          <Text style={styles.imagePlaceholder}>Tap to select image</Text>
        )}
      </TouchableOpacity>

      <Text style={styles.label}>Full Name</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Enter full name" />

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Enter email"
        keyboardType="email-address"
      />

      <Text style={styles.label}>Username</Text>
      <TextInput style={styles.input} value={username} onChangeText={setUsername} placeholder="Enter username" />

      <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
        <Text style={styles.saveText}>Save Changes</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: "#f9fafc", padding: 20 },
  backBtn: { flexDirection: "row", alignItems: "center", marginBottom: 15 },
  backText: { color: "#CCDD45", fontSize: 16, fontWeight: "600", marginLeft: 6 },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 20, textAlign: "center", color: "#CCDD45" },
  label: { fontSize: 14, fontWeight: "600", marginTop: 12, marginBottom: 4, color: "#333" },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 12, fontSize: 14, backgroundColor: "#fff" },
  saveBtn: { backgroundColor: "#CCDD45", paddingVertical: 14, borderRadius: 8, marginTop: 30, alignItems: "center" },
  saveText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  imageContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 20,
  },
  image: { width: 120, height: 120, borderRadius: 60 },
  imagePlaceholder: { color: "#888" },
});
