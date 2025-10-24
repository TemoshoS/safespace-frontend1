import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Animated,
  Dimensions,
  Image,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";

const { width } = Dimensions.get("window");

export default function EditReportScreen() {
  const BACKEND_URL =
    Platform.OS === "web"
      ? "http://localhost:3000"
      : "http://192.168.2.116:3000";

  const { case_number } = useLocalSearchParams();
  const router = useRouter();

  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [selectedSubtype, setSelectedSubtype] = useState("");
  const [subtypeItems, setSubtypeItems] = useState<any[]>([]);
  const [subtypeOpen, setSubtypeOpen] = useState(false);
  const [image, setImage] = useState<any>(null);

  const [menuVisible, setMenuVisible] = useState(false);
  const slideAnim = useState(new Animated.Value(width))[0];
  const [successModalVisible, setSuccessModalVisible] = useState(false);

  // Fetch report
  useEffect(() => {
    if (!case_number) return;
    axios
      .get(`${BACKEND_URL}/reports/case/${case_number}`)
      .then((res) => {
        setReport(res.data);
        setSelectedSubtype(res.data.subtype_id);
        if (res.data.image_path)
          setImage({ uri: `${BACKEND_URL}${res.data.image_path}` });
      })
      .catch((err) => {
        console.error(err);
        Alert.alert("Error", "Failed to fetch report.");
      });
  }, [case_number]);

  // Fetch subtypes
  useEffect(() => {
    if (!report?.abuse_type_id) return;

    const fetchSubtypes = async () => {
      try {
        const res = await axios.get(
          `${BACKEND_URL}/reports/subtypes/${report.abuse_type_id}`
        );
        const formatted = res.data.map((s: any) => ({
          label: s.sub_type_name,
          value: String(s.id),
        }));
        setSubtypeItems(formatted);
        if (report.subtype_id) setSelectedSubtype(String(report.subtype_id));
      } catch (err) {
        console.error("Failed to fetch subtypes:", err);
        Alert.alert("Error", "Failed to load subtypes. Check your network.");
      }
    };

    fetchSubtypes();
  }, [report?.abuse_type_id]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.5,
    });
    if (!result.canceled) setImage(result.assets[0]);
  };

  const handleUpdate = async () => {
    if (!report) return;

    if (!selectedSubtype || !report.description || !report.reporter_email) {
      Alert.alert("Error", "Please fill all required fields.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("description", report.description);
      formData.append("phone_number", report.phone_number);
      formData.append("full_name", report.full_name);
      formData.append("age", report.age.toString());
      formData.append("location", report.location);
      formData.append("school_name", report.school_name);
      formData.append("status", report.status);
      formData.append("subtype_id", selectedSubtype.toString());

      if (image && image.uri && !image.uri.startsWith("http")) {
        formData.append("image", {
          uri: image.uri,
          name: `report-${Date.now()}.jpg`,
          type: "image/jpeg",
        } as any);
      }

      const response = await axios.put(
        `${BACKEND_URL}/reports/${case_number}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      console.log("Update response:", response.data);
      setSuccessModalVisible(true);
    } catch (err) {
      console.error("Update error:", err);
      Alert.alert("Error", "Failed to update report.");
    } finally {
      setLoading(false);
    }
  };

  const toggleMenu = () => {
    if (menuVisible) {
      Animated.timing(slideAnim, {
        toValue: width,
        duration: 250,
        useNativeDriver: true,
      }).start(() => setMenuVisible(false));
    } else {
      setMenuVisible(true);
      Animated.timing(slideAnim, {
        toValue: width * 0.3,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  };

  const handleNavigate = (path: string) => {
    toggleMenu();
    setTimeout(() => router.push({ pathname: path as any }), 250);
  };

  if (!report)
    return <Text style={{ padding: 20 }}>Loading report details...</Text>;

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()}>
          <Image
            source={require("../assets/images/Logo.jpg")}
            style={styles.logo}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={toggleMenu}>
          <Ionicons name="menu" size={30} color="#c7da30" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Edit Report</Text>
        <Text style={{ marginBottom: 15 }}>Case Number: {case_number}</Text>

        {/* Subtype */}
        <View style={[styles.inputGroup, { zIndex: 9999 }]}>
          <Text style={styles.label}>Subtype</Text>
          <DropDownPicker
            open={subtypeOpen}
            value={selectedSubtype}
            items={subtypeItems}
            setOpen={setSubtypeOpen}
            setValue={setSelectedSubtype}
            setItems={setSubtypeItems}
            placeholder="Select Subtype"
            style={styles.pickerWrapper}
            dropDownContainerStyle={styles.pickerDropdown}
            placeholderStyle={{ color: "#555" }}
            textStyle={{ fontSize: 15, color: "#000" }}
          />
        </View>

        {/* Full Name */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            value={report.full_name}
            onChangeText={(text) =>
              setReport({ ...report, full_name: text })
            }
          />
        </View>

        {/* Email */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={report.reporter_email}
            onChangeText={(text) => setReport({ ...report, reporter_email: text })}
          />
        </View>

        {/* Phone */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Phone</Text>
          <TextInput
            style={styles.input}
            value={report.phone_number}
            onChangeText={(text) =>
              setReport({ ...report, phone_number: text })
            }
            keyboardType="number-pad"
          />
        </View>

        {/* Age */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Age</Text>
          <TextInput
            style={styles.input}
            value={String(report.age || "")}
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
          <TouchableOpacity style={styles.imageCard} onPress={pickImage}>
            {image ? (
              <Image source={{ uri: image.uri }} style={styles.imageInsideCard} />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Text style={{ color: "#555", fontWeight: "500" }}>Choose Image</Text>
                <Ionicons name="camera" size={24} color="#555" style={{ marginLeft: 10 }} />
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Submit */}
        <TouchableOpacity style={styles.submitButton} onPress={handleUpdate}>
          <Text style={styles.submitText}>
            {loading ? "Updating..." : "Update Report"}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Success Modal */}
      <Modal visible={successModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Report Updated Successfully</Text>
            <MaterialIcons
              name="check-circle"
              size={60}
              color="#c7da30"
              style={{ marginBottom: 15 }}
            />
            <Text style={styles.modalCase}>CASE NUMBER: {case_number}</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                setSuccessModalVisible(false);
                router.push("/check-status");
              }}
            >
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Overlay */}
      {menuVisible && <TouchableOpacity style={styles.overlay} onPress={toggleMenu} />}

      {/* Slide-in Menu */}
      <Animated.View
        style={[styles.menu, { transform: [{ translateX: slideAnim }] }]}
      >
        <TouchableOpacity style={styles.menuItem} onPress={() => handleNavigate("/")}>
          <Text style={styles.menuText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => handleNavigate("/check-status")}
        >
          <Text style={styles.menuText}>Check Status</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  logo: { width: 100, height: 50 },
  container: {
    flexGrow: 1,
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  title: { fontSize: 26, fontWeight: "bold", marginBottom: 20, color: "black" },
  inputGroup: { width: "100%", marginBottom: 15 },
  label: { color: "black", marginBottom: 6 },
  input: {
    borderWidth: 2,
    borderColor: "#c7da30",
    borderRadius: 8,
    padding: 10,
    fontSize: 15,
    backgroundColor: "#fff",
    width: "100%",
    height: 48,
  },
  descriptionInput: { height: 100, textAlignVertical: "top" },
  pickerWrapper: {
    borderColor: "#c7da30",
    borderWidth: 2,
    borderRadius: 8,
    backgroundColor: "#fff",
    height: 48,
  },
  pickerDropdown: {
    borderColor: "#c7da30",
    borderWidth: 2,
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  imageCard: {
    borderWidth: 2,
    borderColor: "#c7da30",
    borderRadius: 8,
    backgroundColor: "#fff",
    width: "100%",
    height: 160,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  imageInsideCard: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  imagePlaceholder: {
    flexDirection: "row",
    alignItems: "center",
  },
  submitButton: {
    backgroundColor: "#c7da30",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    width: "100%",
    marginTop: 10,
  },
  submitText: { color: "black", fontSize: 16 },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 25,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
    marginBottom: 10,
  },
  modalCase: {
    fontSize: 15,
    color: "#555",
    marginBottom: 25,
    textAlign: "center",
  },
  modalButton: {
    backgroundColor: "#c7da30",
    paddingVertical: 12,
    paddingHorizontal: 35,
    borderRadius: 30,
  },
  modalButtonText: { color: "black", fontSize: 16 },
  overlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.4)",
    top: 0,
    left: 0,
  },
  menu: {
    position: "absolute",
    width: "70%",
    height: "100%",
    backgroundColor: "#c7da30",
    top: 0,
    right: 0,
    paddingTop: 80,
    paddingHorizontal: 20,
    zIndex: 9999,
  },
  menuItem: { marginBottom: 25 },
  menuText: { fontSize: 18, color: "#333" },
});
