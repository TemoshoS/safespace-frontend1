import { BACKEND_URL } from "@/utils/config";
import axios from "axios";
import { Video } from "expo-av";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

import DropDownPicker from "react-native-dropdown-picker";

import MenuToggle from "@/components/menuToggle";
import TopBar from "@/components/toBar";

const { width, height } = Dimensions.get("window");

export default function CreateReportScreen() {
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
  const [attachment, setAttachment] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [menuVisible, setMenuVisible] = useState(false);
  const slideAnim = useState(new Animated.Value(width))[0];
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [submittedCaseNumber, setSubmittedCaseNumber] = useState("");
  const [activeMenuItem, setActiveMenuItem] = useState<string | null>(null);

  // errors state for inline messages
  const [errors, setErrors] = useState<{
    subtype?: string;
    fullName?: string;
    email?: string;
    phone?: string;
    age?: string;
    school?: string;
    location?: string;
    description?: string;
    grade?: string;
  }>({});

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

  // pick image or video
  const pickMedia = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      quality: 0.5,
    });

    if (!result.canceled) {
      const file = result.assets[0];
      setAttachment(file);
    }
  };

  const searchSchools = async (text: string) => {
    setSchool(text);
    if (text.length < 1) {
      setSchoolSuggestions([]);
      return;
    }
    try {
      const res = await axios.get(`${BACKEND_URL}/schools/search?q=${encodeURIComponent(text)}`);
      setSchoolSuggestions(res.data);
    } catch (err) {
      console.error("Error fetching schools:", err);
    }
  };

  const validateForm = () => {
    const newErrors: typeof errors = {};

    // Subtype required
    if (!selectedSubtype) newErrors.subtype = "Please select a subtype.";

    // Full name required only if not anonymous
    if (!isAnonymous) {
      if (!fullName.trim()) newErrors.fullName = "Full name is required.";
      else if (fullName.length > 50)
        newErrors.fullName = "Full name must be less than 50 characters.";
    }

    // Email required + format
    if (!email.trim()) newErrors.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      newErrors.email = "Enter a valid email address.";

    // Phone required and length
    if (!phone.trim()) newErrors.phone = "Phone number is required.";
    else if (phone.length < 10 || phone.length > 15)
      newErrors.phone = "Phone number must be 10-15 digits.";

    // Age required and range
    if (!age.trim()) newErrors.age = "Age is required.";
    else {
      const ageNum = parseInt(age, 10);
      if (isNaN(ageNum) || ageNum < 1 || ageNum > 115)
        newErrors.age = "Enter a valid age (1-115).";
    }

    // School required and validations
    if (!school.trim()) newErrors.school = "School name is required.";
    else if (school.length > 50)
      newErrors.school = "School name must be less than 50 characters.";
    else if (/[^a-zA-Z0-9\s]/.test(school))
      newErrors.school = "School name contains invalid characters.";

    // Grade required
    if (!grade) newErrors.grade = "Grade is required.";

    // Description required for certain subtype (e.g. "Other")
    const descriptionRequired =
      subtypes.find((s) => String(s.id) === selectedSubtype)
        ?.sub_type_name === "Other";
    if (descriptionRequired && !description.trim())
      newErrors.description = "Description is required for this report.";

    // Location optional but length constraints if provided
    if (location && (location.length < 5 || location.length > 50))
      newErrors.location = "Address must be between 5 and 50 characters.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("abuse_type_id", abuseTypeId as string);
      formData.append("subtype_id", selectedSubtype);
      formData.append("description", description);
      formData.append("reporter_email", email);
      formData.append("phone_number", phone);
      formData.append("age", age);
      formData.append("location", location);
      formData.append("school_name", school);
      formData.append("grade", grade);
      formData.append("status", "awaiting-resolution");
      formData.append("is_anonymous", isAnonymous ? "1" : "0");

      // Append full_name only if the user is NOT anonymous
      if (!isAnonymous && fullName.trim()) {
        formData.append("full_name", fullName);
      }

      // Attach file if selected
      if (attachment) {
        const uriParts = attachment.uri.split("/");
        const fileName = uriParts[uriParts.length - 1];
        const fileType = (attachment.type && attachment.type.startsWith && attachment.type.startsWith("video"))
          ? "video/mp4"
          : "image/jpeg";

        formData.append("file", {
          uri: attachment.uri,
          name: fileName,
          type: fileType,
        } as any);
      }

      const response = await fetch(`${BACKEND_URL}/reports`, {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
      });


      // If malicious, backend returns 403
      if (response.status === 403) {
        router.replace("/access-denied");
        return;
      }

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server error: ${response.status} ${errorText}`);
      }

      const result = await response.json();
      setSubmittedCaseNumber(result.case_number);
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
      setGrade("");
      setAttachment(null);
      setSchoolSuggestions([]);
      setErrors({});
    } catch (err: any) {
      console.error("Submission error:", err);
      setErrors((prev) => ({ ...prev, description: "Failed to create report." }));
    } finally {
      setLoading(false);
    }
  };


  const handleNavigate = (path: string) => {
    toggleMenu();
    setTimeout(() => {
      router.replace({ pathname: path as any });
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
    <KeyboardAvoidingView
      style={{ flex: 1 ,backgroundColor: "#fff"}}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
    >

      <TopBar
        menuVisible={menuVisible}
        onBack={() => router.back()}
        onToggleMenu={toggleMenu}
      />
      <ScrollView
        contentContainerStyle={styles.container}
        scrollEnabled={!subtypeOpen && !gradeOpen && schoolSuggestions.length === 0}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>REPORT CASE</Text>
        {isAnonymous && (
          <Text style={{ color: "black", marginBottom: 10 }}>
            You are reporting anonymously
          </Text>
        )}
        <Text style={styles.abuseTypeText}>Abuse Type: {abuseTypeName}</Text>

        <View style={styles.formWrapper}>
          {/* Subtype */}
          {schoolSuggestions.length === 0 && (
            <View style={styles.fullField}>
              <Text style={styles.label}>Subtype</Text>
              <DropDownPicker
                open={subtypeOpen}
                value={selectedSubtype}
                items={subtypeItems}
                setOpen={setSubtypeOpen}
                setValue={setSelectedSubtype}
                onChangeValue={(val) => setErrors((prev) => ({ ...prev, subtype: "" }))}
                setItems={setSubtypeItems}
                placeholder="Select Subtype"
                style={styles.pickerWrapper}
                dropDownContainerStyle={{ borderColor: "#c7da30" }}
                zIndex={5000}
              />
              {errors.subtype ? <Text style={styles.errorText}>{errors.subtype}</Text> : null}
            </View>
          )}

          <View style={styles.row}>
            <View style={styles.field}>
              <Text style={styles.label}>Age</Text>
              <TextInput
                style={styles.input}
                value={age}
                keyboardType="number-pad"
                onChangeText={(t) => {
                  const cleaned = t.replace(/[^0-9]/g, "");
                  setAge(cleaned);
                  if (cleaned && parseInt(cleaned, 10) >= 1 && parseInt(cleaned, 10) <= 115) {
                    setErrors((prev) => ({ ...prev, age: "" }));
                  }
                }}
              />
              {errors.age ? <Text style={styles.errorText}>{errors.age}</Text> : null}
            </View>
            <View style={styles.fieldLast}>
              <Text style={styles.label}>School Name</Text>
              <TextInput
                style={styles.input}
                value={school}
                onChangeText={(text) => {
                  searchSchools(text);
                  if (text.trim().length >= 1) {
                    setErrors((prev) => ({ ...prev, school: "" }));
                  }
                }}
                placeholder="start typing school name..."
                placeholderTextColor="#999"
              />
              {errors.school ? <Text style={styles.errorText}>{errors.school}</Text> : null}
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
                        setErrors((prev) => ({ ...prev, school: "" }));
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

          {/* Grade */}
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
                  onChangeValue={(val) => setErrors((prev) => ({ ...prev, grade: "" }))}
                  setItems={setGradeItems}
                  placeholder="Select Grade"
                  style={styles.pickerWrapper}
                  dropDownContainerStyle={{ borderColor: "#c7da30" }}
                  zIndex={4000}
                />
                {errors.grade ? <Text style={styles.errorText}>{errors.grade}</Text> : null}
              </View>
            </View>
          )}

          {/* Full name when not anonymous */}
          {!isAnonymous && (
            <View style={styles.fullField}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                style={styles.input}
                value={fullName}
                onChangeText={(t) => {
                  setFullName(t);
                  if (t.trim().length >= 1 && t.trim().length <= 50) {
                    setErrors((prev) => ({ ...prev, fullName: "" }));
                  }
                }}
              />
              {errors.fullName ? <Text style={styles.errorText}>{errors.fullName}</Text> : null}
            </View>
          )}

          <View style={styles.row}>
            <View style={styles.field}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={(t) => {
                  setEmail(t);
                  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t.trim())) {
                    setErrors((prev) => ({ ...prev, email: "" }));
                  }
                }}
                keyboardType="email-address"
              />
              {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
            </View>
            <View style={styles.fieldLast}>
              <Text style={styles.label}>Phone Number</Text>
              <TextInput
                style={styles.input}
                value={phone}
                onChangeText={(t) => {
                  const cleaned = t.replace(/[^0-9]/g, "");
                  setPhone(cleaned);
                  if (cleaned.length >= 10 && cleaned.length <= 15) {
                    setErrors((prev) => ({ ...prev, phone: "" }));
                  }
                }}
                keyboardType="number-pad"
              />
              {errors.phone ? <Text style={styles.errorText}>{errors.phone}</Text> : null}
            </View>
          </View>

          <View style={styles.fullField}>
            <Text style={styles.label}>Address</Text>
            <TextInput
              style={styles.input}
              value={location}
              onChangeText={(t) => {
                setLocation(t);
                if (t.length >= 5 && t.length <= 50) {
                  setErrors((prev) => ({ ...prev, location: "" }));
                }
              }}
            />
            {errors.location ? <Text style={styles.errorText}>{errors.location}</Text> : null}
          </View>

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
              onChangeText={(t) => {
                setDescription(t);
                const subtypeName = subtypes.find((s) => String(s.id) === selectedSubtype)
                  ?.sub_type_name;
                if (subtypeName !== "Other") {
                  setErrors((prev) => ({ ...prev, description: "" }));
                } else if (t.trim().length > 0) {
                  setErrors((prev) => ({ ...prev, description: "" }));
                }
              }}
              multiline
            />
            {errors.description ? <Text style={styles.errorText}>{errors.description}</Text> : null}
          </View>

          {/* Attachment */}
          <View style={styles.fullField}>
            <Text style={styles.label}>Attachment (Optional)</Text>
            <View style={styles.filePickerWrapper}>
              <TouchableOpacity
                style={styles.chooseFileButton}
                onPress={pickMedia}
              >
                <Text style={styles.chooseFileText}>Choose File</Text>
              </TouchableOpacity>
              <Text style={styles.fileNameText}>
                {attachment ? attachment.uri.split("/").pop() : "No file chosen"}
              </Text>
            </View>

            {attachment && attachment.type && attachment.type.startsWith("image") && (
              <Image
                source={{ uri: attachment.uri }}
                style={styles.imagePreview}
              />
            )}
            {attachment && attachment.type && attachment.type.startsWith("video") && (
              <Video
                source={{ uri: attachment.uri }}
                style={styles.videoPreview}
                useNativeControls
                resizeMode={"contain" as any}
              />
            )}
          </View>

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitText}>
              {loading ? "Submitting..." : "Submit"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Big Loading Modal (keeps your design & logic) */}
      <Modal visible={loading} transparent animationType="fade">
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#c7da30" />
            <Text style={styles.loadingText}>Submitting report…</Text>
          </View>
        </View>
      </Modal>

      {/* Success Modal */}
      <Modal visible={successModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>REPORT SUBMITTED SUCCESSFULLY</Text>
            <Image
              source={require("../assets/images/right.jpeg")}
              style={{ width: 60, height: 60, marginBottom: 15 }}
              resizeMode="contain"
            />
            <Text style={styles.modalCase}>CASE NUMBER: {submittedCaseNumber}</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                setSuccessModalVisible(false);
                router.replace("/");
              }}
            >
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Slide-in menu from right */}
      {menuVisible && (
        <TouchableOpacity style={styles.overlay} onPress={toggleMenu} />
      )}
     <MenuToggle
              menuVisible={menuVisible}
              slideAnim={slideAnim}
              onNavigate={handleNavigate}
              onBack={() => {
                if (router.canGoBack()) {
                  router.back();
                } else {
                  router.replace("/abuse-types"); // Go home if no back screen
                }
              }}
              onClose={() => setMenuVisible(false)}
            />

    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: height * 0.03,
    alignItems: "center",
    width: "100%",
    paddingHorizontal: width * 0.03
  },

  title: {
    fontSize: width * 0.07,
    fontWeight: "bold",
    marginBottom: height * 0.02,
    color: "black"
  },

  abuseTypeText: {
    fontSize: width * 0.045,
    fontWeight: "bold",
    marginBottom: height * 0.01
  },

  formWrapper: {
    width: "100%",
    maxWidth: width * 0.95,
    minWidth: 300,
    borderWidth: 2,
    borderColor: "#c7da30",
    borderRadius: 6,
    padding: width * 0.05,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 3,
    alignSelf: "center",           // center on larger screens
  },


  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: height * 0.02 },
  field: { flex: 1, marginRight: width * 0.02 },
  fieldLast: { flex: 1, marginRight: 0 },
  fullField: { width: "100%", marginBottom: height * 0.02 },

  label: { color: "black", marginBottom: height * 0.005 },
  input: {
    borderWidth: 2,
    borderColor: "#c7da30",
    borderRadius: 8,
    padding: width * 0.02,
    fontSize: width * 0.04,
    backgroundColor: "#fff"
  },
  pickerWrapper: { borderWidth: 2, borderColor: "#c7da30", borderRadius: 8, overflow: "hidden" },
  descriptionInput: { height: height * 0.12, textAlignVertical: "top" },

  fileInput: { borderWidth: 2, borderColor: "#c7da30", borderRadius: 8, backgroundColor: "#fff", paddingVertical: height * 0.015, paddingHorizontal: width * 0.03, justifyContent: "center" },
  fileInputText: { color: "#555", fontWeight: "500" },

  submitButton: {
    backgroundColor: "#fff",
    paddingVertical: height * 0.018,
    borderRadius: 50,
    alignItems: "center",
    width: "100%",
    marginTop: height * 0.015,
    borderWidth: 2,
    borderColor: "#c7da30"
  },
  submitText: { color: "#1aaed3ff", fontSize: width * 0.045 },

  suggestionsOverlay: {
    position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 1000,
    justifyContent: "center", alignItems: "center", padding: width * 0.05
  },
  suggestionsContainer: {
    backgroundColor: "#fff", borderRadius: 12, padding: width * 0.04,
    width: "90%", maxHeight: "50%", borderWidth: 2, borderColor: "#c7da30",
    shadowColor: "#000", shadowOpacity: 0.3, shadowOffset: { width: 0, height: 5 }, shadowRadius: 10, elevation: 10
  },
  suggestionsTitle: { fontSize: width * 0.045, fontWeight: "bold", marginBottom: height * 0.01,fontFamily: 'Montserrat'  },
  suggestionItem: { paddingVertical: height * 0.008 },
  suggestionText: { fontSize: width * 0.04 ,fontFamily: 'Montserrat' },
  closeSuggestionsButton: { marginTop: height * 0.01, alignSelf: "center" },
  closeSuggestionsText: { color: "#c7da30", fontWeight: "bold", fontFamily: 'Montserrat'  },

  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" },
  modalContainer: { backgroundColor: "#fff", padding: width * 0.08, borderRadius: 12, alignItems: "center", width: "85%" },
  modalTitle: { fontSize: 16,  color: "#000", textAlign: "center", marginBottom: 10, fontFamily: "Montserrat" },
  modalCase: { fontSize: 16,  color: "#000", marginBottom: 25, textAlign: "center", fontFamily: "Montserrat" },
  modalButton: {
    backgroundColor: "#fff",
    width: "100%",
    padding: 10,
    borderRadius: 48,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    borderColor: "#c7da30",
    borderWidth: 2,
  },
  modalButtonText: { color: "#1aaed3ff", fontWeight: "500", fontSize: 16, fontFamily: 'Montserrat'  },

  overlay: { position: "absolute", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.3)", zIndex: 5 },

  filePickerWrapper: { flexDirection: "row", alignItems: "center", borderWidth: 2, borderColor: "#c7da30", borderRadius: 8, overflow: "hidden", backgroundColor: "#f0f0f0", height: height * 0.06, marginBottom: height * 0.01 },
  chooseFileButton: { backgroundColor: "#d3d3d3", paddingHorizontal: width * 0.04, justifyContent: "center", alignItems: "center", height: "100%" },
  chooseFileText: { color: "#000", fontWeight: "500" ,fontFamily: 'Montserrat' },
  fileNameText: { flex: 1, paddingHorizontal: width * 0.03, color: "#555",fontFamily: 'Montserrat'  },
  imagePreview: { width: "100%", height: height * 0.15, borderRadius: 8, borderWidth: 2, borderColor: "#c7da30", marginTop: height * 0.005 },
  videoPreview: { width: "100%", height: height * 0.23, borderRadius: 8, borderWidth: 2, borderColor: "#c7da30" },

  loadingOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center", zIndex: 10000 },
  loadingContainer: { backgroundColor: "#fff", padding: width * 0.08, borderRadius: 12, justifyContent: "center", alignItems: "center", width: "80%", shadowColor: "#000", shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 10 },
  loadingText: { marginTop: height * 0.015, fontSize: width * 0.045, fontWeight: "bold", color: "black",fontFamily: 'Montserrat'  },

  activeItem: { backgroundColor: "#87CEEB", borderRadius: 25 },

  errorText: { color: "red", fontSize: width * 0.035, marginTop: height * 0.003,fontFamily: 'Montserrat'  },
});
