// // import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
// // import { useState, useEffect } from 'react';
// // import axios from 'axios';
// // import { useLocalSearchParams, useRouter } from 'expo-router';

// // export default function EditReportScreen() {
// //   const BACKEND_URL = 'http://10.36.109.163:3000';
// //   const { case_number } = useLocalSearchParams();
// //   const router = useRouter();

// //   const [report, setReport] = useState<any>(null);
// //   const [loading, setLoading] = useState(false);

// //   // Fetch existing report details
// //   useEffect(() => {
// //     if (!case_number) return;
// //     axios.get(`${BACKEND_URL}/reports/${case_number}`)
// //       .then(res => setReport(res.data))
// //       .catch(err => {
// //         console.error(err);
// //         Alert.alert('Error', 'Failed to fetch report.');
// //       });
// //   }, [case_number]);

// //   const handleUpdate = async () => {
// //     if (!report) return;

// //     setLoading(true);
// //     try {
// //       await axios.put(`${BACKEND_URL}/reports/${case_number}`, {
// //         description: report.description,
// //         phone_number: report.phone_number,
// //         full_name: report.full_name,
// //         age: report.age,
// //         location: report.location,
// //         school_name: report.school_name,
// //         status: report.status,
// //       });

// //       Alert.alert('Success', 'Report updated successfully!', [
// //         { text: 'OK', onPress: () => router.push('/') }
// //       ]);
// //     } catch (err) {
// //       console.error(err);
// //       Alert.alert('Error', 'Failed to update report.');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   if (!report) return <Text style={{ padding: 20 }}>Loading...</Text>;

// //   return (
// //     <ScrollView style={styles.container}>
// //       <Text style={styles.title}>Edit Report - {case_number}</Text>

// //       <Text style={styles.label}>Description</Text>
// //       <TextInput style={styles.input} value={report.description} onChangeText={text => setReport({ ...report, description: text })} multiline />

// //       <Text style={styles.label}>Full Name</Text>
// //       <TextInput style={styles.input} value={report.full_name} onChangeText={text => setReport({ ...report, full_name: text })} />

// //       <Text style={styles.label}>Phone</Text>
// //       <TextInput style={styles.input} value={report.phone_number} onChangeText={text => setReport({ ...report, phone_number: text })} keyboardType="phone-pad" />

// //       <Text style={styles.label}>Age</Text>
// //       <TextInput style={styles.input} value={String(report.age || '')} onChangeText={text => setReport({ ...report, age: text })} keyboardType="numeric" />

// //       <Text style={styles.label}>Location</Text>
// //       <TextInput style={styles.input} value={report.location} onChangeText={text => setReport({ ...report, location: text })} />

// //       <Text style={styles.label}>School</Text>
// //       <TextInput style={styles.input} value={report.school_name} onChangeText={text => setReport({ ...report, school_name: text })} />

// //       <TouchableOpacity style={styles.button} onPress={handleUpdate} disabled={loading}>
// //         <Text style={styles.buttonText}>{loading ? 'Updating...' : 'Update Report'}</Text>
// //       </TouchableOpacity>
// //     </ScrollView>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   container: { flex: 1, padding: 20, backgroundColor: '#fff' },
// //   title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
// //   label: { marginTop: 10, fontWeight: 'bold' },
// //   input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 10, marginTop: 5 },
// //   button: { marginTop: 20, backgroundColor: '#CCDD45', padding: 15, borderRadius: 8, alignItems: 'center' },
// //   buttonText: { color: '#fff', fontWeight: 'bold' },
// // });



// import { 
//   View, 
//   Text, 
//   TextInput, 
//   StyleSheet, 
//   TouchableOpacity, 
//   ScrollView, 
//   Alert 
// } from "react-native";
// import { useState, useEffect } from "react";
// import axios from "axios";
// import { useLocalSearchParams, useRouter } from "expo-router";

// export default function EditReportScreen() {
//   const BACKEND_URL = "http://10.36.109.163:3000"; // ✅ your backend
//   const { case_number } = useLocalSearchParams(); // ✅ get case number
//   const router = useRouter();

//   const [report, setReport] = useState<any>(null);
//   const [loading, setLoading] = useState(false);

//   // ✅ Fetch existing report details
//   useEffect(() => {
//     if (!case_number) return;
//     axios
//       .get(`${BACKEND_URL}/reports/${case_number}`)
//       .then((res) => setReport(res.data))
//       .catch((err) => {
//         console.error(err);
//         Alert.alert("Error", "Failed to fetch report.");
//       });
//   }, [case_number]);

//   // ✅ Handle update
//   const handleUpdate = async () => {
//     if (!report) return;

//     setLoading(true);
//     try {
//       await axios.put(`${BACKEND_URL}/reports/${case_number}`, {
//         description: report.description,
//         phone_number: report.phone_number,
//         full_name: report.full_name,
//         age: report.age,
//         location: report.location,
//         school_name: report.school_name,
//         status: report.status,
//       });

//       Alert.alert("Success", "Report updated successfully!", [
//         { text: "OK", onPress: () => router.push("/") },
//       ]);
//     } catch (err) {
//       console.error(err);
//       Alert.alert("Error", "Failed to update report.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!report) {
//     return <Text style={{ padding: 20 }}>Loading...</Text>;
//   }

//   return (
//     <ScrollView style={styles.container}>
//       <Text style={styles.title}>Edit Report</Text>
//       <Text style={styles.subtitle}>Case Number: {case_number}</Text>

