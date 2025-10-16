import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
  FlatList,
  Dimensions,
  Animated,
  Modal,
  Platform,
} from "react-native";
import { useState, useEffect } from "react";
import axios from "axios";
import { Picker } from "@react-native-picker/picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

export default function CreateReportScreen() {
  const BACKEND_URL =
    Platform.OS === "web"
      ? "http://localhost:3000"
      : Platform.OS === "android"
      ? "http://10.0.2.2:3000"
      : "http://192.168.2.116:3000";

  const { abuseTypeId, anonymous } = useLocalSearchParams();
  const router = useRouter();

  const [subtypes, setSubtypes] = useState<any[]>([]);
  const [selectedSubtype, setSelectedSubtype] = useState("");
  const [fullName, setFullName] = useState("");
  const [description, setDescription] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [age, setAge] = useState("");
  const [location, setLocation] = useState("");
  const [school, setSchool] = useState("");
  const [schoolSuggestions, setSchoolSuggestions] = useState<any[]>([]);
  const [image, setImage] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [menuVisible, setMenuVisible] = useState(false);
  const slideAnim = useState(new Animated.Value(width))[0];
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [submittedCaseNumber, setSubmittedCaseNumber] = useState("");

  useEffect(() => {
    if (!abuseTypeId) return;
    axios
      .get(`${BACKEND_URL}/reports/subtypes/${abuseTypeId}`)
      .then((res) => setSubtypes(res.data))
      .catch((err) => console.error("Error fetching subtypes:", err));
  }, [abuseTypeId]);

  useEffect(() => {
    setIsAnonymous(anonymous === "yes");
  }, [anonymous]);

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
    setTimeout(() => router.push(path as any), 250);
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.5,
    });
    if (!result.canceled) setImage(result.assets[0]);
  };

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
      console.error("Error fetching schools:", err);
    }
  };

  const handleSubmit = async () => {
    if (!selectedSubtype || !description || !email) {
      Alert.alert("Error", "Please fill all required fields.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();

      formData.append("abuse_type_id", abuseTypeId as string);
      formData.append("subtype_id", selectedSubtype);
      formData.append("description", description);
      formData.append("reporter_email", email);
      formData.append("phone_number", phone);
      formData.append("full_name", fullName);
      formData.append("age", age);
      formData.append("location", location);
      formData.append("school_name", school);
      formData.append("status", "Pending");
      formData.append("is_anonymous", isAnonymous ? "1" : "0");

      if (image) {
        const response = await fetch(image.uri);
        const blob = await response.blob();

        const base64data = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(blob);
        });

        formData.append("image_base64", base64data as string);
        formData.append("image_filename", `report-${Date.now()}.jpg`);
      }

      const response = await fetch(`${BACKEND_URL}/reports`, {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
      });

      if (!response.ok) throw new Error(`Server error: ${response.status}`);

      const result = await response.json();
      const caseNumber = result.case_number;
      setSubmittedCaseNumber(caseNumber);
      setSuccessModalVisible(true);

      setSelectedSubtype("");
      setDescription("");
      setEmail("");
      setPhone("");
      setFullName("");
      setAge("");
      setLocation("");
      setSchool("");
      setImage(null);
      setSchoolSuggestions([]);
    } catch (err: any) {
      console.error("Submission error:", err);
      Alert.alert("Error", "Failed to create report.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* ✅ Sticky TopBar */}
      <View style={styles.stickyHeader}>
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
      </View>

      {/* ✅ Scrollable Content Below Header */}
      <ScrollView
        contentContainerStyle={[styles.container, { paddingTop: 120 }]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>REPORT CASE</Text>
        {isAnonymous && (
          <Text style={{ color: "black", marginBottom: 10 }}>
            You are reporting anonymously
          </Text>
        )}
        <View style={styles.formWrapper}>
          <View style={styles.row}>
            <View style={styles.field}>
              <Text style={styles.label}>Subtype</Text>
              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={selectedSubtype}
                  onValueChange={setSelectedSubtype}
                  style={styles.picker}
                >
                  <Picker.Item label="Select Subtype" value="" />
                  {subtypes.map((s) => (
                    <Picker.Item
                      key={s.id}
                      label={s.sub_type_name}
                      value={s.id}
                    />
                  ))}
                </Picker>
              </View>
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>Age</Text>
              <TextInput
                style={styles.input}
                value={age}
                keyboardType="number-pad"
                onChangeText={(t) => setAge(t.replace(/[^0-9]/g, ""))}
              />
            </View>
          </View>

          {schoolSuggestions.length > 0 && (
            <View style={styles.suggestionsOverlay}>
              <View style={styles.suggestionsContainer}>
                <Text style={styles.suggestionsTitle}>Select School:</Text>
                <FlatList
                  data={schoolSuggestions}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      onPress={() => {
                        setSchool(item.name);
                        setSchoolSuggestions([]);
                      }}
                      style={styles.suggestionItem}
                    >
                      <Text style={styles.suggestionText}>{item.name}</Text>
                    </TouchableOpacity>
                  )}
                />
                <TouchableOpacity
                  style={styles.closeSuggestionsButton}
                  onPress={() => setSchoolSuggestions([])}
                >
                  <Text style={styles.closeSuggestionsText}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {!isAnonymous && (
            <View>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                style={styles.input}
                value={fullName}
                onChangeText={setFullName}
              />
            </View>
          )}
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />

          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={(t) => setPhone(t.replace(/[^0-9]/g, ""))}
            keyboardType="number-pad"
          />

          <View style={styles.row}>
            <View style={styles.field}>
              <Text style={styles.label}>School Name</Text>
              <TextInput
                style={styles.input}
                value={school}
                onChangeText={searchSchools}
                placeholder="Type to search..."
              />
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>Address</Text>
              <TextInput
                style={styles.input}
                value={location}
                onChangeText={setLocation}
              />
            </View>
          </View>

          <View style={styles.fullField}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.descriptionInput]}
              value={description}
              onChangeText={setDescription}
              multiline
            />
          </View>

          <View style={styles.fullField}>
            <Text style={styles.label}>Attachments:</Text>
            <TouchableOpacity style={styles.fileInput} onPress={pickImage}>
              <Text style={styles.fileInputText}>Choose Files</Text>
            </TouchableOpacity>
            {image && (
              <Image source={{ uri: image.uri }} style={styles.imagePreview} />
            )}
          </View>

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitText}>
              {loading ? "Submitting..." : "Submit"}
            </Text>
          </TouchableOpacity>
        </View>

        <Modal visible={successModalVisible} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>
                Report Submitted Successfully
              </Text>
              <MaterialIcons
                name="check-circle"
                size={60}
                color="#c7da30"
                style={{ marginBottom: 15 }}
              />
              <Text style={styles.modalCase}>
                CASE NUMBER: #{submittedCaseNumber}
              </Text>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => {
                  setSuccessModalVisible(false);
                  router.push("/");
                }}
              >
                <Text style={styles.modalButtonText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>

      {menuVisible && (
        <TouchableOpacity style={styles.overlay} onPress={toggleMenu} />
      )}

      <Animated.View
        style={[styles.menu, { transform: [{ translateX: slideAnim }] }]}
      >
        <TouchableOpacity style={styles.menuItem} onPress={() => handleNavigate("/")}>
          <Text style={styles.menuText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => handleNavigate("/about-us")}>
          <Text style={styles.menuText}>About Us</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => handleNavigate("/contact-us")}>
          <Text style={styles.menuText}>Contact Us</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    backgroundColor: "#fff",
    paddingBottom: 60,
  },
