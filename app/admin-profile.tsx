import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const IMAGE_KEY = "adminProfileImage"; // Key for AsyncStorage

export default function AdminProfile() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  // Load profile from backend + local image
  useEffect(() => {
    const loadProfile = async () => {
      const token = await AsyncStorage.getItem("adminToken");
      if (!token) return Alert.alert("Error", "No token found");

      try {
        setLoading(true);
        const res = await fetch("http://192.168.2.116:3000/admin-profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
          setName(data.name || "");
          setEmail(data.email || "");
          setUsername(data.username || "");
          setPhoneNumber(data.phoneNumber || "");
        } else {
          Alert.alert("Error", data.message || "Failed to fetch profile");
        }

        // Load saved image from AsyncStorage
        const savedImage = await AsyncStorage.getItem(IMAGE_KEY);
        if (savedImage) setImageUri(savedImage);
      } catch (err) {
        Alert.alert("Error", "Could not load profile");
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  // Pick image from gallery
  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted)
      return Alert.alert("Permission required", "Access to gallery needed.");

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      setImageUri(uri);
      await AsyncStorage.setItem(IMAGE_KEY, uri); // Save locally
    }
  };

  // Logout
  const handleLogout = async () => {
    await AsyncStorage.multiRemove(["adminToken", "adminUsername"]);
    Alert.alert("Logged out", "You have been logged out");
    router.push("/");
  };

  // Email & phone validation
  const isValidEmail = (email: string) => {
    const trimmed = email.trim().toLowerCase();
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
    return emailRegex.test(trimmed);
  };
  const isValidPhoneNumber = (phone: string) => /^[0-9]{10}$/.test(phone);

  const handleEmailChange = (text: string) => setEmail(text.trim());

  // Save profile (text fields + password)
  const handleSave = async () => {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedUsername = username.trim();
    const trimmedPhone = phoneNumber.trim();

    if (!trimmedEmail || !isValidEmail(trimmedEmail)) {
      return Alert.alert(
        "Error",
        "Please enter a valid email address (e.g. username@gmail.com)"
      );
    }

    if (trimmedPhone && !isValidPhoneNumber(trimmedPhone)) {
      return Alert.alert(
        "Error",
        "Invalid phone number format. Use 10 digits, e.g., 0791234567"
      );
    }

    if (newPassword || confirmPassword) {
      if (!currentPassword)
        return Alert.alert("Error", "Please enter your current password");
      if (newPassword !== confirmPassword)
        return Alert.alert("Error", "Passwords do not match");
    }

    const token = await AsyncStorage.getItem("adminToken");
    if (!token) return Alert.alert("Error", "No token found");

    const payload: any = {
      name: trimmedName,
      email: trimmedEmail,
      username: trimmedUsername,
      phoneNumber: trimmedPhone,
    };

    if (currentPassword && newPassword) {
      payload.currentPassword = currentPassword;
      payload.newPassword = newPassword;
    }

    try {
      setLoading(true);
      const res = await fetch("http://192.168.2.116:3000/admin-profile", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        setName(data.name);
        setEmail(data.email);
        setUsername(data.username);
        setPhoneNumber(data.phoneNumber || "");

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
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.screen}>
      {/* Header */}
      <View style={styles.header}>
        <Image
          source={require("../assets/images/Logo.jpg")}
          style={styles.logo}
          resizeMode="contain"
        />
        <TouchableOpacity
          onPress={() => setMenuOpen(!menuOpen)}
          style={styles.menuBtn}
        >
          <MaterialIcons name="menu" size={32} color="#c7da30" />
        </TouchableOpacity>
        {menuOpen && (
          <View style={styles.dropdown}>
            <TouchableOpacity
              onPress={() => {
                router.push("/admin-dashboard");
                setMenuOpen(false);
              }}
            >
              <Text style={styles.option}>Dashboard</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                router.push("/admin-home");
                setMenuOpen(false);
              }}
            >
              <Text style={styles.option}>Reports</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleLogout}>
              <Text style={styles.option}>Sign Out</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>My Profile</Text>
        {loading && <ActivityIndicator size="large" color="#c7da30" />}

        {/* Profile Image */}
        <View style={styles.profileSection}>
          <View style={styles.imageContainer}>
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={styles.image} />
            ) : (
              <Text style={styles.imagePlaceholder}>No Image</Text>
            )}
          </View>
          <View style={styles.profileRight}>
            <Text style={styles.updateText}>Update Profile Picture</Text>
            <TouchableOpacity style={styles.chooseBtn} onPress={pickImage}>
              <Text style={styles.chooseText}>Choose File</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Profile Fields */}
        <Text style={styles.label}>Full Name</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={handleEmailChange}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Username</Text>
        <TextInput style={styles.input} value={username} onChangeText={setUsername} />

        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          style={styles.input}
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="number-pad"
        />

        <Text style={styles.updatePassword}>Update Password</Text>

        <Text style={styles.label}>Old Password</Text>
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

        <TouchableOpacity
          onPress={() => setShowPassword(!showPassword)}
          style={{ marginTop: 10, marginBottom: 20 }}
        >
          <Text style={{ color: "#c7da30", textAlign: "center" }}>
            {showPassword ? "Hide Passwords" : "Show Passwords"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.saveBtn, loading && { opacity: 0.6 }]}
          onPress={handleSave}
          disabled={loading}
        >
          <Text style={styles.saveText}>Update</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

// Styles remain same as previous version
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#f9fafc", paddingTop: Platform.OS === "ios" ? 80 : 60 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 50 : 20,
    paddingBottom: 10,
    backgroundColor: "#fff",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  menuBtn: { padding: 8 },
  dropdown: {
    position: "absolute",
    top: Platform.OS === "ios" ? 90 : 70,
    right: 20,
    backgroundColor: "#c7da30",
    paddingVertical: 8,
    paddingHorizontal: 12,
    shadowColor: "#c7da30",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  option: { paddingVertical: 6, fontSize: 16, color: "#333" },
  logo: { width: 80, height: 80, borderRadius: 10 },
  container: { flexGrow: 1, padding: 20, paddingTop: 20 },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 20, textAlign: "center" },
  label: { fontSize: 14, fontWeight: "700", marginTop: 12, marginBottom: 4, color: "#333" },
  updatePassword: { fontWeight: "700", marginBottom: 10, marginTop: 10, textAlign: "center" },
  input: { borderWidth: 2, borderColor: "#c7da30", borderRadius: 8, padding: 12, fontSize: 14, backgroundColor: "#fff" },
  saveBtn: { backgroundColor: "#c7da30", paddingVertical: 14, alignSelf: "center", borderRadius: 30, marginTop: 10, alignItems: "center", width: "50%" },
  saveText: { color: "#464545ff", fontSize: 16 },
  imageContainer: { width: 120, height: 120, borderRadius: 60, backgroundColor: "#eee", justifyContent: "center", alignItems: "center", marginBottom: 20, overflow: "hidden" },
  image: { width: "100%", height: "100%", borderRadius: 60 },
  imagePlaceholder: { color: "#888" },
  profileSection: { flexDirection: "row", alignItems: "center", justifyContent: "center", marginBottom: 30, marginTop: 10 },
  profileRight: { marginLeft: 20, alignItems: "flex-start" },
  updateText: { fontWeight: "600", fontSize: 14, color: "#000", marginBottom: 8 },
  chooseBtn: { backgroundColor: "#c7da30", paddingVertical: 6, paddingHorizontal: 16, borderRadius: 4 },
  chooseText: { color: "#464545ff", fontWeight: "600" },
});
