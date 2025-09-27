import { 
  View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, Image, FlatList 
} from 'react-native';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';

export default function CreateReportScreen() {
  const BACKEND_URL = 'http://10.36.109.163:3000';
  const { abuseTypeId } = useLocalSearchParams(); 
  const router = useRouter();

  const [subtypes, setSubtypes] = useState<any[]>([]);
  const [selectedSubtype, setSelectedSubtype] = useState('');
  const [fullName, setFullName] = useState('');
  const [description, setDescription] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [age, setAge] = useState('');
  const [location, setLocation] = useState('');
  const [school, setSchool] = useState('');
  const [schoolSuggestions, setSchoolSuggestions] = useState<any[]>([]);
  const [image, setImage] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Fetch subtypes
  useEffect(() => {
    if (!abuseTypeId) return;
    axios.get(`${BACKEND_URL}/reports/subtypes/${abuseTypeId}`)
      .then(res => setSubtypes(res.data))
      .catch(err => console.error('Error fetching subtypes:', err));
  }, [abuseTypeId]);

  // Pick image (optional)
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.5,
    });
    if (!result.canceled) setImage(result.assets[0]);
  };

  // 🔍 Fetch schools suggestions
  const searchSchools = async (text: string) => {
    setSchool(text);
    if (text.length < 2) {
      setSchoolSuggestions([]);
      return;
    }
    try {
      const res = await axios.get(`${BACKEND_URL}/schools/search?q=${text}`);
      setSchoolSuggestions(res.data);
    } catch (err) {
      console.error('Error fetching schools:', err);
    }
  };

  // Submit report
  const handleSubmit = async () => {
    if (!selectedSubtype || !description || !email) {
      Alert.alert('Error', 'Please fill all required fields.');
      return;
    }

    setLoading(true);
    try {
      const payload: any = {
        abuse_type_id: abuseTypeId,
        subtype_id: selectedSubtype,
        description,
        reporter_email: email,
        phone_number: phone,
        full_name: fullName,
        age,
        location,
        school_name: school,
        status: 'Pending',
        is_anonymous: 0
      };

      if (image) payload.image_url = image.uri; // optional, just send URI

      const res = await axios.post(`${BACKEND_URL}/reports`, payload);
      const caseNumber = res.data.case_number;

      Alert.alert('Success', `Report created successfully!\n\nCase Number: ${caseNumber}`);

      // Clear form
      setSelectedSubtype('');
      setDescription('');
      setEmail('');
      setPhone('');
      setFullName('');
      setAge('');
      setLocation('');
      setSchool('');
      setImage(null);
      setSchoolSuggestions([]);

      // Navigate to home after 2 seconds
      setTimeout(() => router.push('/'), 2000);

    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to create report.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Create Report</Text>

      <Text style={styles.label}>Subtype *</Text>
      <Picker selectedValue={selectedSubtype} onValueChange={setSelectedSubtype}>
        <Picker.Item label="Select subtype" value="" />
        {subtypes.map(sub => (
          <Picker.Item key={sub.id} label={sub.sub_type_name} value={sub.id} />
        ))}
      </Picker>

      <Text style={styles.label}>Description *</Text>
      <TextInput style={styles.input} value={description} onChangeText={setDescription} multiline />

      <Text style={styles.label}>Full Name</Text>
      <TextInput style={styles.input} value={fullName} onChangeText={setFullName} />

      <Text style={styles.label}>Email *</Text>
      <TextInput style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" />

      <Text style={styles.label}>Phone</Text>
      <TextInput 
        style={styles.input} 
        value={phone} 
        onChangeText={text => setPhone(text.replace(/[^0-9]/g, ''))} 
        keyboardType="number-pad" 
      />

      <Text style={styles.label}>Age</Text>
      <TextInput 
        style={styles.input} 
        value={age} 
        onChangeText={text => setAge(text.replace(/[^0-9]/g, ''))} 
        keyboardType="number-pad" 
      />

      <Text style={styles.label}>Location</Text>
      <TextInput style={styles.input} value={location} onChangeText={setLocation} />

      <Text style={styles.label}>School</Text>
      <TextInput 
        style={styles.input} 
        value={school} 
        onChangeText={searchSchools} 
        placeholder="Type to search schools..." 
      />
      {/* 🔽 Suggestions Dropdown */}
      {schoolSuggestions.length > 0 && (
        <FlatList
          data={schoolSuggestions}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.suggestionItem} 
              onPress={() => {
                setSchool(item.name);
                setSchoolSuggestions([]);
              }}
            >
              <Text>{item.name}</Text>
            </TouchableOpacity>
          )}
          style={styles.suggestionsList}
        />
      )}

      <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
        <Text style={styles.buttonText}>Pick an optional Image</Text>
      </TouchableOpacity>
      {image && <Image source={{ uri: image.uri }} style={styles.imagePreview} />}

      <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Submitting...' : 'Submit Report'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  label: { marginTop: 10, fontWeight: 'bold' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 10, marginTop: 5 },
  button: { marginTop: 20, backgroundColor: 'purple', padding: 15, borderRadius: 8, alignItems: 'center' },
  imageButton: { marginTop: 10, backgroundColor: '#555', padding: 12, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  imagePreview: { width: 100, height: 100, marginTop: 10, borderRadius: 8 },
  suggestionsList: { maxHeight: 150, backgroundColor: '#f9f9f9', borderWidth: 1, borderColor: '#ccc', borderRadius: 6, marginTop: 5 },
  suggestionItem: { padding: 10, borderBottomWidth: 1, borderBottomColor: '#eee' },
});
