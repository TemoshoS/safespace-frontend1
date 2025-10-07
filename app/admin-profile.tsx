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
  const [serverImage, setServerImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const router = useRouter();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // ✅ toggle state

  const SERVER_URL = "http://localhost:3000";

  // Load profile...
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
        if (data.profile_image) {
          setServerImage(Platform.OS === "web" ? `${SERVER_URL}${data.profile_image}` : data.profile_image);
        }
      } catch (err) {
        Alert.alert("Error", "Could not load profile");
      }
    };
    loadProfile();
  }, []);

  // Pick Image...
  const pickImage = async () => {
    if (Platform.OS === "web") {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.onchange = () => {
        if (input.files && input.files[0]) {
          setImageUri(URL.createObjectURL(input.files[0]));
          setSelectedFile(input.files[0]);
        }
      };
      input.click();
      return;
    }

    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return Alert.alert("Permission required", "Access gallery needed.");

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      setSelectedFile(result.assets[0]);
    }
  };

  // Save profile...
  const handleSave = async () => {
    const token = await AsyncStorage.getItem("adminToken");
    if (!token) return Alert.alert("Error", "No token found");

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("username", username);

    if (selectedFile) {
      if (Platform.OS === "web") {
        formData.append("profile_image", selectedFile, selectedFile.name);
      } else {
        const uri = selectedFile.uri;
        const filename = uri.split("/").pop()!;
        const type = selectedFile.type || `image/${filename.split(".").pop()}`;
        formData.append("profile_image", { uri, name: filename, type } as any);
      }
    }

    if (currentPassword && newPassword && confirmPassword) {
      if (newPassword !== confirmPassword) {
        return Alert.alert("Error", "New passwords do not match");
      }
      formData.append("currentPassword", currentPassword);
      formData.append("newPassword", newPassword);
    }

    try {
      const res = await fetch(`${SERVER_URL}/admin-profile`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setName(data.name);
        setEmail(data.email);
        setUsername(data.username);
        if (data.profile_image) {
          setServerImage(Platform.OS === "web" ? `${SERVER_URL}${data.profile_image}` : data.profile_image);
        }
        setImageUri(null);
        setSelectedFile(null);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        Alert.alert("Success", "Profile updated successfully");
      } else {
        Alert.alert("Error", data.message || "Failed to update profile");
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Something went wrong");
    }
  };

  const displayImage = imageUri ? imageUri : serverImage;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity style={styles.backBtn} onPress={() => router.push("/admin-dashboard")}>
        <MaterialIcons name="arrow-back" size={24} color="#c7da30" />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>My Profile</Text>

      <TouchableOpacity onPress={pickImage} style={styles.imageContainer}>
        {displayImage ? (
          <Image source={{ uri: displayImage }} style={styles.image} />
        ) : (
          <Text style={styles.imagePlaceholder}>Tap to select image</Text>
        )}
      </TouchableOpacity>

      <Text style={styles.label}>Full Name</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} />

      <Text style={styles.label}>Email</Text>
      <TextInput style={styles.input} value={email} onChangeText={setEmail}  keyboardType="email-address" />

      <Text style={styles.label}>Username</Text>
      <TextInput style={styles.input} value={username} onChangeText={setUsername}  />
      <Text style={styles.updatePassword}>Update Password</Text>

      {/* Password Fields */}
      <Text style={styles.label}>Current Password</Text>
      <TextInput
        style={styles.input}
        value={currentPassword}
        onChangeText={setCurrentPassword}
       
        secureTextEntry={!showPassword}
      />

      <Text style={styles.label}>New Password</Text>
      <TextInput
        style={styles.input}
        value={newPassword}
        onChangeText={setNewPassword}
        
        secureTextEntry={!showPassword}
      />

      <Text style={styles.label}>Confirm New Password</Text>
      <TextInput
        style={styles.input}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
    
        secureTextEntry={!showPassword}
      />

      {/* ✅ Toggle Password Visibility */}
      <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={{ marginTop: 10, marginBottom: 20 }}>
        <Text style={{ color: "#c7da30", textAlign: "center" }}>
          {showPassword ? "Hide Passwords" : "Show Passwords"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
        <Text style={styles.saveText}>Update Profile</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: "#f9fafc", padding: 20 },
  backBtn: { flexDirection: "row", alignItems: "center", marginBottom: 15 },
  backText: { color: "#c7da30", fontSize: 16, fontWeight: "600", marginLeft: 6 },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 20, textAlign: "center", },
  label: { fontSize: 14, fontWeight: "700", marginTop: 12, marginBottom: 4, color: "#333" },
  updatePassword: {  fontWeight: "700", marginBottom: 10, marginTop: 10,textAlign: "center",},
  input: { borderWidth: 2, borderColor: "#c7da30", borderRadius: 8, padding: 12, fontSize: 14, backgroundColor: "#fff" },
  saveBtn: { backgroundColor: "#c7da30", paddingVertical: 14, borderRadius: 8, marginTop: 20, alignItems: "center" },
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
  image: { width: 120, height: 120, borderRadius: 50 },
  imagePlaceholder: { color: "#888" },
});
