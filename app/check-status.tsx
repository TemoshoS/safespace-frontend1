import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  Platform
} from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import axios from 'axios';

export default function DetailsScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

   const BACKEND_URL =
    Platform.OS === "web"
      ? "http://localhost:3000"     // ✅ Web browser
      : Platform.OS === "android"
      ? "http://10.0.2.2:3000"      // ✅ Android emulator
      : "http://192.168.2.116:3000" // ✅ iOS sim or Physical Device
  
  

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

      {/* Main content container */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>TRACK STATUS</Text>

        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="CASE NUMBER"
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />

          <TouchableOpacity style={styles.statusButton} onPress={handleSearch}>
            <Text style={styles.statusButtonText}>Check Status</Text>
          </TouchableOpacity>

          <Text style={styles.caseStatusLabel}>YOUR CASE STATUS</Text>

          {loading && <Text style={{ marginTop: 10 }}>Loading...</Text>}
          {error && <Text style={{ color: 'red', marginTop: 10 }}>{error}</Text>}

          {searchResult && (
            <View style={styles.statusContainer}>
              <View style={styles.caseItem}>
                <View style={styles.caseHeader}>
                  <Text style={styles.caseNumber}>
                    Case Number: <Text style={styles.caseValue}>{searchResult.case_number}</Text>
                  </Text>
                 
                </View>

                {/*<Text style={styles.detail}>
                  Report Type: <Text style={styles.caseValue}> {searchResult.abuse_type}</Text>
                </Text>*/}

                 
                    <Text style={styles.detail}>Status:
                    <Text style={styles.statusBadge}>
                      {String(searchResult.status || 'Unknown')}
                    </Text>
                    </Text>
                  
                <Text style={styles.detail}>
                  Full Name: <Text style={styles.caseValue}>{searchResult.full_name}</Text>
                </Text>
                <Text style={styles.detail}>
                  Abuse Type: <Text style={styles.caseValue}>{searchResult.abuse_type}</Text>
                </Text>
                <Text style={styles.detail}>
                  Subtype: <Text style={styles.caseValue}>{searchResult.subtype}</Text>
                </Text>
                <Text style={styles.detail}>
                  Email: <Text style={styles.caseValue}>{searchResult.reporter_email}</Text>
                </Text>
                <Text style={styles.detail}>
                  Phone Number: <Text style={styles.caseValue}>{searchResult.phone_number}</Text>
                </Text>
                <Text style={styles.detail}>
                  Address: <Text style={styles.caseValue}>{searchResult.location}</Text>
                </Text>
                <Text style={styles.detail}>
                  Grade: <Text style={styles.caseValue}>{searchResult.grade || ''}</Text>
                </Text>
                <Text style={styles.detail}>
                  School Name: <Text style={styles.caseValue}>{searchResult.school_name}</Text>
                </Text>
                <Text style={styles.detail}>
                  Age: <Text style={styles.caseValue}>{searchResult.age}</Text>
                </Text>

                {/* Reason Box */}
                {searchResult.reason && (
                  <View style={styles.reasonBox}>
                    <Text style={styles.reasonTitle}>Latest Update Reason:</Text>
                    <Text style={styles.reasonText}>{searchResult.reason}</Text>
                  </View>
                )}

                {/* Description */}
                <Text style={styles.description}>
                  <Text style={styles.descriptionLabel}>Description:</Text>{' '}
                  {searchResult.description}
                </Text>

{searchResult.image_path && (
  <Image
    source={{ uri: BACKEND_URL + searchResult.image_path }}
    style={styles.caseImage}
    resizeMode="cover"
  />
)}

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
            </View>
          )}
        </View>

        {/* Go Back */}
        <TouchableOpacity style={styles.button} onPress={() => router.back()}>
          <Text style={styles.buttonText}>Go Back</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 40,
  },

  logoContainer: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 10,
  },

  logo: {
    width: 100,
    height: 90,
   
  },

  scrollContent: {
    alignItems: 'center',
    paddingTop: 80, // ensures content appears below logo
    paddingHorizontal: 20,
    paddingBottom: 30,
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },

  formContainer: {
    width: '100%',
    maxWidth: 400,
    borderWidth: 2,
    borderColor: '#c7da30',
    borderRadius: 10,
    padding: 20,
    backgroundColor: '#fff',
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
    textAlign: 'center',
    color: '#333',
  },

  statusContainer: {
    marginTop: 10,
  },
  caseItem: {
    padding: 15,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#c7da30',
  },

  caseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },

  caseNumber: {
    fontSize: 14,
    fontWeight: 'bold',
  },

  caseValue: {
    fontWeight: '500',
    color: '#333',
  },

  statusWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  statusBadge: {
    backgroundColor: '#c7da30',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
    fontSize: 13,
    marginLeft: 6,

  },

  detail: {
    fontSize: 14,
    color: 'black',
    marginBottom: 4,
    fontWeight: 'bold',
  },

  reasonBox: {
    backgroundColor: '#f1fbdc',
    borderRadius: 8,
    padding: 10,
    marginTop: 10,
    marginBottom: 10,
  },

  reasonTitle: {
    fontWeight: 'bold',
    color: '#889e0c',
    marginBottom: 4,
  },

  reasonText: {
    fontStyle: 'italic',
    color: '#556000',
  },

  description: {
    marginTop: 5,
    fontSize: 14,
    color: '#333',
    borderTopWidth: 1,
    borderColor: '#eee',
    paddingTop: 10,
  },

  descriptionLabel: {
    fontWeight: 'bold',
  },

  editButton: {
    marginTop: 20,
    backgroundColor: '#c7da30',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 30,
    alignSelf: 'flex-start',
  },
caseImage: {
  width: '100%',
  height: 200,
  borderRadius: 10,
  marginVertical: 10,
  borderWidth: 2,
  borderColor: '#c7da30',
},

  editButtonText: {
    color: '#333',
    fontSize: 14,
  },

  button: {
    backgroundColor: '#c7da30',
    padding: 15,
    borderRadius: 40,
    marginTop: 20,
  },

  buttonText: {
    color: 'black',
    fontSize: 16,
  },
});
