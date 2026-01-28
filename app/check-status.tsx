import MenuToggle from "@/components/menuToggle";
import TopBar from "@/components/toBar";
import { BACKEND_URL } from "@/utils/config";
import axios from "axios";
import { Video } from "expo-av";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
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
      case "awaiting-resolution":
        return "#EF4444";
      case "forwarded":
        return "#FACC15";
      case "under-review":
        return "#3B82F6";
      case "closed":
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

      // Extra safety: backend might return a 200 but a malicious message
      if (res.data?.message?.toLowerCase().includes("malicious")) {
        router.push("/access-denied");
        return;
      }

      setSearchResult(res.data);
    } catch (err: any) {
      console.error("Search error:", err);

      const status = err.response?.status;
      const message = err.response?.data?.message?.toLowerCase() || "";

      if (status === 404 || message.includes("not found")) {
        setError("Case not found");
      } else if (status === 403 || message.includes("malicious") || message.includes("forbidden")) {
        router.push("/access-denied");
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
      <TopBar
        menuVisible={menuVisible}
        onBack={() => router.back()}
        onToggleMenu={toggleMenu}
      />

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
              <Text style={styles.caseNumber}>
                {String(searchResult.case_number || "")}
              </Text>
              <Text style={styles.detail}>
                <Text style={styles.detailLabel}>Status: </Text>
                <Text
                  style={{
                    backgroundColor: getStatusColor(String(searchResult.status || "")),
                    color: "black",
                    paddingHorizontal: 8,
                    paddingVertical: 2,
                    borderRadius: 8,
                    fontSize: 14,
                    fontFamily: "Montserrat-Regular",
                  }}
                >
                  {String(searchResult.status || "")}
                </Text>
              </Text>

              <Text style={styles.detail}>
                <Text style={styles.detailLabel}>Submitted: </Text>
                {new Date(searchResult.created_at || "").toLocaleDateString()}
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
                <Text style={styles.detailLabel}>Email: </Text>
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


              {searchResult.latest_status_reason ? (
                <Text style={styles.detail}>
                  <Text style={styles.detailLabel}>Reason: </Text>
                  {searchResult.latest_status_reason}
                </Text>
              ) : null}


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



      {/* Overlay */}
      {menuVisible && <TouchableOpacity style={styles.overlay} onPress={toggleMenu} />}

      {/* Slide-in Menu */}
  
      <MenuToggle
        menuVisible={menuVisible}
        slideAnim={slideAnim}
        onNavigate={handleNavigate}
        onBack={() => {
          if (router.canGoBack()) {
            router.back();
          } else {
            router.push("/"); // Go home if no back screen
          }
        }}
        onClose={() => setMenuVisible(false)}
      />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
  },
  anonymousText: {
    textAlign: "center",
    color: "black",
    marginBottom: 10,
    fontFamily: "Montserrat"
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 10,
    fontFamily: "Montserrat"
  },
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
    fontFamily: "Montserrat",
  },
  statusButton: {
    backgroundColor: "#fff",
    width: "100%",
    padding: 10,
    borderRadius: 48,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    borderColor: "#c7da30",
    borderWidth: 2,
  },
  statusButtonText: {
    color: "#1aaed3ff",
    fontWeight: "500",
    fontSize: 16,
    fontFamily: "Montserrat"
  },
  caseStatusLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 10,
    textAlign: "center",
    fontFamily: "Montserrat"
  },
  statusContainer: {
    width: "100%",
    maxHeight: 300,
    marginTop: 10,
    flexGrow: 0
  },
  caseItem: {
    backgroundColor: "#f9f9f9",
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#eee",
    marginBottom: 10
  },
  caseHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5
  },
  caseNumber: {
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "Montserrat"
  },
  statusBadge: {
    color: "black",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    fontSize: 12,
    fontWeight: "bold",
    overflow: "hidden",
    fontFamily: "Montserrat",
  },
  caseDate: {
    fontSize: 14,
    fontWeight: 'bold',
    color: "#333",
    marginBottom: 3,
    fontFamily: "Montserrat"
  },
  detail: {
    fontSize: 14,
    color: "#333",
    marginBottom: 3,
    fontFamily: "Montserrat"
  },
  detailLabel: {
    fontWeight: "bold",
    fontFamily: "Montserrat"
  },
  button: {
    backgroundColor: "#fff",
    borderColor: "#c7da30",
    padding: 15,
    borderRadius: 40,
    marginTop: 20,
    alignItems: "center",
    borderWidth: 2
  },
  buttonText: {
    color: "#333",
    fontSize: 15,
    fontFamily: "Montserrat"
  },
  editButton: {
    marginTop: 15,
    borderWidth: 2,
    borderColor: "#c7da30",
    padding: 12,
    borderRadius: 50,
    alignItems: "center"
  },
  editButtonText: {
    color: "#1aaed3ff",
    fontWeight: "500",
    fontSize: 16,
    fontFamily: "Montserrat"
  },
  reporterImage: {
    width: 300,
    height: 200,
    marginBottom: 10
  },
  reporterVideo: {
    width: 300,
    height: 200,
    marginBottom: 10
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.3)",
    zIndex: 5,
  },
});
