import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';

export default function DetailsScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searched, setSearched] = useState(false);

  // Example case status data - you can replace this with real data from API
  const allCases = [
    { id: '1', caseNumber: 'CASE-001', status: 'Under Review', date: '2024-01-15' },
    { id: '2', caseNumber: 'CASE-002', status: 'Approved', date: '2024-01-10' },
    { id: '3', caseNumber: 'CASE-003', status: 'Rejected', date: '2024-01-05' },
    { id: '4', caseNumber: 'CASE-004', status: 'Pending', date: '2024-01-20' },
    { id: '5', caseNumber: 'CASE-005', status: 'Approved', date: '2024-01-25' },
    { id: '6', caseNumber: 'CASE-006', status: 'Under Review', date: '2024-01-30' },
  ];

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      // If search is empty, show all cases or clear results
      setSearchResults(allCases);
      setSearched(true);
      return;
    }

    const results = allCases.filter(caseItem =>
      caseItem.caseNumber.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    setSearchResults(results);
    setSearched(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved': return '#4CAF50';
      case 'Rejected': return '#F44336';
      case 'Under Review': return '#FF9800';
      case 'Pending': return '#9E9E9E';
      default: return '#000';
    }
  };

  const displayCases = searched ? searchResults : [];

  return (
    <View style={styles.container}>
      {/* Logo at top left */}
      <View style={styles.logoContainer}>
        <Image
         source={require('../assets/images/Logo.jpg')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <Text style={styles.title}>Check Case Status</Text>
      <Text style={styles.subtitle}>Enter your case number below to check the status of your report</Text>
      
      {/* Input and Button Row */}
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
        <TouchableOpacity 
          style={styles.statusButton}
          onPress={handleSearch}
        >
          <Text style={styles.statusButtonText}>Check Status</Text>
        </TouchableOpacity>
      </View>

      {/* Case Status Display */}
      {searched && (
        <>
          <Text style={styles.sectionTitle}>
            {searchResults.length > 0 ? 'Case Status Results' : 'No Cases Found'}
          </Text>
          
          <ScrollView style={styles.statusContainer}>
            {displayCases.map((caseItem) => (
              <View key={caseItem.id} style={styles.caseItem}>
                <View style={styles.caseHeader}>
                  <Text style={styles.caseNumber}>{caseItem.caseNumber}</Text>
                  <Text style={[styles.statusBadge, { backgroundColor: getStatusColor(caseItem.status) }]}>
                    {caseItem.status}
                  </Text>
                </View>
                <Text style={styles.caseDate}>Submitted: {caseItem.date}</Text>
              </View>
            ))}
          </ScrollView>
        </>
      )}

      {/* Show all cases when no search has been performed yet */}
      {!searched && (
        <>
          <Text style={styles.sectionTitle}>Recent Cases</Text>
          <ScrollView style={styles.statusContainer}>
            {allCases.slice(0, 3).map((caseItem) => (
              <View key={caseItem.id} style={styles.caseItem}>
                <View style={styles.caseHeader}>
                  <Text style={styles.caseNumber}>{caseItem.caseNumber}</Text>
                  <Text style={[styles.statusBadge, { backgroundColor: getStatusColor(caseItem.status) }]}>
                    {caseItem.status}
                  </Text>
                </View>
                <Text style={styles.caseDate}>Submitted: {caseItem.date}</Text>
              </View>
            ))}
          </ScrollView>
        </>
      )}

      {/* Go Back Button */}
      <TouchableOpacity 
        style={styles.button}
        onPress={() => router.back()}
      >
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
    paddingTop: 60, // Added padding to make space for the logo
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