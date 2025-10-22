import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Image,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  UIManager,
  View
} from "react-native";
import { styles } from "../styles/adminHomeStyles";
import { exportDashboardPDF } from "../utils/exportDashboardPDF";



if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function AdminDashboard() {

  const BACKEND_URL =
  Platform.OS === "web"
    ? "http://localhost:3000"
    : "http://192.168.2.116:3000";

  const [reports, setReports] = useState<any[]>([]);
  const [adminName, setAdminName] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [newCount, setNewCount] = useState(0);
  const lastCount = useRef(0);
  const router = useRouter();

  useEffect(() => {
    // DEV only: auto-inject a dummy admin token + username for testing
    (async () => {
      try {
        if (__DEV__) {
          const existingToken = await AsyncStorage.getItem("adminToken");
          const existingName = await AsyncStorage.getItem("adminUsername");
          if (!existingToken) {
            await AsyncStorage.setItem("adminToken", "dev-dummy-token");
            console.log("DEV: injected adminToken");
          }
          if (!existingName) {
            await AsyncStorage.setItem("adminUsername", "devAdmin");
            console.log("DEV: injected adminUsername");
          }
        }
      } catch (e) {
        console.warn("DEV: failed to inject dummy admin credentials", e);
      }
    })();

    const loadAdminName = async () => {
      const storedName = await AsyncStorage.getItem("adminUsername");
      if (storedName) setAdminName(storedName);
    };

    const fetchReports = async () => {
      try {
        const token = await AsyncStorage.getItem("adminToken");
        if (!token) throw new Error("No token found");

        const response = await fetch(`${BACKEND_URL}/abuse_reports`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("Failed to fetch reports");

        const data = await response.json();
        setReports(data);

        // Handle notifications for new reports
        const diff = data.length - lastCount.current;
        if (diff > 0) setNewCount((prev) => prev + diff);
        lastCount.current = data.length;
      } catch (err) {
        console.error(err);
        Alert.alert("Error", "Failed to fetch reports");
      }
    };

    loadAdminName();
    fetchReports();
    const interval = setInterval(fetchReports, 10000); // auto-refresh every 10s
    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.multiRemove(["adminToken", "adminUsername"]);
    Alert.alert("Logged out", "You have been logged out");
    router.push("/");
  };

  const updateStatus = async (id: number, newStatus: string) => {
    try {
      const token = await AsyncStorage.getItem("adminToken");
      if (!token) return Alert.alert("Error", "No token found");

      const response = await fetch(`${BACKEND_URL}/abuse_reports/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setReports((prev) =>
          prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
        );
        Alert.alert("Status Updated", `Report status changed to "${newStatus}"`);
      } else {
        Alert.alert("Error", "Failed to update status");
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Something went wrong");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.topBar}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            source={require('../assets/images/Logo.jpg')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.adminName}>{adminName}</Text>
        </View>

        <TouchableOpacity style={styles.menuBtn} onPress={() => setMenuOpen(!menuOpen)}>
          <MaterialIcons name="menu" size={32} color="#c7da30" />
        </TouchableOpacity>
      </View>


      {/* Dropdown Menu */}
      {menuOpen && (
        <TouchableOpacity
          style={styles.menuOverlay}
          activeOpacity={1}
          onPress={() => setMenuOpen(false)}
        >
          <View style={styles.menuDropdown}>
            <TouchableOpacity style={styles.menuItem} onPress={() => router.push("/admin-home")}>
              <Text>Reports</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => router.push("/admin-profile")}>
              <Text>Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => exportDashboardPDF(adminName, reports)}
            >
              <Text>Export PDF</Text>
            </TouchableOpacity>


            <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
              <Text>Sign Out</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      )}

      <Text style={styles.title}>ADMIN DASHBOARD</Text>

      {/* Stats Section */}
      <View style={styles.statsContainer}>
        {/* All Reports */}
        <TouchableOpacity
          style={styles.statCard}
          onPress={() =>
            router.push({ pathname: "/admin-home", params: { filter: "" } })
          }
        >
          <Text style={{ ...styles.statText, color: "#17A2B8" }}>Total Reports</Text>
          <Text style={{ ...styles.statText, color: "#17A2B8", fontSize: 25, fontWeight: 900 }}>
            {reports.length}
          </Text>
        </TouchableOpacity>

        {/* In Progress */}
        <TouchableOpacity
          style={styles.statCard}
          onPress={() =>
            router.push({ pathname: "/admin-home", params: { filter: "In Progress" } })
          }
        >
          <Text style={{ ...styles.statText, color: "#FFA500" }}>In Progress</Text>
          <Text style={{ ...styles.statText, color: "#FFA500", fontSize: 25, fontWeight: 900 }}>
            {reports.filter((r) => r.status === "In Progress").length}
          </Text>
        </TouchableOpacity>

        {/* Resolved */}
        <TouchableOpacity
          style={styles.statCard}
          onPress={() =>
            router.push({ pathname: "/admin-home", params: { filter: "Resolved" } })
          }
        >
          <Text style={{ ...styles.statText, color: "#20C997" }}>Resolved</Text>
          <Text style={{ ...styles.statText, color: "#20C997", fontSize: 25, fontWeight: 900 }}>
            {reports.filter((r) => r.status === "Resolved").length}
          </Text>
        </TouchableOpacity>

        {/* Unresolved */}
        <TouchableOpacity
          style={styles.statCard}
          onPress={() =>
            router.push({ pathname: "/admin-home", params: { filter: "Unresolved" } })
          }
        >
          <Text style={{ ...styles.statText, color: "#6C757D" }}>Unresolved</Text>
          <Text style={{ ...styles.statText, color: "#6C757D", fontSize: 25, fontWeight: 900 }}>
            {reports.filter((r) => r.status === "Unresolved").length}
          </Text>
        </TouchableOpacity>

        {/* Escalated */}
        <TouchableOpacity
          style={styles.statCard}
          onPress={() =>
            router.push({ pathname: "/admin-home", params: { filter: "Escalated" } })
          }
        >
          <Text style={{ ...styles.statText, color: "black" }}>Escalated</Text>
          <Text style={{ ...styles.statText, color: "black", fontSize: 25, fontWeight: 900 }}>
            {reports.filter((r) => r.status === "Escalated").length}
          </Text>
        </TouchableOpacity>

         {/* False Report */}
        <TouchableOpacity
          style={styles.statCard}
          onPress={() =>
            router.push({ pathname: "/admin-home", params: { filter: "False-report" } })
          }
        >
          <Text style={{ ...styles.statText, color: "#c73b3b" }}>False Report</Text>
          <Text style={{ ...styles.statText, color: "#c73b3b", fontSize: 25, fontWeight: 900 }}>
            {reports.filter((r) => r.status === "False-report").length}
          </Text>
        </TouchableOpacity>
      </View>


    </ScrollView>
  );
}