//       {/* Description */}
//       <Text style={styles.label}>Description</Text>
//       <TextInput
//         style={styles.input}
//         value={report.description}
//         onChangeText={(text) => setReport({ ...report, description: text })}
//         multiline
//       />

//       {/* Full Name */}
//       <Text style={styles.label}>Full Name</Text>
//       <TextInput
//         style={styles.input}
//         value={report.full_name}
//         onChangeText={(text) => setReport({ ...report, full_name: text })}
//       />

//       {/* Phone */}
//       <Text style={styles.label}>Phone</Text>
//       <TextInput
//         style={styles.input}
//         value={report.phone_number}
//         onChangeText={(text) => setReport({ ...report, phone_number: text })}
//         keyboardType="phone-pad"
//       />

//       {/* Age */}
//       <Text style={styles.label}>Age</Text>
//       <TextInput
//         style={styles.input}
//         value={String(report.age || "")}
//         onChangeText={(text) => setReport({ ...report, age: text })}
//         keyboardType="numeric"
//       />

//       {/* Location */}
//       <Text style={styles.label}>Location</Text>
//       <TextInput
//         style={styles.input}
//         value={report.location}
//         onChangeText={(text) => setReport({ ...report, location: text })}
//       />

//       {/* School */}
//       <Text style={styles.label}>School</Text>
//       <TextInput
//         style={styles.input}
//         value={report.school_name}
//         onChangeText={(text) => setReport({ ...report, school_name: text })}
//       />

//       {/* Update Button */}
//       <TouchableOpacity
//         style={styles.button}
//         onPress={handleUpdate}
//         disabled={loading}
//       >
//         <Text style={styles.buttonText}>
//           {loading ? "Updating..." : "Update Report"}
//         </Text>
//       </TouchableOpacity>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 20, backgroundColor: "#fff" },
//   title: { fontSize: 22, fontWeight: "bold", marginBottom: 5 },
//   subtitle: { fontSize: 16, color: "#666", marginBottom: 20 },
//   label: { marginTop: 10, fontWeight: "bold" },
//   input: {
//     borderWidth: 1,
//     borderColor: "#ccc",
//     borderRadius: 6,
//     padding: 10,
//     marginTop: 5,
//   },
//   button: {
//     marginTop: 20,
//     backgroundColor: "#CCDD45",
//     padding: 15,
//     borderRadius: 8,
//     alignItems: "center",
//   },
//   buttonText: { color: "#fff", fontWeight: "bold" },
// });




import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Alert 
} from "react-native";
import { useState, useEffect } from "react";
import axios from "axios";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function EditReportScreen() {
  const BACKEND_URL = "http://localhost:3000"; // ✅ your backend
  const { case_number } = useLocalSearchParams(); // ✅ get case number
  const router = useRouter();

  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch existing report details
  useEffect(() => {
    if (!case_number) return;
    axios
      .get(`${BACKEND_URL}/reports/${case_number}`)
      .then((res) => setReport(res.data))
      .catch((err) => {
        console.error(err);
        Alert.alert("Error", "Failed to fetch report.");
      });
  }, [case_number]);

  // ✅ Handle update
  const handleUpdate = async () => {
    if (!report) return;

    setLoading(true);
    try {
      await axios.put(`${BACKEND_URL}/reports/${case_number}`, {
        description: report.description,
        phone_number: report.phone_number,
        full_name: report.full_name,
        age: report.age,
        location: report.location,
        school_name: report.school_name,
        status: report.status,
      });

      // ✅ Clear the form
      setReport(null);

      Alert.alert("Success", "Report updated successfully! Redirecting...");

      // ✅ Redirect after 3 seconds
      setTimeout(() => {
        router.push("/check-status");
      }, 2000);

    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to update report.");
    } finally {
      setLoading(false);
    }
  };

  if (!report) {
    return <Text style={{ padding: 20 }}>Loading...</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Edit Report</Text>
      <Text style={styles.subtitle}>Case Number: {case_number}</Text>

      {/* Description */}
      <Text style={styles.label}>Description</Text>
      <TextInput
        style={styles.input}
        value={report.description}
        onChangeText={(text) => setReport({ ...report, description: text })}
        multiline
      />

      {/* Full Name */}
      <Text style={styles.label}>Full Name</Text>
      <TextInput
        style={styles.input}
        value={report.full_name}
        onChangeText={(text) => setReport({ ...report, full_name: text })}
      />

      {/* Phone */}
      <Text style={styles.label}>Phone</Text>
      <TextInput
        style={styles.input}
        value={report.phone_number}
        onChangeText={(text) => setReport({ ...report, phone_number: text })}
        keyboardType="phone-pad"
      />

      {/* Age */}
      <Text style={styles.label}>Age</Text>
      <TextInput
        style={styles.input}
        value={String(report.age || "")}
        onChangeText={(text) => setReport({ ...report, age: text })}
        keyboardType="numeric"
      />

      {/* Location */}
      <Text style={styles.label}>Location</Text>
      <TextInput
        style={styles.input}
        value={report.location}
        onChangeText={(text) => setReport({ ...report, location: text })}
      />

      {/* School */}
      <Text style={styles.label}>School</Text>
      <TextInput
        style={styles.input}
        value={report.school_name}
        onChangeText={(text) => setReport({ ...report, school_name: text })}
      />

      {/* Update Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={handleUpdate}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Updating..." : "Update Report"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 5 },
  subtitle: { fontSize: 16, color: "#666", marginBottom: 20 },
  label: { marginTop: 10, fontWeight: "bold" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,
    marginTop: 5,
  },
  button: {
    marginTop: 20,
    backgroundColor: "#CCDD45",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
});