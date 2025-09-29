import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function CreateReportScreen() {
    const BACKEND_URL = 'http://localhost:3000';
    const { abuseTypeId, anonymous } = useLocalSearchParams(); // pick up anonymous param
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
    const [loading, setLoading] = useState(false);
    const [schools, setSchools] = useState<any[]>([]);

    // Fetch subtypes for selected abuse type
    useEffect(() => {
        if (!abuseTypeId) return;
        axios.get(`${BACKEND_URL}/reports/subtypes/${abuseTypeId}`)
            .then(res => setSubtypes(res.data))
            .catch(err => console.error('Error fetching subtypes:', err));
    }, [abuseTypeId]);

    useEffect(() => {
        axios.get(`${BACKEND_URL}/schools`)
            .then(res => setSchools(res.data))
            .catch(err => console.error('Error fetching schools:', err));
    }, []);

    const handleBack = () => {
        router.back(); // Goes back to previous screen
    };

    const handleSubmit = async () => {
        // If anonymous = no, name/email are required
        if (!selectedSubtype || !description || (anonymous === "no" && !email)) {
            Alert.alert('Error', 'Please fill all required fields.');
            return;
        }

        setLoading(true);
        try {
            const payload = {
                abuse_type_id: abuseTypeId,
                subtype_id: selectedSubtype,
                description,
                reporter_email: email,
                phone_number: phone,
                full_name: anonymous === "yes" ? 'anonymous' : fullName,
                age,
                location,
                school_name: school,
                status: 'Pending',
                is_anonymous: anonymous === "yes" ? 1 : 0,
            };

            await axios.post(`${BACKEND_URL}/reports`, payload);

            Alert.alert('Success', 'Report created successfully!', [
                {
                    text: 'OK',
                    onPress: () => router.replace('/'),
                },
            ]);

            // Reset form
            setSelectedSubtype('');
            setDescription('');
            setEmail('');
            setPhone('');
            setFullName('');
            setAge('');
            setLocation('');
            setSchool('');
        } catch (err) {
            console.error(err);
            Alert.alert('Error', 'Failed to create report.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollView}>
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

                {/* Only show name/email if not anonymous */}
                {anonymous === "no" && (
                    <>
                        <Text style={styles.label}>Full Name</Text>
                        <TextInput style={styles.input} value={fullName} onChangeText={setFullName} />

                    </>
                )}


                <Text style={styles.label}>Email *</Text>
                <TextInput style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" />

                <Text style={styles.label}>Phone</Text>
                <TextInput style={styles.input} value={phone} onChangeText={setPhone} keyboardType="phone-pad" />

                <Text style={styles.label}>Age</Text>
                <TextInput style={styles.input} value={age} onChangeText={setAge} keyboardType="numeric" />

                <Text style={styles.label}>Location</Text>
                <TextInput style={styles.input} value={location} onChangeText={setLocation} />

                <Text style={styles.label}>School</Text>
                <View style={styles.pickerContainer}>
                    <Picker
                        selectedValue={school}
                        onValueChange={setSchool}
                        dropdownIconColor="#24ae1a" // optional icon color
                        style={styles.picker}
                    >
                        <Picker.Item label="Select a school" value="" />
                        {schools.map(s => (
                            <Picker.Item key={s.id} label={s.Institution_Name} value={s.Institution_Name} />
                        ))}
                    </Picker>
                </View>


                <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
                    <Text style={styles.buttonText}>{loading ? 'Submitting...' : 'Submit Report'}</Text>
                </TouchableOpacity>
            </ScrollView>

            {/* Back Arrow Button - Added at the bottom */}
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                <Ionicons name="arrow-back" size={24} color="#24ae1a" />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    scrollView: { padding: 20 },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
    label: { marginTop: 10, fontWeight: 'bold' },
    input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 10, marginTop: 5 },
    button: { marginTop: 20, backgroundColor: '#24ae1a', padding: 15, borderRadius: 8, alignItems: 'center' },
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
    pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    overflow: 'hidden',
    marginTop: 5,
    backgroundColor: '#f9f9f9',
},
picker: {
    height: 40, // smaller height
    width: '100%',
    color: '#333',
    paddingHorizontal: 10,
},

})