import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

export default function AdminHome() {
  const [reports, setReports] = useState<any[]>([]);
  const [adminName, setAdminName] = useState('');
  const router = useRouter();

  useEffect(() => {
    const loadAdminName = async () => {
      const storedName = await AsyncStorage.getItem('adminUsername');
      if (storedName) setAdminName(storedName);
    };

    const fetchReports = async () => {
      const token = await AsyncStorage.getItem('adminToken');
      if (!token) return Alert.alert('Error', 'No token found');

      try {
        const response = await fetch('http://localhost:3000/abuse_reports', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        setReports(data);
      } catch (err) {
        Alert.alert('Error', 'Failed to fetch reports');
      }
    };

    loadAdminName();
    fetchReports();
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
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setReports((prev) =>
          prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
        );
      } else {
        Alert.alert('Error', 'Failed to update status');
      }
    } catch (err) {
      Alert.alert('Error', 'Something went wrong');
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.row}>
      <Text style={[styles.cell, { flex: 1 }]}>{item.case_number}</Text>
      <Text style={[styles.cell, { flex: 2 }]}>{item.description}</Text>
      <View style={[styles.cell, { flex: 1, padding: 0 }]}>
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
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <Text style={styles.adminName}>Welcome, {adminName}</Text>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>Abuse Reports</Text>

      {/* Table Header */}
      <View style={[styles.row, styles.header]}>
        <Text style={[styles.cell, { flex: 1, fontWeight: 'bold' }]}>Case #</Text>
        <Text style={[styles.cell, { flex: 2, fontWeight: 'bold' }]}>Description</Text>
        <Text style={[styles.cell, { flex: 1, fontWeight: 'bold' }]}>Status</Text>
      </View>

      <FlatList
        data={reports}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#20C997',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  adminName: { color: '#fff', fontSize: 16, fontWeight: '600' },
  logoutBtn: {
    backgroundColor: '#fff',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  logoutText: { color: '#20C997', fontWeight: '600' },

  title: { fontSize: 24, marginVertical: 16, textAlign: 'center', fontWeight: 'bold' },

  row: { flexDirection: 'row', paddingVertical: 10, borderBottomWidth: 1, borderColor: '#ccc' },
  cell: { paddingHorizontal: 8, justifyContent: 'center' },
  header: { backgroundColor: '#e0f7f1' },

  picker: { height: 40, width: '100%' },
});
