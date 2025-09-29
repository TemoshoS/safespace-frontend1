import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function AbuseTypesScreen() {
  const BACKEND_URL = 'http://localhost:3000';
  const [abuseTypes, setAbuseTypes] = useState<any[]>([]);
  const [selectedAbuseType, setSelectedAbuseType] = useState(null); // ADD THIS LINE
  const router = useRouter();
  const params = useLocalSearchParams(); // ✅ get params from previous screen
  const anonymous = params.anonymous;     // 'yes' or 'no'

  useEffect(() => {
    axios.get(`${BACKEND_URL}/abuse_types`)
      .then(res => setAbuseTypes(res.data))
      .catch(err => console.error('Error fetching abuse types:', err));
  }, []);

  const handleBack = () => {
    router.back(); // Goes back to previous screen
  };

  const handleNext = () => {
    if (selectedAbuseType) {
      router.push({
        pathname: '/report-form',
        params: { abuseTypeId: selectedAbuseType, anonymous }
      });
    }
  };

    // ADD THIS FUNCTION
 const handleSelect = (typeId:any) => {
  setSelectedAbuseType(typeId);
};

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.title}>Select Abuse Type</Text>
        {abuseTypes.map(type => (
          <TouchableOpacity
            key={type.id}
            style={[
              styles.button,
              selectedAbuseType === type.id && styles.selectedButton // Added selection style
            ]}
            onPress={() => handleSelect(type.id)}// CHANGE THIS LINE - remove router.push
          >
            <Text style={styles.buttonText}>{type.type_name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Back Arrow Button - Added at the bottom left */}
      <TouchableOpacity style={styles.backButton} onPress={handleBack}
      >
        <Ionicons name="arrow-back" size={24} color="#24ae1a" />
      </TouchableOpacity>

      {/* Next Arrow Button - Added at the bottom right */}
      <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
        <Ionicons name="arrow-forward" size={24} color="#24ae1a" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollView: { padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  button: { marginBottom: 15, backgroundColor: '#24ae1a', padding: 15, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  
  // New back button styles - added without changing existing ones
  backButton: {
    position: "absolute",
    bottom: 30,
    left: 30,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#24ae1a",
    borderRadius: 50,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  
  // Next button styles - kept exactly the same
  nextButton: {
    position: "absolute",
    bottom: 30,
    right: 30,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#24ae1a",
    borderRadius: 50,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
   selectedButton: {
    backgroundColor: '#1a8a15', // Darker green for selected
    borderWidth: 2,
    borderColor: '#fff'
  },
  
});