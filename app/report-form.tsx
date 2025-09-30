import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function CreateReportScreen() {
    const BACKEND_URL = 'http://localhost:3000';
    const { abuseTypeId, anonymous } = useLocalSearchParams(); 
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
    const [schools, setSchools] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    // Fetch subtypes
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
        const selectedSubtypeObj = subtypes.find(s => s.id === selectedSubtype);

        if (!selectedSubtype) {
            Alert.alert('Error', 'Please select a subtype.');
            return;
        }

        if (selectedSubtypeObj?.sub_type_name === "Other" && !description) {
            Alert.alert('Error', 'Please provide a description for "Other".');
            return;
        }

        if (anonymous === "no" && !email) {
            Alert.alert('Error', 'Email is required.');
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
                { text: 'OK', onPress: () => router.replace('/') },
            ]);

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
        <ScrollView style={styles.container}>
            {/* Go Back button */}
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                <Text style={styles.backButtonText}>← Back</Text>
            </TouchableOpacity>

            <Text style={styles.title}>Create Report</Text>

            <Text style={styles.label}>Subtype *</Text>
            <Picker selectedValue={selectedSubtype} onValueChange={setSelectedSubtype}>
                <Picker.Item label="Select subtype" value="" />
                {[...subtypes.filter(s => s.sub_type_name !== "Other"), 
                  ...subtypes.filter(s => s.sub_type_name === "Other")
                ].map(sub => (
                    <Picker.Item key={sub.id} label={sub.sub_type_name} value={sub.id} />
                ))}
            </Picker>

            <Text style={styles.label}>
                Description {selectedSubtype ? (subtypes.find(s => s.id === selectedSubtype)?.sub_type_name === "Other" ? '*' : '') : ''}
            </Text>
            <TextInput style={styles.input} value={description} onChangeText={setDescription} multiline />

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
                    dropdownIconColor="#24ae1a"
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
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#fff' },
    backButton: {
        marginBottom: 10,
        padding: 8,
        alignSelf: 'flex-start',
    },
    backButtonText: {
        color: '#CCDD45',
        fontSize: 16,
        fontWeight: 'bold',
    },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
    label: { marginTop: 10, fontWeight: 'bold' },
    input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 10, marginTop: 5 },
    button: { marginTop: 20, backgroundColor: '#CCDD45', padding: 15, borderRadius: 8, alignItems: 'center' },
    buttonText: { color: '#fff', fontWeight: 'bold' },
    pickerContainer: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        overflow: 'hidden',
        marginTop: 5,
        backgroundColor: '#f9f9f9',
    },
    picker: {
        height: 40,
        width: '100%',
        color: '#333',
        paddingHorizontal: 10,
    },
});