stickyHeader: {
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  backgroundColor: "#fff",
  zIndex: 20,        
  alignItems: "center",
  paddingTop: 40,   
 
},
  topBar: {
    width: "90%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logo: { width: 100, height: 80 },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
    color: "black",
  },
  formWrapper: {
    width: "90%",
    maxWidth: 450,
    borderWidth: 2,
    borderColor: "#c7da30",
    borderRadius: 6,
    padding: 20,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 3,
  },
  row: { flexDirection: "row", justifyContent: "space-between", gap: 10, marginBottom: 15 },
  field: { flex: 1 },
  fullField: { width: "100%", marginBottom: 15 },
  label: { color: "black", marginBottom: 6 },
  input: {
    borderWidth: 2,
    borderColor: "#c7da30",
    borderRadius: 8,
    padding: 10,
    fontSize: 15,
    backgroundColor: "#fff",
  },
  pickerWrapper: {
    borderWidth: 2,
    borderColor: "#c7da30",
    borderRadius: 8,
    overflow: "hidden",
  },
  picker: { height: 40, width: "100%" },
  descriptionInput: { height: 100, textAlignVertical: "top" },
  fileInput: {
    borderWidth: 2,
    borderColor: "#c7da30",
    borderRadius: 8,
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 10,
    justifyContent: "center",
  },
  fileInputText: { color: "#555", fontWeight: "500" },
  imagePreview: {
    width: "100%",
    height: 120,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#c7da30",
    marginTop: 10,
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
  suggestionsOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 1000,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  suggestionsContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    width: "90%",
    maxHeight: "60%",
    borderWidth: 2,
    borderColor: "#c7da30",
  },
  suggestionsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#c7da30",
    marginBottom: 10,
    textAlign: "center",
  },
  suggestionItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    backgroundColor: "#fff",
  },
  suggestionText: { fontSize: 16, color: "#333" },
  closeSuggestionsButton: {
    backgroundColor: "#c7da30",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  closeSuggestionsText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.3)",
    zIndex: 5,
  },
  menu: {
    position: "absolute",
    top: 0,
    right: 0,
    width: width * 0.7,
    height: "100%",
    backgroundColor: "#c7da30",
    paddingTop: 100,
    paddingHorizontal: 20,
    zIndex: 10,
  },
  menuItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#fff",
  },
  menuText: { fontSize: 18, fontWeight: "500", color: "#333" },
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
        color: '#555',
        marginBottom: 25,
        textAlign: 'center',
    },
    modalButton: {
        backgroundColor: '#c7da30',
        paddingVertical: 12,
        paddingHorizontal: 35,
        borderRadius: 30,
    },
    modalButtonText: {
        color: 'black', // Fixed: removed # before black
        fontSize: 16,
    },
});