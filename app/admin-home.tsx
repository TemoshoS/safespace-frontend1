import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AdminHome() {
  const [reports, setReports] = useState<any[]>([]);

  useEffect(() => {
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

    fetchReports();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Abuse Reports</Text>
      <FlatList
        data={reports}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text>{item.type}</Text>
            <Text>{item.description}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, marginBottom: 16 },
  item: { padding: 12, borderBottomWidth: 1, borderColor: '#ccc' },
});
