import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
  Modal,
  Dimensions,
  Platform
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons } from "@expo/vector-icons";

const { width } = Dimensions.get('window');

export default function EditReportScreen() {
  const BACKEND_URL =
  Platform.OS === "web"
    ? "http://localhost:3000" // ✅ Web browser
    : Platform.OS === "android"
    ? "http://10.0.2.2:3000" // ✅ Android emulator
    : "http://192.168.2.116:3000"; // ✅ iOS simulator (Mac) or physical device
  
  const { case_number } = useLocalSearchParams();
  const router = useRouter();

  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [subtypes, setSubtypes] = useState<any[]>([]);
  const [selectedSubtype, setSelectedSubtype] = useState('');
  const [image, setImage] = useState<any>(null);
  const [successModalVisible, setSuccessModalVisible] = useState(false);

  // Fetch report
  useEffect(() => {
    if (!case_number) return;
    axios.get(`${BACKEND_URL}/reports/case/${case_number}`)
      .then(res => {
        setReport(res.data);
        setSelectedSubtype(res.data.subtype_id);
        if (res.data.image_url) setImage({ uri: `${BACKEND_URL}${res.data.image_url}` });
      })
      .catch(err => {
        console.error(err);
        Alert.alert("Error", "Failed to fetch report.");
      });
  }, [case_number]);

  // Fetch subtypes
 useEffect(() => {
  if (!report?.abuse_type_id) return;

  const fetchSubtypes = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/reports/subtypes/${report.abuse_type_id}`);
      console.log("Subtypes fetched:", res.data); // debug
      // Ensure each value is a string for Picker
      const formatted = res.data.map((s: any) => ({
        ...s,
        id: String(s.id),
      }));
      setSubtypes(formatted);

      // Set default selected subtype if report has one
      if (report.subtype_id) setSelectedSubtype(String(report.subtype_id));
    } catch (err) {
      console.error("Failed to fetch subtypes:", err);
      Alert.alert("Error", "Failed to load subtypes. Check your network.");
    }
  };

  fetchSubtypes();
}, [report?.abuse_type_id]);

  // Pick new image
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.5,
    });
    if (!result.canceled) setImage(result.assets[0]);
  };

  // Update report
  const handleUpdate = async () => {
  if (!report) return;

  if (!selectedSubtype || !report.description || !report.reporter_email) {
    Alert.alert("Error", "Please fill all required fields.");
    return;
  }

  setLoading(true);
  try {
    const formData = new FormData();
    formData.append('description', report.description);
    formData.append('phone_number', report.phone_number);
    formData.append('full_name', report.full_name);
    formData.append('age', report.age.toString());
    formData.append('location', report.location);
    formData.append('school_name', report.school_name);
    formData.append('status', report.status);
    formData.append('subtype_id', selectedSubtype.toString());

    // Only upload new image
    if (image && image.uri && !image.uri.startsWith('http')) {
      formData.append('image', {
        uri: image.uri,
        name: `report-${Date.now()}.jpg`,
        type: 'image/jpeg',
      } as any);
    }

    const response = await axios.put(
      `${BACKEND_URL}/reports/${case_number}`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );

    console.log('Update response:', response.data);
    setSuccessModalVisible(true);
  } catch (err) {
    console.error('Update error:', err);
    Alert.alert("Error", "Failed to update report.");
  } finally {
    setLoading(false);
  }
};



  if (!report) return <Text style={{ padding: 20 }}>Loading...</Text>;

  return (
    <ScrollView contentContainerStyle={styles.container}>
       <TouchableOpacity onPress={() => router.back()}>
                <Image
                  source={require('../assets/images/Logo.jpg')}
                  style={styles.logo}
                  resizeMode="contain"
                />
              </TouchableOpacity>
      <Text style={styles.title}>Edit Report</Text>
      <Text style={{ marginBottom: 15 }}>Case Number: {case_number}</Text>

  {/* Subtype */}
     <View style={styles.inputGroup}>
  <Text style={styles.label}>Subtype</Text>
  <View style={styles.pickerWrapper}>
    <Picker
      selectedValue={selectedSubtype}
      onValueChange={(value) => setSelectedSubtype(value)}
      style={styles.picker}
    >
      <Picker.Item label="Select Subtype" value="" />
      {subtypes.map((s) => (
        <Picker.Item key={s.id} label={s.sub_type_name} value={s.id} />
      ))}
    </Picker>
  </View>
</View>
      {/* Full Name */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={styles.input}
          value={report.full_name}
          onChangeText={(text) => setReport({ ...report, full_name: text })}
        />
      </View>

      {/* Email */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={report.reporter_email}
          onChangeText={(text) => setReport({ ...report, email: text })}
        />
      </View>

      {/* Phone */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Phone</Text>
        <TextInput
          style={styles.input}
          value={report.phone_number}
          onChangeText={(text) => setReport({ ...report, phone_number: text })}
          keyboardType="number-pad"
        />
      </View>

      {/* Age */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Age</Text>
        <TextInput
          style={styles.input}
          value={String(report.age || '')}
          onChangeText={(text) => setReport({ ...report, age: text })}
          keyboardType="numeric"
        />
      </View>

     

      {/* Address */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Address</Text>
        <TextInput
          style={styles.input}
          value={report.location}
          onChangeText={(text) => setReport({ ...report, location: text })}
        />
      </View>

      {/* School */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>School</Text>
        <TextInput
          style={styles.input}
          value={report.school_name}
          onChangeText={(text) => setReport({ ...report, school_name: text })}
        />
      </View>

      {/* Description */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.descriptionInput]}
          value={report.description}
          onChangeText={(text) => setReport({ ...report, description: text })}
          multiline
        />
      </View>

      {/* Image */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Attachment</Text>
        <TouchableOpacity style={styles.fileInput} onPress={pickImage}>
          <Text style={styles.fileInputText}>Choose File</Text>
        </TouchableOpacity>
        {image && <Image source={{ uri: image.uri }} style={styles.imagePreview} />}
      </View>

      {/* Submit */}
      <TouchableOpacity style={styles.submitButton} onPress={handleUpdate}>
        <Text style={styles.submitText}>{loading ? "Updating..." : "Update Report"}</Text>
      </TouchableOpacity>

      {/* Success Modal */}
      <Modal visible={successModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Report Updated Successfully</Text>
            <MaterialIcons name="check-circle" size={60} color="#c7da30" style={{ marginBottom: 15 }} />
            <Text style={styles.modalCase}>CASE NUMBER: #{case_number}</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                setSuccessModalVisible(false);
                router.push('/check-status');
              }}
            >
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, alignItems: 'center', backgroundColor: '#fff', paddingVertical: 40, paddingHorizontal: 20 },
  logo: {
    width: 100,
    height: 100,
  },
  title: { fontSize: 26, fontWeight: 'bold', marginBottom: 20, color: 'black' },
  inputGroup: { width: '100%', marginBottom: 15 },
  label: { color: 'black', marginBottom: 6 },
  input: { borderWidth: 2, borderColor: '#c7da30', borderRadius: 8, padding: 10, fontSize: 15, backgroundColor: '#fff', width: '100%', height: 48 },
  descriptionInput: { height: 100, textAlignVertical: 'top' },
  pickerWrapper: { borderWidth: 2, borderColor: '#c7da30', borderRadius: 8, overflow: 'hidden', height: 48, justifyContent: 'center' },
  picker: { height: '100%', width: '100%' },
  fileInput: { borderWidth: 2, borderColor: '#c7da30', borderRadius: 8, backgroundColor: '#fff', paddingVertical: 12, paddingHorizontal: 10, justifyContent: 'center' },
  fileInputText: { color: '#555', fontWeight: '500' },
  imagePreview: { width: '100%', height: 120, borderRadius: 8, borderWidth: 2, borderColor: '#c7da30', marginTop: 10 },
  submitButton: { backgroundColor: '#c7da30', paddingVertical: 14, borderRadius: 8, alignItems: 'center', width: '100%', marginTop: 10 },
  submitText: { color: 'black', fontSize: 16 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContainer: { width: '85%', backgroundColor: '#fff', borderRadius: 12, padding: 25, alignItems: 'center' },
  modalTitle: { fontSize: 16, fontWeight: 'bold', color: '#000', textAlign: 'center', marginBottom: 10 },
  modalCase: { fontSize: 15, color: '#555', marginBottom: 25, textAlign: 'center' },
  modalButton: { backgroundColor: '#c7da30', paddingVertical: 12, paddingHorizontal: 35, borderRadius: 30 },
  modalButtonText: { color: 'black', fontSize: 16 },
});
