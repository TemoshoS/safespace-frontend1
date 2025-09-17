import React, { useEffect, useState, useRef } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, LayoutAnimation,
  UIManager, Platform, Modal, Image, ScrollView, StyleSheet, Alert
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
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
  const lastCount = useRef(0);
  const router = useRouter();

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
        setReports(data);

        const diff = data.length - lastCount.current;
        if (diff > 0) setNewCount((prev) => prev + diff);
        lastCount.current = data.length;
      } catch (err) {
        Alert.alert('Error', 'Failed to fetch reports');
      }
    };

    loadAdminName();
    fetchReports();
    const interval = setInterval(fetchReports, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.multiRemove(['adminToken', 'adminUsername']);
    Alert.alert('Logged out', 'You have been logged out');
    router.push('/admin-login');
  };

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
        setReports((prev) => prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r)));
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
          <Text style={[styles.cell, { flex: 2 }]}>{item.anonymous ? 'Anonymous' : `${item.first_name} ${item.surname}`}</Text>
          <View style={[styles.cell, { flex: 2 }]}>
            {item.attachment_path !== 'N/A' && (
              <TouchableOpacity style={styles.viewButton} onPress={() => openAttachment(item.attachment_path)}>
                <Text style={styles.viewButtonText}>View</Text>
              </TouchableOpacity>
            )}
          </View>
          <View style={[styles.cell, { flex: 1, padding: 0 }]}>
            <Picker selectedValue={item.status} onValueChange={(value: string) => updateStatus(item.id, value)} style={styles.picker}>
              <Picker.Item label="Pending" value="Pending" />
              <Picker.Item label="In Progress" value="In Progress" />
              <Picker.Item label="Resolved" value="Resolved" />
            </Picker>
          </View>
        </View>

        {isExpanded && (
          <View style={styles.detailsBox}>
            <Text style={styles.detail}>📍 Location: {item.location}</Text>
            <Text style={styles.detail}>📞 Phone: {item.phone}</Text>
            <Text style={styles.detail}>📧 Email: {item.email}</Text>
            <Text style={styles.detail}>📝 Description: {item.description}</Text>
            {item.attachment_path !== 'N/A' && (
              <TouchableOpacity style={styles.viewButton} onPress={() => openAttachment(item.attachment_path)}>
                <Text style={styles.viewButtonText}>View Attachment</Text>
              </TouchableOpacity>
            )}
            <Text style={styles.detail}>📅 Created: {item.created_at}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <Text style={styles.adminName}>Welcome, {adminName}</Text>

        <TouchableOpacity style={styles.exportBtn} onPress={() => exportPDF(reports)}>
          <Text style={styles.exportText}>Export PDF</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.notificationContainer} onPress={() => setNewCount(0)}>
          <Text style={styles.bell}>🔔</Text>
          {newCount > 0 && <View style={styles.badge}><Text style={styles.badgeText}>{newCount}</Text></View>}
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>Abuse Reports</Text>

      <View style={[styles.row, styles.header]}>
        <Text style={[styles.cell, { flex: 1, fontWeight: 'bold' }]}>Case #</Text>
        <Text style={[styles.cell, { flex: 2, fontWeight: 'bold' }]}>Name</Text>
        <Text style={[styles.cell, { flex: 2, fontWeight: 'bold' }]}>Attachment</Text>
        <Text style={[styles.cell, { flex: 1, fontWeight: 'bold' }]}>Status</Text>
      </View>

      <FlatList data={reports} keyExtractor={(item) => item.id.toString()} renderItem={renderItem} />

      {/* Modal */}
      <Modal visible={modalVisible} transparent={true}>
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.modalClose} onPress={() => setModalVisible(false)}>
            <Text style={{ color: '#fff', fontSize: 18 }}>Close</Text>
          </TouchableOpacity>
          <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Image source={{ uri: modalImage }} style={styles.modalImage} resizeMode="contain" />
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}



