import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Picker, Image, Switch, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';

export default function CreateReportScreen() {
  const BACKEND_URL = 'http://10.168.231.163:3000'; // replace with your PC IP

  const [abuseTypes, setAbuseTypes] = useState<any[]>([]);
  const [subtypes, setSubtypes] = useState<any[]>([]);
  const [selectedAbuseType, setSelectedAbuseType] = useState('');
  const [selectedSubtype, setSelectedSubtype] = useState('');
  const [fullName, setFullName] = useState('');
  const [description, setDescription] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [age, setAge] = useState('');
  const [location, setLocation] = useState('');
  const [school, setSchool] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [image, setImage] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Fetch abuse types on mount
  useEffect(() => {
    axios.get(`${BACKEND_URL}/abuse_types`)
      .then(res => setAbuseTypes(res.data))
      .catch(err => console.error('Error fetching abuse types:', err));
  }, []);

  // Fetch subtypes when abuse type changes
  useEffect(() => {
    if (!selectedAbuseType) return;
    axios.get(`${BACKEND_URL}/subtypes/${selectedAbuseType}`)
      .then(res => setSubtypes(res.data))
      .catch(err => console.error('Error fetching subtypes:', err));
  }, [selectedAbuseType]);

  // Pick image
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });
    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };

  const handleSubmit = async () => {
    if (!selectedAbuseType || !selectedSubtype || !description || !email) {
      Alert.alert('Error', 'Please fill all required fields.');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('abuse_type_id', selectedAbuseType);
      formData.append('subtype_id', selectedSubtype);
      formData.append('description', description);
      formData.append('reporter_email', email);
      formData.append('phone_number', phone);
      formData.append('full_name', fullName);
      formData.append('age', age);
      formData.append('location', location);
      formData.append('school_name', school);
      formData.append('is_anonymous', isAnonymous ? '1' : '0');

      if (image) {
        formData.append('image_path', {
          uri: image.uri,
          name: 'photo.jpg',
          type: 'image/jpeg',
        } as any);
      }

      const res = await axios.post(`${BACKEND_URL}/abuse_reports`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      Alert.alert('Success', `Case created! Case Number: ${res.data.case.case_number}`);
      // Clear form
      setSelectedAbuseType('');
      setSelectedSubtype('');
      setDescription('');
      setEmail('');
      setPhone('');
      setFullName('');
      setAge('');
      setLocation('');
      setSchool('');
      setImage(null);
      setIsAnonymous(false);
    } catch (err: any) {
      console.error(err);
      Alert.alert('Error', 'Failed to create report. Check your backend.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Create Report</Text>

      <Text style={styles.label}>Abuse Type *</Text>
      <Picker selectedValue={selectedAbuseType} onValueChange={setSelectedAbuseType}>
        <Picker.Item label="Select abuse type" value="" />
        {abuseTypes.map(type => <Picker.Item key={type.id} label={type.type_name} value={type.id} />)}
      </Picker>

      <Text style={styles.label}>Subtype *</Text>
      <Picker selectedValue={selectedSubtype} onValueChange={setSelectedSubtype}>
        <Picker.Item label="Select subtype" value="" />
        {subtypes.map(sub => <Picker.Item key={sub.id} label={sub.sub_type_name} value={sub.id} />)}
      </Picker>

      <Text style={styles.label}>Description *</Text>
      <TextInput style={styles.input} value={description} onChangeText={setDescription} multiline />

      <Text style={styles.label}>Full Name</Text>
      <TextInput style={styles.input} value={fullName} onChangeText={setFullName} />

      <Text style={styles.label}>Email *</Text>
      <TextInput style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" />

      <Text style={styles.label}>Phone</Text>
      <TextInput style={styles.input} value={phone} onChangeText={setPhone} keyboardType="phone-pad" />

      <Text style={styles.label}>Age</Text>
      <TextInput style={styles.input} value={age} onChangeText={setAge} keyboardType="numeric" />

      <Text style={styles.label}>Location</Text>
      <TextInput style={styles.input} value={location} onChangeText={setLocation} />

      <Text style={styles.label}>School</Text>
      <TextInput style={styles.input} value={school} onChangeText={setSchool} />

      <View style={styles.switchContainer}>
        <Text>Anonymous Report</Text>
        <Switch value={isAnonymous} onValueChange={setIsAnonymous} />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Submitting...' : 'Submit Report'}</Text>
      </TouchableOpacity>

      {image && <Image source={{ uri: image.uri }} style={{ width: 100, height: 100, marginTop: 10 }} />}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  label: { marginTop: 10, fontWeight: 'bold' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 10, marginTop: 5 },
  button: { marginTop: 20, backgroundColor: 'purple', padding: 15, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  switchContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
});
