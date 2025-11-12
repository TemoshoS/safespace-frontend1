import axios from "axios";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import {
  Animated,
  Dimensions,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Video } from "expo-av";
import { BACKEND_URL } from "@/utils/config";
const { width } = Dimensions.get("window");

export default function DetailsScreen() {
 

  const router = useRouter();
  const params = useLocalSearchParams();
  const anonymous = params.anonymous;

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [menuVisible, setMenuVisible] = useState(false);
  const slideAnim = useState(new Animated.Value(width))[0];

  const toggleMenu = () => {
    if (menuVisible) {
      Animated.timing(slideAnim, {
        toValue: width,
        duration: 250,
        useNativeDriver: true,
      }).start(() => setMenuVisible(false));
    } else {
      setMenuVisible(true);
      Animated.timing(slideAnim, {
        toValue: width * 0.3,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  };

  const handleNavigate = (path: string) => {
    toggleMenu();
    setTimeout(() => {
      router.push({ pathname: path as any });
    }, 250);
  };

  const getStatusColor = (status: string) => {
    const normalizedStatus = status.trim().toLowerCase();
    switch (normalizedStatus) {
      case "pending":
        return "#EF4444";
      case "escalated":
        return "#FACC15";
      case "in-process":
        return "#3B82F6";
      case "resolved":
        return "#22C55E";
      case "unresolved":
        return "#FB923C";
      case "false-report":
        return "#9CA3AF";
      default:
        return "#E5E7EB";
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setError("Please enter a case number");
      return;
    }

    setLoading(true);
    setError("");
    setSearchResult(null);

    try {
      const res = await axios.get(`${BACKEND_URL}/reports/case/${searchQuery}`);
      setSearchResult(res.data);
    } catch (err: any) {
      console.error(err);
      if (err.response?.status === 404) {
        setError("Case not found");
      } else {
        setError("Failed to fetch case. Check backend/network.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Top bar: logo + menu */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()}>
          <Image
            source={require("../assets/images/Logo.jpg")}
            style={styles.logo}
            resizeMode="contain"
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={toggleMenu}>
          <Ionicons name="menu" size={30} color="#c7da30" />
        </TouchableOpacity>
      </View>

      {anonymous === "yes" && (
        <Text style={styles.anonymousText}>You’re reporting anonymously</Text>
      )}

      {/* Title */}
      <Text style={styles.title}>TRACK STATUS</Text>

      {/* Form */}
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="CASE NUMBER"
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />

        <TouchableOpacity style={styles.statusButton} onPress={handleSearch}>
          <Text style={styles.statusButtonText}>Search</Text>
        </TouchableOpacity>

        <Text style={styles.caseStatusLabel}>YOUR CASE STATUS</Text>

        {loading && (
          <ActivityIndicator
            size="small"
            color="#c7da30"
            style={{ marginTop: 10 }}
          />
        )}

        {error && <Text style={{ color: "red", marginTop: 10 }}>{error}</Text>}

        {searchResult && (
          <ScrollView style={styles.statusContainer}>
            <View style={styles.caseItem}>
              <View style={styles.caseHeader}>
                <Text style={styles.caseNumber}>
                  {String(searchResult.case_number || "")}
                </Text>
                <Text
                  style={[
                    styles.statusBadge,
                    { backgroundColor: getStatusColor(String(searchResult.status || "")) },
                  ]}
                >
                  {String(searchResult.status || "")}
                </Text>
              </View>

              <Text style={styles.caseDate}>
                Submitted: {new Date(searchResult.created_at || "").toLocaleDateString()}
              </Text>

              <Text style={styles.detail}>
                <Text style={styles.detailLabel}>Abuse Type: </Text>
                {searchResult.abuse_type || "Unknown"}
              </Text>

              <Text style={styles.detail}>
                <Text style={styles.detailLabel}>Subtype: </Text>
                {searchResult.subtype || "Unknown"}
              </Text>

              <Text style={styles.detail}>
                <Text style={styles.detailLabel}>Description: </Text>
                {String(searchResult.description || "")}
              </Text>

              <Text style={styles.detail}>
                <Text style={styles.detailLabel}>Reporter Email: </Text>
                {String(searchResult.reporter_email || "")}
              </Text>

              <Text style={styles.detail}>
                <Text style={styles.detailLabel}>Phone: </Text>
                {String(searchResult.phone_number || "")}
              </Text>

              {searchResult.full_name && (
                <Text style={styles.detail}>
                  <Text style={styles.detailLabel}>Full Name: </Text>
                  {searchResult.full_name}
                </Text>
              )}

              <Text style={styles.detail}>
                <Text style={styles.detailLabel}>Age: </Text>
                {String(searchResult.age || "")}
              </Text>

              <Text style={styles.detail}>
                <Text style={styles.detailLabel}>Grade: </Text>
                {String(searchResult.grade || "")}
              </Text>

              <Text style={styles.detail}>
                <Text style={styles.detailLabel}>Location: </Text>
                {String(searchResult.location || "")}
              </Text>

              <Text style={styles.detail}>
                <Text style={styles.detailLabel}>School: </Text>
                {String(searchResult.school_name || "")}
              </Text>

              <Text style={styles.detail}>
                <Text style={styles.detailLabel}>Reason: </Text>
                {String(searchResult.latest_status_reason || "")}
              </Text>

              {searchResult.image_path && (
                searchResult.image_path.endsWith(".mp4") ||
                  searchResult.image_path.endsWith(".mov") ? (
                  <Video
                    source={{ uri: `${BACKEND_URL}${searchResult.image_path}` }}
                    style={styles.reporterVideo}
                    useNativeControls
                    resizeMode={"contain" as any}
                    isLooping
                  />
                ) : (
                  <Image
                    source={{ uri: `${BACKEND_URL}${searchResult.image_path}` }}
                    style={styles.reporterImage}
                    resizeMode="cover"
                  />
                )
              )}

              <TouchableOpacity
                style={styles.editButton}
                onPress={() =>
                  router.push({
                    pathname: "/edit-report",
                    params: { case_number: searchResult.case_number },
                  })
                }
              >
                <Text style={styles.editButtonText}>Edit Report</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        )}
      </View>

      <TouchableOpacity style={styles.button} onPress={() => router.back()}>
        <Text style={styles.buttonText}>Go Back</Text>
      </TouchableOpacity>

      {/* Overlay */}
      {menuVisible && <TouchableOpacity style={styles.overlay} onPress={toggleMenu} />}

      {/* Slide-in Menu */}
      <Animated.View style={[styles.menu, { transform: [{ translateX: slideAnim }] }]}>
        <TouchableOpacity style={styles.menuItem} onPress={() => handleNavigate("/")}>
          <Text style={styles.menuText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => handleNavigate("/contact-us")}>
          <Text style={styles.menuText}>Contact Us</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => handleNavigate("/about-us")}>
          <Text style={styles.menuText}>About Us</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingHorizontal: 20, paddingTop: 40 },
  topBar: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  logo: { width: 100, height: 100 },
  anonymousText: { textAlign: "center", color: "black", marginBottom: 10 },
  title: { fontSize: 20, fontWeight: "bold", textAlign: "center", marginVertical: 10 },
  formContainer: {
    width: "100%",
    borderWidth: 2,
    borderColor: "#c7da30",
    borderRadius: 10,
    padding: 20,
    backgroundColor: "#fff",
  },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 2,
    borderColor: "#c7da30",
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 10,
  },
  statusButton: {
    backgroundColor: "#c7da30",
    width: "100%",
    padding: 10,
    borderRadius: 48,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  statusButtonText: { color: "#000", fontWeight: "500", fontSize: 14 },
  caseStatusLabel: { fontSize: 16, fontWeight: "bold", marginVertical: 10, textAlign: "center" },
  statusContainer: { width: "100%", maxHeight: 300, marginTop: 10, flexGrow: 0 },
  caseItem: { backgroundColor: "#f9f9f9", padding: 15, borderRadius: 8, borderWidth: 1, borderColor: "#eee", marginBottom: 10 },
  caseHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 5 },
  caseNumber: { fontSize: 16, fontWeight: "bold" },
  statusBadge: { color: "white", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, fontSize: 12, fontWeight: "bold" },
  caseDate: { fontSize: 14, color: "#666", marginBottom: 5 },
  detail: { fontSize: 14, color: "#333", marginBottom: 3 },
  detailLabel: { fontWeight: "bold" },
  button: { backgroundColor: "#c7da30", padding: 15, borderRadius: 40, marginTop: 20, alignItems: "center" },
  buttonText: { color: "black", fontSize: 16 },
  editButton: { marginTop: 15, backgroundColor: "#c7da30", padding: 12, borderRadius: 8, alignItems: "center" },
  editButtonText: { borderRadius: 50, color: "black" },
  reporterImage: { width: 100, height: 100, borderRadius: 50, marginBottom: 10 },
  reporterVideo: { width: 300, height: 200, borderRadius: 8, marginBottom: 10 },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.3)",
    zIndex: 5,
  },
  menu: {
    position: "absolute",
    top: 0,
    right: 0,
    width: width * 0.7,
    height: "100%",
    backgroundColor: "#c7da30",
    paddingTop: 100,
    paddingHorizontal: 20,
    zIndex: 10,
  },
  menuItem: { paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: "#fff" },
  menuText: { fontSize: 18, color: "#333" },
});
