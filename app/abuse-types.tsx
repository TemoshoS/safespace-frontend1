import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function AbuseTypesScreen() {
  const BACKEND_URL = 'http://localhost:3000';
  const [abuseTypes, setAbuseTypes] = useState<any[]>([]);
  const router = useRouter();
  const params = useLocalSearchParams(); 
  const anonymous = params.anonymous; // 'yes' or 'no'

  useEffect(() => {
    axios.get(`${BACKEND_URL}/abuse_types`)
      .then(res => setAbuseTypes(res.data))
      .catch(err => console.error('Error fetching abuse types:', err));
  }, []);

  const handleBack = () => {
    router.back();
  };

  return (
    <ScrollView style={styles.container}>
      {/* Go Back button */}
      <TouchableOpacity style={styles.backButton} onPress={handleBack}>
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Select Abuse Type</Text>
      {abuseTypes.map(type => (
        <TouchableOpacity
          key={type.id}
          style={styles.button}
          onPress={() =>
            router.push({
              pathname: '/report-form',
              params: { abuseTypeId: type.id, anonymous },
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
  backButton: {
    marginBottom: 10,
    padding: 8,
    alignSelf: 'flex-start',
  },
  backButtonText: {
    color: '#CCDD45',
    fontSize: 16,
    fontWeight: 'bold',
  },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  button: { marginBottom: 15, backgroundColor: '#CCDD45', padding: 15, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});
