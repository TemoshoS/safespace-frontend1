
// import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import * as ImagePicker from 'expo-image-picker';
// import { Picker } from '@react-native-picker/picker';

// export default function CreateReportScreen() {
//   const BACKEND_URL = 'http://10.36.109.163:3000'; // your PC IP

//   const [abuseTypes, setAbuseTypes] = useState<any[]>([]);
//   const [subtypes, setSubtypes] = useState<any[]>([]);
//   const [selectedAbuseType, setSelectedAbuseType] = useState('');
//   const [selectedSubtype, setSelectedSubtype] = useState('');
//   const [fullName, setFullName] = useState('');
//   const [description, setDescription] = useState('');
//   const [email, setEmail] = useState('');
//   const [phone, setPhone] = useState('');
//   const [age, setAge] = useState('');
//   const [location, setLocation] = useState('');
//   const [school, setSchool] = useState('');
//   const [image, setImage] = useState<any>(null);
//   const [loading, setLoading] = useState(false);

//   // Fetch abuse types
//   useEffect(() => {
//     axios.get(`${BACKEND_URL}/abuse_types`)
//       .then(res => setAbuseTypes(res.data))
//       .catch(err => console.error('Error fetching abuse types:', err));
//   }, []);

//   // Fetch subtypes when abuse type changes
//   useEffect(() => {
//     if (!selectedAbuseType) return;
//     axios.get(`${BACKEND_URL}/reports/subtypes/${selectedAbuseType}`)
//       .then(res => setSubtypes(res.data))
//       .catch(err => console.error('Error fetching subtypes:', err));
//   }, [selectedAbuseType]);

//   // Pick image (optional)
//   const pickImage = async () => {
//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsEditing: true,
//       quality: 0.7,
//     });
//     if (!result.canceled) {
//       setImage(result.assets[0]);
//     }
//   };

//   // Submit report
//   const handleSubmit = async () => {
//     if (!selectedAbuseType || !selectedSubtype || !description || !email) {
//       Alert.alert('Error', 'Please fill all required fields.');
//       return;
//     }

//     setLoading(true);
//     try {
//       const payload = {
//         abuse_type_id: selectedAbuseType,
//         subtype_id: selectedSubtype,
//         description,
//         reporter_email: email,
//         phone_number: phone,
//         full_name: fullName,
//         age,
//         location,
//         school_name: school,
//         status: 'Pending',
//         is_anonymous: 0,
//         image_path: null, // optional, remove if using image
//       };

//       const res = await axios.post(`${BACKEND_URL}/reports`, payload);
//       Alert.alert('Success', `Report created! ID: ${res.data.reportId}`);

//       // Clear form
//       setSelectedAbuseType('');
//       setSelectedSubtype('');
//       setDescription('');
//       setEmail('');
//       setPhone('');
//       setFullName('');
//       setAge('');
//       setLocation('');
//       setSchool('');
//       setImage(null);
//     } catch (err: any) {
//       console.error(err);
//       Alert.alert('Error', 'Failed to create report. Check your backend.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <ScrollView style={styles.container}>
//       <Text style={styles.title}>Create Report</Text>

//       <Text style={styles.label}>Abuse Type *</Text>
//       <Picker selectedValue={selectedAbuseType} onValueChange={setSelectedAbuseType}>
//         <Picker.Item label="Select abuse type" value="" />
//         {abuseTypes.map(type => (
//           <Picker.Item key={type.id} label={type.type_name} value={type.id} />
//         ))}
//       </Picker>

//       <Text style={styles.label}>Subtype *</Text>
//       <Picker selectedValue={selectedSubtype} onValueChange={setSelectedSubtype}>
//         <Picker.Item label="Select subtype" value="" />
//         {subtypes.map(sub => (
//           <Picker.Item key={sub.id} label={sub.sub_type_name} value={sub.id} />
//         ))}
//       </Picker>

//       <Text style={styles.label}>Description *</Text>
//       <TextInput style={styles.input} value={description} onChangeText={setDescription} multiline />

//       <Text style={styles.label}>Full Name</Text>
//       <TextInput style={styles.input} value={fullName} onChangeText={setFullName} />

//       <Text style={styles.label}>Email *</Text>
//       <TextInput style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" />

//       <Text style={styles.label}>Phone</Text>
//       <TextInput style={styles.input} value={phone} onChangeText={setPhone} keyboardType="phone-pad" />

//       <Text style={styles.label}>Age</Text>
//       <TextInput style={styles.input} value={age} onChangeText={setAge} keyboardType="numeric" />

//       <Text style={styles.label}>Location</Text>
//       <TextInput style={styles.input} value={location} onChangeText={setLocation} />

//       <Text style={styles.label}>School</Text>
//       <TextInput style={styles.input} value={school} onChangeText={setSchool} />

//       {/* Optional Image Picker */}
//       <TouchableOpacity style={styles.button} onPress={pickImage}>
//         <Text style={styles.buttonText}>Pick Image (Optional)</Text>
//       </TouchableOpacity>
//       {image && <Image source={{ uri: image.uri }} style={{ width: 100, height: 100, marginTop: 10 }} />}

//       <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
//         <Text style={styles.buttonText}>{loading ? 'Submitting...' : 'Submit Report'}</Text>
//       </TouchableOpacity>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 20, backgroundColor: '#fff' },
//   title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
//   label: { marginTop: 10, fontWeight: 'bold' },
//   input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 10, marginTop: 5 },
//   button: { marginTop: 20, backgroundColor: 'purple', padding: 15, borderRadius: 8, alignItems: 'center' },
//   buttonText: { color: '#fff', fontWeight: 'bold' },
// });





import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';

export default function CreateReportScreen() {
  const BACKEND_URL = 'http://10.36.109.163:3000'; // your PC IP

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
  const [loading, setLoading] = useState(false);

  // Fetch abuse types
  useEffect(() => {
    axios.get(`${BACKEND_URL}/abuse_types`)
      .then(res => setAbuseTypes(res.data))
      .catch(err => console.error('Error fetching abuse types:', err));
  }, []);

  // Fetch subtypes
  useEffect(() => {
    if (!selectedAbuseType) return;
    axios.get(`${BACKEND_URL}/reports/subtypes/${selectedAbuseType}`)
      .then(res => setSubtypes(res.data))
      .catch(err => console.error('Error fetching subtypes:', err));
  }, [selectedAbuseType]);

  // Submit report
  const handleSubmit = async () => {
    if (!selectedAbuseType || !selectedSubtype || !description || !email) {
      Alert.alert('Error', 'Please fill all required fields.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        abuse_type_id: selectedAbuseType,
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

      const res = await axios.post(`${BACKEND_URL}/reports`, payload);

      Alert.alert('Success', 'Report created successfully!');

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
        {abuseTypes.map(type => (
          <Picker.Item key={type.id} label={type.type_name} value={type.id} />
        ))}
      </Picker>

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
      <TextInput style={styles.input} value={phone} onChangeText={setPhone} keyboardType="phone-pad" />

      <Text style={styles.label}>Age</Text>
      <TextInput style={styles.input} value={age} onChangeText={setAge} keyboardType="numeric" />

      <Text style={styles.label}>Location</Text>
      <TextInput style={styles.input} value={location} onChangeText={setLocation} />

      <Text style={styles.label}>School</Text>
      <TextInput style={styles.input} value={school} onChangeText={setSchool} />

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
  buttonText: { color: '#fff', fontWeight: 'bold' },
});


