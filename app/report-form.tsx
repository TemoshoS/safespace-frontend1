import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Animated,
  Dimensions,
  FlatList,
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

export default function CreateReportScreen() {
  const BACKEND_URL =
    Platform.OS === "web"
      ? "http://localhost:3000"
      : "http://192.168.2.116:3000";

  const { abuseTypeId, abuseTypeName, anonymous } = useLocalSearchParams();
  const router = useRouter();

  const [subtypes, setSubtypes] = useState<any[]>([]);
  const [selectedSubtype, setSelectedSubtype] = useState("");
  const [subtypeOpen, setSubtypeOpen] = useState(false);
  const [subtypeItems, setSubtypeItems] = useState<any[]>([]);

  const [fullName, setFullName] = useState("");
  const [description, setDescription] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [age, setAge] = useState("");
  const [location, setLocation] = useState("");
  const [grade, setGrade] = useState("");
  const [gradeOpen, setGradeOpen] = useState(false);
  const [gradeItems, setGradeItems] = useState<any[]>([
    { label: "Creche", value: "Creche" },
    { label: "Grade R", value: "Grade R" },
    ...Array.from({ length: 12 }, (_, i) => ({
      label: `Grade ${i + 1}`,
      value: `Grade ${i + 1}`,
    })),
  ]);
  const [school, setSchool] = useState("");
  const [schoolSuggestions, setSchoolSuggestions] = useState<any[]>([]);
  const [image, setImage] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [menuVisible, setMenuVisible] = useState(false);
  const slideAnim = useState(new Animated.Value(width))[0];
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [submittedCaseNumber, setSubmittedCaseNumber] = useState("");

  // Fetch subtypes
  useEffect(() => {
    if (!abuseTypeId) return;
    axios
      .get(`${BACKEND_URL}/reports/subtypes/${abuseTypeId}`)
      .then((res) => setSubtypes(res.data))
      .catch((err) => console.error("Error fetching subtypes:", err));
  }, [abuseTypeId]);

  // Convert subtypes to dropdown items
  useEffect(() => {
    setSubtypeItems(
      subtypes.map((s) => ({ label: s.sub_type_name, value: String(s.id) }))
    );
  }, [subtypes]);

  useEffect(() => {
    if (anonymous === "yes") setIsAnonymous(true);
    else setIsAnonymous(false);
  }, [anonymous]);

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
    const selectedSubtypeObj = subtypes.find(
      (s) => s.id === selectedSubtype
    );
    const subtypeName = selectedSubtypeObj?.sub_type_name || "";

    if (!selectedSubtype) {
      Alert.alert("Error", "Please select a subtype.");
      return;
    }
    if (!email) {
      Alert.alert("Error", "Please enter your email.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Error", "Please enter a valid email address.");
      return;
    }
    if (subtypeName === "Other" && !description.trim()) {
      Alert.alert("Error", 'Description is required when selecting "Other".');
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
        try {
          const response = await fetch(image.uri);
          const blob = await response.blob();
          const base64data = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(blob);
          });
          formData.append("image_base64", base64data as string);
          formData.append("image_filename", `report-${Date.now()}.jpg`);
        } catch (base64Error) {
          console.error("Error converting image to base64:", base64Error);
        }
      }

      const response = await fetch(`${BACKEND_URL}/reports`, {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server error: ${response.status}`);
      }

      const result = await response.json();
      const caseNumber = result.case_number;
      setSubmittedCaseNumber(caseNumber);
      setSuccessModalVisible(true);

      // Clear form
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

  const handleNavigate = (path: string) => {
    toggleMenu();
    setTimeout(() => {
      router.push({ pathname: path as any });
    }, 250);
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
        <Text style={styles.title}>REPORT CASE</Text>
        {isAnonymous && (
          <Text style={{ color: "black", marginBottom: 10 }}>
            You are reporting anonymously
          </Text>
        )}
        <Text style={styles.abuseTypeText}>Abuse Type: {abuseTypeName}</Text>

        <View style={styles.formWrapper}>
          {/* Only show Subtype + Grade when school suggestions are closed */}
          {schoolSuggestions.length === 0 && (
            <>
              {/* Subtype */}
              <View style={styles.fullField}>
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
                  dropDownContainerStyle={{ borderColor: "#c7da30" }}
                  zIndex={5000}
                />
              </View>
            </>
          )}

          {/* Age + School */}
          <View style={styles.row}>
            <View style={styles.field}>
              <Text style={styles.label}>Age</Text>
              <TextInput
                style={styles.input}
                value={age}
                keyboardType="number-pad"
                onChangeText={(t) => setAge(t.replace(/[^0-9]/g, ""))}
              />
            </View>
            <View style={styles.fieldLast}>
              <Text style={styles.label}>School Name</Text>
              <TextInput
                style={styles.input}
                value={school}
                onChangeText={searchSchools}
                placeholder="start typing school name..."
                placeholderTextColor="#999"
              />
            </View>
          </View>

          {/* School suggestions overlay */}
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

          {/* Grade dropdown only visible when no suggestions */}
          {schoolSuggestions.length === 0 && (
            <View style={styles.row}>
              <View style={styles.fieldLast}>
                <Text style={styles.label}>Grade</Text>
                <DropDownPicker
                  open={gradeOpen}
                  value={grade}
                  items={gradeItems}
                  setOpen={setGradeOpen}
                  setValue={setGrade}
                  setItems={setGradeItems}
                  placeholder="Select Grade"
                  style={styles.pickerWrapper}
                  dropDownContainerStyle={{ borderColor: "#c7da30" }}
                  zIndex={4000}
                />
              </View>
            </View>
          )}

          {!isAnonymous && (
            <View style={styles.fullField}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                style={styles.input}
                value={fullName}
                onChangeText={setFullName}
              />
            </View>
          )}

          {/* Email + Phone */}
          <View style={styles.row}>
            <View style={styles.field}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
              />
            </View>
            <View style={styles.fieldLast}>
              <Text style={styles.label}>Phone Number</Text>
              <TextInput
                style={styles.input}
                value={phone}
                onChangeText={(t) => setPhone(t.replace(/[^0-9]/g, ""))}
                keyboardType="number-pad"
              />
            </View>
          </View>

          {/* Address */}
          <View style={styles.fullField}>
            <Text style={styles.label}>Address</Text>
            <TextInput
              style={styles.input}
              value={location}
              onChangeText={setLocation}
            />
          </View>

          {/* Description */}
          <View style={styles.fullField}>
            <Text style={styles.label}>
              Description{" "}
              {subtypes.find((s) => String(s.id) === selectedSubtype)
                ?.sub_type_name === "Other" ? (
                <Text style={{ color: "red" }}>(Required)</Text>
              ) : (
                <Text style={{ color: "grey" }}>(Optional)</Text>
              )}
            </Text>
            <TextInput
              style={[styles.input, styles.descriptionInput]}
              value={description}
              onChangeText={setDescription}
              multiline
            />
          </View>

          {/* Attachments */}
          <View style={styles.fullField}>
            <Text style={styles.label}>Attachments (Optional)</Text>

            <View style={styles.filePickerWrapper}>
              <TouchableOpacity
                style={styles.chooseFileButton}
                onPress={pickImage}
              >
                <Text style={styles.chooseFileText}>Choose File</Text>
              </TouchableOpacity>
              <Text style={styles.fileNameText}>
                {image ? image.uri.split("/").pop() : "No file chosen"}
              </Text>
            </View>

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
      </ScrollView>

      {/* Success Modal */}
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
              CASE NUMBER: {submittedCaseNumber}
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

      {/* Overlay */}
      {menuVisible && <TouchableOpacity style={styles.overlay} onPress={toggleMenu} />}

      {/* Slide-in Menu */}
      <Animated.View
        style={[styles.menu, { transform: [{ translateX: slideAnim }] }]}
      >
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => handleNavigate("/")}
        >
          <Text style={styles.menuText}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => handleNavigate("/abuse-types")}
        >
          <Text style={styles.menuText}>Go Back</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingBottom: 40, alignItems: 'center', width: '100%', paddingHorizontal: 10 },
  topBar: { flexDirection: 'row', width: '100%', maxWidth: 450, justifyContent: 'space-between', alignItems: 'center', marginTop: 40, marginBottom: 20, zIndex: 100, paddingHorizontal: 10 },
  logo: { width: 100, height: 80 },
  title: { fontSize: 26, fontWeight: 'bold', marginBottom: 20, color: 'black' },
  abuseTypeText: { fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
  formWrapper: { width: '100%', maxWidth: 450, borderWidth: 2, borderColor: '#c7da30', borderRadius: 6, padding: 20, backgroundColor: '#fff', shadowColor: '#000', shadowOpacity: 0.1, shadowOffset: { width: 0, height: 3 }, shadowRadius: 5, elevation: 3 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  field: { flex: 1, marginRight: 10 },
  fieldLast: { flex: 1, marginRight: 0 },
  fullField: { width: '100%', marginBottom: 15 },
  label: { color: 'black', marginBottom: 6 },
  input: { borderWidth: 2, borderColor: '#c7da30', borderRadius: 8, padding: 10, fontSize: 15, backgroundColor: '#fff' },
  pickerWrapper: { borderWidth: 2, borderColor: '#c7da30', borderRadius: 8, overflow: 'hidden' },
  descriptionInput: { height: 100, textAlignVertical: 'top' },
  fileInput: { borderWidth: 2, borderColor: '#c7da30', borderRadius: 8, backgroundColor: '#fff', paddingVertical: 12, paddingHorizontal: 10, justifyContent: 'center' },
  fileInputText: { color: '#555', fontWeight: '500' },
  submitButton: { backgroundColor: '#c7da30', paddingVertical: 14, borderRadius: 8, alignItems: 'center', width: '100%', marginTop: 10 },
  submitText: { color: 'black', fontSize: 16 },
  suggestionsOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 1000, justifyContent: 'center', alignItems: 'center', padding: 20 },
  suggestionsContainer: { backgroundColor: '#fff', borderRadius: 12, padding: 16, width: '90%', maxHeight: '50%', borderWidth: 2, borderColor: '#c7da30', shadowColor: '#000', shadowOpacity: 0.3, shadowOffset: { width: 0, height: 5 }, shadowRadius: 10, elevation: 10 },
  suggestionsTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  suggestionItem: { paddingVertical: 8 },
  suggestionText: { fontSize: 16 },
  closeSuggestionsButton: { marginTop: 10, alignSelf: 'center' },
  closeSuggestionsText: { color: '#c7da30', fontWeight: 'bold' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContainer: { backgroundColor: '#fff', padding: 30, borderRadius: 12, alignItems: 'center', width: '85%' },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  modalCase: { fontSize: 18, marginBottom: 20, fontWeight: 'bold', textAlign: 'center' },
  modalButton: { backgroundColor: '#c7da30', paddingVertical: 12, paddingHorizontal: 25, borderRadius: 8 },
  modalButtonText: { color: 'black', fontSize: 16 },
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
  menuText: {
    fontSize: 18,
    color: "#333",
  },
  filePickerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#c7da30',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
    height: 45,
    marginBottom: 10,
  },
  chooseFileButton: {
    backgroundColor: '#d3d3d3',
    paddingHorizontal: 15,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  chooseFileText: {
    color: '#000',
    fontWeight: '500',
  },
  fileNameText: {
    flex: 1,
    paddingHorizontal: 10,
    color: '#555',
  },
  imagePreview: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#c7da30',
    marginTop: 5,
  },

});
