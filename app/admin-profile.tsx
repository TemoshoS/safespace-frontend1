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
  ActivityIndicator,
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
  const [loading, setLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();
  const BACKEND_URL =
  Platform.OS === "web"
    ? "http://localhost:3000"     // ✅ Web browser
    : Platform.OS === "android"
    ? "http://10.0.2.2:3000"      // ✅ Android emulator
    : "http://192.168.2.116:3000" // ✅ iOS sim or Physical Device


  useEffect(() => {
    const loadProfile = async () => {
      const token = await AsyncStorage.getItem("adminToken");
      if (!token) return Alert.alert("Error", "No token found");

      try {
        setLoading(true);
        const res = await fetch(`${BACKEND_URL}/admin-profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
          setName(data.name || "");
          setEmail(data.email || "");
          setUsername(data.username || "");
          if (data.profile_image) {
            setServerImage(
              Platform.OS === "web"
                ? `${BACKEND_URL}${data.profile_image}`
                : data.profile_image
            );
          }
        } else {
          Alert.alert("Error", data.message || "Failed to fetch profile");
        }
      } catch (err) {
        Alert.alert("Error", "Could not load profile");
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

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
    if (!permission.granted)
      return Alert.alert("Permission required", "Access to gallery needed.");

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
  const handleLogout = async () => {
    await AsyncStorage.multiRemove(['adminToken', 'adminUsername']);
    Alert.alert('Logged out', 'You have been logged out');
    router.push('/');
  };

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
      setLoading(true);
      const res = await fetch(`${BACKEND_URL}/admin-profile`, {
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
          setServerImage(
            Platform.OS === "web"
              ? `${BACKEND_URL}${data.profile_image}`
              : data.profile_image
          );
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
    } finally {
      setLoading(false);
    }
  };

  const displayImage = imageUri ? imageUri : serverImage;

  return (
    <View style={styles.screen}>
      {/* Header with Logo + Menu */}
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

        <View style={styles.profileSection}>
          <TouchableOpacity onPress={pickImage} style={styles.imageContainer}>
            {displayImage ? (
              <Image source={{ uri: displayImage }} style={styles.image} />
            ) : (
              <Text style={styles.imagePlaceholder}>No Image</Text>
            )}
          </TouchableOpacity>

          <View style={styles.profileRight}>
            <Text style={styles.updateText}>Update Profile Picture</Text>
            <TouchableOpacity style={styles.chooseBtn} onPress={pickImage}>
              <Text style={styles.chooseText}>Choose File</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.label}>Full Name</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

        <Text style={styles.label}>Username</Text>
        <TextInput style={styles.input} value={username} onChangeText={setUsername} />

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

        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveText}>Update</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f9fafc",
    paddingTop: Platform.OS === "ios" ? 80 : 60,
  },
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
  saveBtn: { backgroundColor: "#c7da30", paddingVertical: 14,  alignSelf: "center", borderRadius: 30, marginTop: 10, alignItems: "center" , width:"50%"},
  saveText: { color: "#464545ff", fontSize: 16},
  imageContainer: { width: 120, height: 120, borderRadius: 60, backgroundColor: "#eee", justifyContent: "center", alignItems: "center", marginBottom: 20 },
  image: { width: 120, height: 120, borderRadius: 60 },
  imagePlaceholder: { color: "#888" },
  profileSection: { flexDirection: "row", alignItems: "center", justifyContent: "center", marginBottom: 30, marginTop: 10 },
  profileRight: { marginLeft: 20, alignItems: "flex-start" },
  updateText: { fontWeight: "600", fontSize: 14, color: "#000", marginBottom: 8 },
  chooseBtn: { backgroundColor: "#c7da30", paddingVertical: 6, paddingHorizontal: 16, borderRadius: 4 },
  chooseText: { color: "#464545ff", fontWeight: "600" },
});
