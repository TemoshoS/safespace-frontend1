import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  LayoutAnimation,
  UIManager,
  Platform,
  Modal,
  Image,
  ScrollView,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { exportPDF } from '../utils/exportPDF';
import { styles } from '../styles/adminHomeStyles';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function AdminHome() {
  const [reports, setReports] = useState<any[]>([]);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [adminName, setAdminName] = useState('');
  const [newCount, setNewCount] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalImage, setModalImage] = useState('');
  const [notifOpen, setNotifOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const lastCount = useRef(0);
  const router = useRouter();
  const { filter } = useLocalSearchParams(); // Read filter from AdminDashboard

  useEffect(() => {
    const loadAdminName = async () => {
      const storedName = await AsyncStorage.getItem('adminUsername');
      if (storedName) setAdminName(storedName);
    };

    const fetchReports = async () => {
      const token = await AsyncStorage.getItem('adminToken');
      if (!token) return;

      try {
        const response = await fetch('http://localhost:3000/abuse_reports', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();

        // Apply filter if exists
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
    const interval = setInterval(fetchReports, 10000); // auto-refresh
    return () => clearInterval(interval);
  }, [filter]);

  const handleLogout = async () => {
    await AsyncStorage.multiRemove(['adminToken', 'adminUsername']);
    Alert.alert('Logged out', 'You have been logged out');
    router.push('/');
  };

  // ✅ Updated function (merged cleanly)
  const updateStatus = async (id: number, newStatus: string) => {
    const token = await AsyncStorage.getItem('adminToken');
    if (!token) return Alert.alert('Error', 'No token found');

    try {
      const response = await fetch(`http://localhost:3000/abuse_reports/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        // Update the reports in state
        const updatedReports = reports.map((r) =>
          r.id === id ? { ...r, status: newStatus } : r
        );
        setReports(updatedReports);

        // ✅ Show pop-up alert for admin
        Alert.alert('Status Updated', `You have set this report to "${newStatus}"`);

        // ✅ Send email notification via backend
        const report = updatedReports.find((r) => r.id === id);
        if (report && report.email) {
          await fetch(`http://localhost:3000/send_status_email`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              to: report.email,
              case_number: report.case_number,
              status: newStatus,
            }),
          });
        }
      } else {
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
    setModalImage(`http://localhost:3000${path}`);
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
              onValueChange={(value: string) => updateStatus(item.id, value)}
              style={styles.picker}
            >
              <Picker.Item label="Pending" value="Pending" />
              <Picker.Item label="In Progress" value="In Progress" />
              <Picker.Item label="Escalated" value="Escalated" />
              <Picker.Item label="Resolved" value="Resolved" />
              <Picker.Item label="Unresolved" value="Unresolved" />
            </Picker>
          </View>
        </View>

        {isExpanded && (
          <View style={styles.detailsBox}>
            <Text style={styles.detail}>Contact Number: {item.phone_number}</Text>
            <Text style={styles.detail}>Abuse Type: {item.abuse_type}</Text>
            <Text style={styles.detail}>Subtype: {item.subtype}</Text>
            <Text style={styles.detail}>Description: {item.description}</Text>

            {item.image_path && item.image_path !== 'N/A' && (
              <TouchableOpacity
                style={styles.viewButton}
                onPress={() => openAttachment(item.image_path)}
              >
                <Text style={styles.viewButtonText}>View Attachment</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <Text style={styles.adminName}>{adminName}</Text>
        <TouchableOpacity style={styles.menuBtn} onPress={() => setMenuOpen(!menuOpen)}>
          <Text>Menu </Text>
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
            <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/admin-dashboard')}>
              <Text>Dashboard</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/admin-profile')}>
              <Text>Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
              <Text>Logout</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      )}

      <Text style={styles.title}>{filter ? `${filter} Reports` : 'Abuse Reports'}</Text>

      {/* Table Header */}
      <View style={[styles.row, styles.header]}>
        <Text style={[styles.cell, { flex: 1, fontWeight: 'bold' }]}>Case #</Text>
        <Text style={[styles.cell, { flex: 2, fontWeight: 'bold' }]}>Email</Text>
        <Text style={[styles.cell, { flex: 1, fontWeight: 'bold' }]}>Status</Text>
      </View>

      {/* Reports List */}
      <FlatList
        data={reports}
        keyExtractor={(item, index) => (item.id ? item.id.toString() : index.toString())}
        renderItem={renderItem}
      />

      {/* Attachment Modal */}
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

      {/* Notifications Modal */}
      <Modal visible={notifOpen} transparent animationType="fade">
        <View style={styles.notifModal}>
          <ScrollView>
            {newCount === 0 ? (
              <Text style={styles.notifText}>No new notifications</Text>
            ) : (
              reports.slice(-newCount).map((report) => (
                <Text key={report.id} style={styles.notifText}>New report: {report.case_number}</Text>
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
