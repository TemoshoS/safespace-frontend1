import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  LayoutAnimation,
  UIManager,
  Platform,
  Modal,
  Image,
  ScrollView,
  Alert,
  TextInput,
  Dimensions,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { exportPDF } from '../utils/exportPDF';
import { styles } from '../styles/adminHomeStyles';
import { MaterialIcons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}


export default function AdminHome() {
  const BACKEND_URL =
  Platform.OS === "web"
    ? "http://localhost:3000"     // ✅ Web browser
    : Platform.OS === "android"
    ? "http://10.0.2.2:3000"      // ✅ Android emulator
    : "http://192.168.2.116:3000" // ✅ iOS sim or Physical Device

  const [reports, setReports] = useState<any[]>([]);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [adminName, setAdminName] = useState('');
  const [newCount, setNewCount] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalImage, setModalImage] = useState('');
  const [notifOpen, setNotifOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const [justificationModalVisible, setJustificationModalVisible] = useState(false);
  const [selectedReportId, setSelectedReportId] = useState<number | null>(null);
  const [selectedCaseNumber, setSelectedCaseNumber] = useState('');
  const [selectedNewStatus, setSelectedNewStatus] = useState('');
  const [currentStatus, setCurrentStatus] = useState('');
  const [statusChangeReason, setStatusChangeReason] = useState('');

  const lastCount = useRef(0);
  const router = useRouter();
  const { filter } = useLocalSearchParams();

  useEffect(() => {
    const loadAdminName = async () => {
      const storedName = await AsyncStorage.getItem('adminUsername');
      if (storedName) setAdminName(storedName);
    };

    const fetchReports = async () => {
      const token = await AsyncStorage.getItem('adminToken');
      if (!token) return;

      try {
        const response = await fetch(`${BACKEND_URL}/abuse_reports`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        const filtered = filter ? data.filter((r: any) => r.status === filter) : data;
        setReports(filtered);

        const diff = filtered.length - lastCount.current;
        if (diff > 0) setNewCount((prev) => prev + diff);
        lastCount.current = filtered.length;
      } catch (err) {
        Alert.alert('Error', 'Failed to fetch reports');
      }
    };

    loadAdminName();
    fetchReports();
    const interval = setInterval(fetchReports, 10000);
    return () => clearInterval(interval);
  }, [filter]);

  const handleLogout = async () => {
    await AsyncStorage.multiRemove(['adminToken', 'adminUsername']);
    Alert.alert('Logged out', 'You have been logged out');
    router.push('/');
  };

  const updateStatus = async (id: number, newStatus: string, reason: string) => {
    const token = await AsyncStorage.getItem('adminToken');
    if (!token) return Alert.alert('Error', 'No token found');

    try {
      const response = await fetch(`${BACKEND_URL}/abuse_reports/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus, reason }),
      });

      if (response.ok) {
        const updatedReports = reports.map((r) =>
          r.id === id ? { ...r, status: newStatus, reason: reason } : r
        );
        setReports(updatedReports);
        Alert.alert('Status Updated', `Report #${selectedCaseNumber} updated to "${newStatus}"`);
      }
      else {
        Alert.alert('Error', 'Failed to update status');
      }
    } catch (err) {
      Alert.alert('Error', 'Something went wrong');
    }
  };

  const toggleExpand = (id: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(expanded === id ? null : id);
  };

  const openAttachment = (path: string) => {
    setModalImage(`${BACKEND_URL}${path}`);
    setModalVisible(true);
  };

  const renderItem = ({ item }: { item: any }) => {
    const isExpanded = expanded === item.id;

    return (
      <TouchableOpacity onPress={() => toggleExpand(item.id)} activeOpacity={0.8}>
        <View style={[styles.row, isExpanded && styles.expandedRow]}>
          <Text style={[styles.cell, { flex: 1 }]}>{item.case_number}</Text>
          <Text style={[styles.cell, { flex: 2 }]}>{item.reporter_email}</Text>
          <View style={[styles.cell, { flex: 1, padding: 0 }]}>
            <Picker
              selectedValue={item.status}
              onValueChange={(value: string) => {
                if (value !== item.status) {
                  setSelectedReportId(item.id);
                  setCurrentStatus(item.status);
                  setSelectedNewStatus(value);
                  setSelectedCaseNumber(item.case_number);
                  setJustificationModalVisible(true);
                }
              }}
              style={styles.picker}
            >
              <Picker.Item label="Pending" value="Pending" />
              <Picker.Item label="In Progress" value="In Progress" />
              <Picker.Item label="Escalated" value="Escalated" />
              <Picker.Item label="Resolved" value="Resolved" />
              <Picker.Item label="Unresolved" value="Unresolved" />
              <Picker.Item label="False-report" value="False-report" />
            </Picker>
          </View>
        </View>

        {isExpanded && (
          <View style={styles.detailsBox}>
            <Text style={styles.detail}>Contact Number: {item.phone_number}</Text>
            <Text style={styles.detail}>Abuse Type: {item.abuse_type}</Text>
            <Text style={styles.detail}>Subtype: {item.subtype}</Text>
            <Text style={styles.detail}>Description: {item.description}</Text>
            {item.image_path && item.image_path !== 'N/A' ? (
              <TouchableOpacity
                style={styles.viewButton}
                onPress={() => openAttachment(item.image_path)}
              >
                <Text style={styles.viewButtonText}>View Attachment</Text>
              </TouchableOpacity>
            ) : (
              <Text style={styles.detail}>Attachment: N/A</Text>
            )}
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Top bar */}
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

      {/* Menu dropdown */}
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
            <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/admin-dashboard')}>
              <Text>Dashboard</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/admin-profile')}>
              <Text>Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
              <Text>Sign Out</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      )}

      {/* Title */}
      <Text style={styles.title}>{filter ? `${filter} Reports` : 'Abuse Reports'}</Text>

      {/* Table */}
      <ScrollView style={{ marginHorizontal: 10 }} contentContainerStyle={{ paddingBottom: 20 }}>
        <View style={[styles.row, styles.header]}>
          <Text style={[styles.cell, { flex: 1, fontWeight: 'bold' }]}>Case Number</Text>
          <Text style={[styles.cell, { flex: 2, fontWeight: 'bold' }]}>Email</Text>
          <Text style={[styles.cell, { flex: 1, fontWeight: 'bold' }]}>Status</Text>
        </View>
        {reports.map((item) => renderItem({ item }))}
      </ScrollView>

      {/* Image Modal */}
      <Modal visible={modalVisible} transparent>
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.modalClose} onPress={() => setModalVisible(false)}>
            <Text style={{ color: '#fff', fontSize: 18 }}>Close</Text>
          </TouchableOpacity>
          <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Image source={{ uri: modalImage }} style={styles.modalImage} resizeMode="contain" />
          </ScrollView>
        </View>
      </Modal>

      {/* Justification Modal */}
      <Modal visible={justificationModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.justifyModalBox}>
            <Text style={styles.modalTitle}>JUSTIFY STATUS CHANGE</Text>
            <Text style={styles.modalText}>
              You are changing <Text style={{ fontWeight: 'bold' }}>Case #{selectedCaseNumber}</Text> status from <Text style={{ fontWeight: 'bold' }}>{currentStatus}</Text> to <Text style={{ fontWeight: 'bold' }}>{selectedNewStatus}</Text>.
            </Text>

            <Text style={styles.modalLabel}>Reason for status change:</Text>
            <TextInput
              multiline
              style={styles.textArea}
              value={statusChangeReason}
              onChangeText={setStatusChangeReason}
              placeholder="Enter justification..."
            />

            <View style={styles.modalBtnRow}>
              <TouchableOpacity
                style={styles.modalBtn}
                onPress={() => {
                  setJustificationModalVisible(false);
                  setStatusChangeReason('');
                  setSelectedNewStatus('');
                }}
              >
                <Text>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalBtn}
                onPress={() => {
                  if (!statusChangeReason.trim()) {
                    Alert.alert('Error', 'Please provide a justification.');
                    return;
                  }
                  if (selectedReportId && selectedNewStatus) {
                    updateStatus(selectedReportId, selectedNewStatus, statusChangeReason);
                  }
                  setJustificationModalVisible(false);
                  setStatusChangeReason('');
                  setSelectedNewStatus('');
                }}
              >
                <Text>Confirm & Update</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Notification Modal */}
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
    </View>
  );
}
