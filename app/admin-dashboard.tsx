import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { Picker } from "@react-native-picker/picker";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

export default function AdminDashboard() {
  const [reports, setReports] = useState<any[]>([]);
  const [adminName, setAdminName] = useState("");
  const router = useRouter();

  useEffect(() => {
    // DEV only: auto-inject a dummy admin token + username so the dashboard works without login.
    // This will NOT run in production builds because __DEV__ is false there.
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
      const token = await AsyncStorage.getItem("adminToken");
      if (!token) return Alert.alert("Error", "No token found");

      try {
        const response = await fetch("http://localhost:3000/abuse_reports", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch");
        }
        const data = await response.json();
        setReports(data);
      } catch (err) {
        console.error(err);
        Alert.alert("Error", "Failed to fetch reports");
      }
    };

    loadAdminName();
    fetchReports();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.multiRemove(["adminToken", "adminUsername"]);
    Alert.alert("Logged out", "You have been logged out");
    router.push("/admin-login");
  };

  const updateStatus = async (id: number, newStatus: string) => {
    const token = await AsyncStorage.getItem("adminToken");
    if (!token) return Alert.alert("Error", "No token found");

    try {
      const response = await fetch(`http://localhost:3000/abuse_reports/${id}`, {
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

        // Feedback to admin
        Alert.alert(
          "Status Updated",
          `Report status has been changed to "${newStatus}"`,
          [{ text: "OK" }]
        );
      } else {
        Alert.alert("Error", "Failed to update status");
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Something went wrong");
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.reportCard}>
      <View style={styles.reportHeader}>
        <Text style={styles.caseNumber}>#{item.case_number}</Text>
        <Text
          style={[
            styles.statusBadge,
            item.status === "Pending"
              ? styles.pending
              : item.status === "In Progress"
              ? styles.inProgress
              : styles.resolved,
          ]}
        >
          {item.status}
        </Text>
      </View>
      <Text style={styles.description}>{item.description}</Text>
      <Picker
        selectedValue={item.status}
        onValueChange={(value: string) => updateStatus(item.id, value)}
        style={styles.picker}
      >
        <Picker.Item label="Pending" value="Pending" />
        <Picker.Item label="In Progress" value="In Progress" />
        <Picker.Item label="Resolved" value="Resolved" />
      </Picker>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <Text style={styles.welcome}>👋 Hi, {adminName}</Text>
        <TouchableOpacity onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={26} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Quick Stats */}
      <View style={styles.statsRow}>
        <View style={[styles.statCard, { backgroundColor: "#FF6B6B" }]}>
          <MaterialIcons name="pending-actions" size={28} color="#fff" />
          <Text style={styles.statText}>
            {reports.filter((r) => r.status === "Pending").length} Pending
          </Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: "#FFA94D" }]}>
          <Ionicons name="time-outline" size={28} color="#fff" />
          <Text style={styles.statText}>
            {reports.filter((r) => r.status === "In Progress").length} In Progress
          </Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: "#51CF66" }]}>
          <Ionicons name="checkmark-done-circle" size={28} color="#fff" />
          <Text style={styles.statText}>
            {reports.filter((r) => r.status === "Resolved").length} Resolved
          </Text>
        </View>
      </View>

      {/* Report List */}
      <Text style={styles.sectionTitle}>📑 Latest Reports</Text>
      <FlatList
        data={reports}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafc" },

  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#1C7ED6",
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  welcome: { color: "#fff", fontSize: 18, fontWeight: "600" },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 20,
  },
  statCard: {
    flex: 1,
    marginHorizontal: 5,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  statText: { color: "#fff", marginTop: 8, fontWeight: "600" },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginHorizontal: 16,
    marginBottom: 10,
    color: "#333",
  },

  reportCard: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 14,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  reportHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  caseNumber: { fontWeight: "700", fontSize: 14, color: "#1C7ED6" },

  statusBadge: {
    paddingVertical: 2,
    paddingHorizontal: 10,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: "600",
    color: "#fff",
  },
  pending: { backgroundColor: "#FF6B6B" },
  inProgress: { backgroundColor: "#FFA94D" },
  resolved: { backgroundColor: "#51CF66" },

  description: { fontSize: 14, color: "#444", marginBottom: 8 },
  picker: { height: 40, width: "100%" },
});
