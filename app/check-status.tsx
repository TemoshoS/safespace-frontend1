import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function DetailsScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [allCases, setAllCases] = useState<any[]>([]); // summary of all reports
  const [searchResult, setSearchResult] = useState<any | null>(null); // full details of one report
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const BACKEND_URL = 'http://10.168.231.163:3000'; // your PC IP

  // Fetch all reports on page load
  useEffect(() => {
    const fetchAllCases = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${BACKEND_URL}/reports`);
        setAllCases(res.data);
        setError('');
      } catch (err) {
        console.error(err);
        setError('Failed to fetch all reports. Check backend/network.');
      } finally {
        setLoading(false);
      }
    };
    fetchAllCases();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#4CAF50';
      case 'escalated': return '#FF9800';
      case 'pending': return '#9E9E9E';
      default: return '#000';
    }
  };

  // Fetch single report by case number
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setError('Please enter a case number');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`${BACKEND_URL}/reports/${searchQuery}`);
      setSearchResult(res.data);
    } catch (err: any) {
      console.error(err);
      setSearchResult(null);
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

      <Text style={styles.title}>Check Case Status</Text>
      <Text style={styles.subtitle}>View all cases or search by case number</Text>

      {/* Search input */}
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Enter case number"
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
        <TouchableOpacity style={styles.statusButton} onPress={handleSearch}>
          <Text style={styles.statusButtonText}>Check Status</Text>
        </TouchableOpacity>
      </View>

      {loading && <Text style={{ marginTop: 20 }}>Loading...</Text>}
      {error && <Text style={{ color: 'red', marginTop: 10 }}>{error}</Text>}

      {/* Show all case numbers if no searchResult */}
      {!searchResult && allCases.length > 0 && (
        <ScrollView style={styles.statusContainer}>
          {allCases.map((report) => (
            <View key={report.id} style={styles.caseItem}>
              <View style={styles.caseHeader}>
                <Text style={styles.caseNumber}>{report.case_number}</Text>
                <Text style={[styles.statusBadge, { backgroundColor: getStatusColor(report.status) }]}>
                  {report.status}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>
      )}

      {/* Show full details if searchResult exists */}
      {searchResult && (
        <ScrollView style={styles.statusContainer}>
          <View style={styles.caseItem}>
            <View style={styles.caseHeader}>
              <Text style={styles.caseNumber}>{searchResult.case_number}</Text>
              <Text style={[styles.statusBadge, { backgroundColor: getStatusColor(searchResult.status) }]}>
                {searchResult.status}
              </Text>
            </View>

            <Text style={styles.caseDate}>
              Submitted: {new Date(searchResult.created_at).toLocaleDateString()}
            </Text>

            <Text style={styles.detail}><Text style={styles.detailLabel}>Abuse Type:</Text> {searchResult.abuse_type_id}</Text>
            <Text style={styles.detail}><Text style={styles.detailLabel}>Subtype:</Text> {searchResult.subtype_id}</Text>
            <Text style={styles.detail}><Text style={styles.detailLabel}>Description:</Text> {searchResult.description}</Text>
            <Text style={styles.detail}><Text style={styles.detailLabel}>Reporter Email:</Text> {searchResult.reporter_email}</Text>
            <Text style={styles.detail}><Text style={styles.detailLabel}>Phone:</Text> {searchResult.phone_number}</Text>
            <Text style={styles.detail}><Text style={styles.detailLabel}>Full Name:</Text> {searchResult.full_name || 'Anonymous'}</Text>
            <Text style={styles.detail}><Text style={styles.detailLabel}>Age:</Text> {searchResult.age}</Text>
            <Text style={styles.detail}><Text style={styles.detailLabel}>Location:</Text> {searchResult.location}</Text>
            <Text style={styles.detail}><Text style={styles.detailLabel}>School:</Text> {searchResult.school_name}</Text>
          </View>
        </ScrollView>
      )}

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
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
  },
  logoContainer: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 10,
  },
  logo: {
    width: 50,
    height: 50,
    borderRadius: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    marginTop: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 30,
    marginBottom: 15,
    textAlign: 'center',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    width: '80%',
    gap: 10,
  },
  input: {
    flex: 2,
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  statusButton: {
    backgroundColor: 'purple',
    padding: 15,
    borderRadius: 8,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  statusButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  statusContainer: {
    width: '100%',
    maxHeight: 300,
    marginBottom: 20,
  },
  caseItem: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#eee',
  },
  caseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  caseNumber: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  statusBadge: {
    color: 'white',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: 'bold',
  },
  caseDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  detail: {
    fontSize: 14,
    color: '#333',
    marginBottom: 3,
  },
  detailLabel: {
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#FF3B30',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
