import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function AbuseTypesScreen() {
  const BACKEND_URL = 'http://localhost:3000';
  const [abuseTypes, setAbuseTypes] = useState<any[]>([]);
  const router = useRouter();
  const params = useLocalSearchParams(); // ✅ get params from previous screen
  const anonymous = params.anonymous;     // 'yes' or 'no'

  useEffect(() => {
    axios.get(`${BACKEND_URL}/abuse_types`)
      .then(res => setAbuseTypes(res.data))
      .catch(err => console.error('Error fetching abuse types:', err));
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Select Abuse Type</Text>
      {abuseTypes.map(type => (
        <TouchableOpacity
          key={type.id}
          style={styles.button}
          onPress={() =>
            router.push({
              pathname: '/report-form',
              params: { abuseTypeId: type.id, anonymous }, // pass it correctly
            })
          }
        >
          <Text style={styles.buttonText}>{type.type_name}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  button: { marginBottom: 15, backgroundColor: 'purple', padding: 15, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});
