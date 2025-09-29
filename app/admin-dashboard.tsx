import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  Image,
  FlatList,
  LayoutAnimation,
  UIManager,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import { styles } from "../styles/adminHomeStyles";
import { exportPDF } from "../utils/exportPDF";

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function AdminDashboard() {
  const [reports, setReports] = useState<any[]>([]);
  const [adminName, setAdminName] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [newCount, setNewCount] = useState(0);
  const lastCount = useRef(0);
  const router = useRouter();

  useEffect(() => {
    const loadAdminName = async () => {
      const storedName = await AsyncStorage.getItem("adminUsername");
      if (storedName) setAdminName(storedName);
    };

    const fetchReports = async () => {
      try {
        const res = await axios.get("http://localhost:3000/reports");
        setReports(res.data);
        const diff = res.data.length - lastCount.current;
        if (diff > 0) setNewCount((prev) => prev + diff);
        lastCount.current = res.data.length;
      } catch (err) {
        console.error(err);
        Alert.alert("Error", "Failed to fetch reports");
      }
    };

    loadAdminName();
    fetchReports();
    const interval = setInterval(fetchReports, 10000); // auto-refresh
    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.multiRemove(["adminToken", "adminUsername"]);
    Alert.alert("Logged out", "You have been logged out");
    router.push("/");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <Text style={styles.adminName}>{adminName}</Text>
        <TouchableOpacity style={styles.menuBtn} onPress={() => setMenuOpen(!menuOpen)}>
          <Text>Menu</Text>
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
            <TouchableOpacity style={styles.menuItem} onPress={() => exportPDF(reports)}>
              <Text>Export PDF</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => setNotifOpen(true)}>
              <Text>Notifications {newCount > 0 && `(${newCount})`}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => router.push("/admin-dashboard")}>
              <Text>Dashboard</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => router.push("/admin-profile")}>
              <Text>Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
              <Text>Logout</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      )}

      <Text style={styles.title}>Admin Dashboard</Text>

      <View style={styles.statsContainer}>
        {/* Pending */}
        <TouchableOpacity
          style={[styles.statCard, { backgroundColor: "#FF6B6B" }]}
          onPress={() => router.push({ pathname: "/admin-home", params: { filter: "Pending" } })}
        >
          <MaterialIcons name="pending-actions" size={28} color="#fff" />
          <Text style={styles.statText}>
            {reports.filter((r) => r.status === "Pending").length} Pending
          </Text>
        </TouchableOpacity>

        {/* In Progress */}
        <TouchableOpacity
          style={[styles.statCard, { backgroundColor: "#FFA500" }]}
          onPress={() => router.push({ pathname: "/admin-home", params: { filter: "In Progress" } })}
        >
          <MaterialIcons name="work" size={28} color="#fff" />
          <Text style={styles.statText}>
            {reports.filter((r) => r.status === "In Progress").length} In Progress
          </Text>
        </TouchableOpacity>

        {/* Resolved */}
        <TouchableOpacity
          style={[styles.statCard, { backgroundColor: "#20C997" }]}
          onPress={() => router.push({ pathname: "/admin-home", params: { filter: "Resolved" } })}
        >
          <MaterialIcons name="check-circle" size={28} color="#fff" />
          <Text style={styles.statText}>
            {reports.filter((r) => r.status === "Resolved").length} Resolved
          </Text>
        </TouchableOpacity>

        {/* Unresolved */}
        <TouchableOpacity
          style={[styles.statCard, { backgroundColor: "#6C757D" }]}
          onPress={() => router.push({ pathname: "/admin-home", params: { filter: "Unresolved" } })}
        >
          <MaterialIcons name="cancel" size={28} color="#fff" />
          <Text style={styles.statText}>
            {reports.filter((r) => r.status === "Unresolved").length} Unresolved
          </Text>
        </TouchableOpacity>
      </View>

      {/* Notifications Modal */}
      <Modal visible={notifOpen} transparent animationType="fade">
        <View style={styles.notifModal}>
          <ScrollView>
            {newCount === 0 ? (
              <Text style={styles.notifText}>No new notifications</Text>
            ) : (
              reports.slice(-newCount).map((report) => (
                <Text key={report.id} style={styles.notifText}>
                  New report: {report.case_number}
                </Text>
              ))
            )}
          </ScrollView>
          <TouchableOpacity onPress={() => setNotifOpen(false)}>
            <Text style={styles.closeNotif}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </ScrollView>
  );
}
