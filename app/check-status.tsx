import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import axios from 'axios';

export default function DetailsScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const BACKEND_URL = 'http://localhost:3000';

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#4CAF50';
      case 'escalated': return '#FF9800';
      case 'pending': return '#9E9E9E';
      default: return '#000';
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setError('Please enter a case number');
      return;
    }

    setLoading(true);
    setError('');
    setSearchResult(null);

    try {
      const res = await axios.get(`${BACKEND_URL}/reports/case/${searchQuery}`);
      setSearchResult(res.data);
    } catch (err: any) {
      console.error(err);
      if (err.response?.status === 404) {
        setError('Case not found');
      } else {
        setError('Failed to fetch case. Check backend/network.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
<View style={styles.container}>
  {/* Logo */}
  <View style={styles.logoContainer}>
    <Image
      source={require('../assets/images/Logo.jpg')}
      style={styles.logo}
      resizeMode="contain"
    />
  </View>

  {/* Title outside form */}
  <Text style={styles.title}>TRACK STATUS</Text>

  {/* Form container */}
  <View style={styles.formContainer}>
    {/* Search input */}
    <TextInput
      style={styles.input}
      placeholder="CASE NUMBER"
      placeholderTextColor="#999"
      value={searchQuery}
      onChangeText={setSearchQuery}
      onSubmitEditing={handleSearch}
      returnKeyType="search"
    />

    {/* Search button */}
    <TouchableOpacity style={styles.statusButton} onPress={handleSearch}>
      <Text style={styles.statusButtonText}>Check Status</Text>
    </TouchableOpacity>

    {/* Your Case Status label */}
    <Text style={styles.caseStatusLabel}>Your Case Status</Text>

    {/* Loading/Error */}
    {loading && <Text style={{ marginTop: 10 }}>Loading...</Text>}
    {error && <Text style={{ color: 'red', marginTop: 10 }}>{error}</Text>}

    {/* Search results */}
    {searchResult && (
      <ScrollView style={styles.statusContainer}>
        <View style={styles.caseItem}>
          <View style={styles.caseHeader}>
            <Text style={styles.caseNumber}>{String(searchResult.case_number || '')}</Text>
            <Text
              style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor(String(searchResult.status || '')) },
              ]}
            >
              {String(searchResult.status || '')}
            </Text>
          </View>

          <Text style={styles.caseDate}>
            Submitted: {new Date(searchResult.created_at || '').toLocaleDateString()}
          </Text>

          {/* Case details */}
          <Text style={styles.detail}>
            <Text style={styles.detailLabel}>Abuse Type: </Text>
            {String(searchResult.abuse_type_id || '')}
          </Text>
          <Text style={styles.detail}>
            <Text style={styles.detailLabel}>Subtype: </Text>
            {String(searchResult.subtype_id || '')}
          </Text>
          <Text style={styles.detail}>
            <Text style={styles.detailLabel}>Description: </Text>
            {String(searchResult.description || '')}
          </Text>
          <Text style={styles.detail}>
            <Text style={styles.detailLabel}>Reporter Email: </Text>
            {String(searchResult.reporter_email || '')}
          </Text>
          <Text style={styles.detail}>
            <Text style={styles.detailLabel}>Phone: </Text>
            {String(searchResult.phone_number || '')}
          </Text>
          <Text style={styles.detail}>
            <Text style={styles.detailLabel}>Full Name: </Text>
            {String(searchResult.full_name || 'Anonymous')}
          </Text>
          <Text style={styles.detail}>
            <Text style={styles.detailLabel}>Age: </Text>
            {String(searchResult.age || '')}
          </Text>
          <Text style={styles.detail}>
            <Text style={styles.detailLabel}>Location: </Text>
            {String(searchResult.location || '')}
          </Text>
          <Text style={styles.detail}>
            <Text style={styles.detailLabel}>School: </Text>
            {String(searchResult.school_name || '')}
          </Text>
           <Text style={styles.detail}>
            <Text style={styles.detailLabel}>Reason: </Text>
            {String(searchResult.reason || '')}
          </Text>

          {/* Edit Button */}
          <TouchableOpacity
            style={styles.editButton}
            onPress={() =>
              router.push({
                pathname: '/edit-report',
                params: { case_number: searchResult.case_number },
              })
            }
          >
            <Text style={styles.editButtonText}>Edit Report</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    )}
  </View>

  {/* Go Back Button */}
  <TouchableOpacity style={styles.button} onPress={() => router.back()}>
    <Text style={styles.buttonText}>Go Back</Text>
  </TouchableOpacity>
</View>


  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center', // vertically center
    alignItems: 'center',     // horizontally center
    padding: 20,
    backgroundColor: '#fff',
  },

  logoContainer: { position: 'absolute', top: 20, left: 20, zIndex: 10 },
  logo: { width: 50, height: 50, borderRadius: 8 },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },

  formContainer: {
    width: '90%',
    maxWidth: 400,
    maxHeight: 500,           // prevent form from stretching too tall
    borderWidth: 2,
    borderColor: '#c7da30',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#fff',
    flexShrink: 0,             // input/button won't shrink
  },

  input: {
    width: '100%',
    height: 50,
    borderWidth: 2,
    borderColor: '#c7da30',   
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 10,
  },

  statusButton: {
    backgroundColor: '#c7da30',
    width: '100%',
    padding: 15,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },

  statusButtonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 14,
  },

  caseStatusLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#333',
  },

  statusContainer: {
    width: '100%',
    maxHeight: 300,   // Scrollable results
    marginTop: 10,
    flexGrow: 0,
  },

  caseItem: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
    marginBottom: 10,
  },

  caseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },

  caseNumber: { fontSize: 16, fontWeight: 'bold' },

  statusBadge: {
    color: 'white',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: 'bold',
  },

  caseDate: { fontSize: 14, color: '#666', marginBottom: 5 },

  detail: { fontSize: 14, color: '#333', marginBottom: 3 },
  detailLabel: { fontWeight: 'bold' },

  button: {
    backgroundColor: '#FF3B30',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
  },

  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },

  editButton: {
    marginTop: 15,
    backgroundColor: '#c7da30',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },

  editButtonText: { color: '#fff', fontWeight: 'bold' },
});



