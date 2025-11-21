import { BACKEND_URL } from "@/utils/config";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
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
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
<<<<<<< HEAD
  View,
  ActivityIndicator,
=======
  View
>>>>>>> b11731a5f1d94c321a2032700bf53ea34237107b
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";

const { width } = Dimensions.get("window");

export default function CreateReportScreen() {
<<<<<<< HEAD

=======
>>>>>>> b11731a5f1d94c321a2032700bf53ea34237107b
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

<<<<<<< HEAD
=======
  // pick image or video
>>>>>>> b11731a5f1d94c321a2032700bf53ea34237107b
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
<<<<<<< HEAD
    const selectedSubtypeObj = subtypes.find(
      (s) => String(s.id) === selectedSubtype
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

    const descriptionRequired =
      subtypes.find((s) => String(s.id) === selectedSubtype)
        ?.sub_type_name === "Other";
    if (descriptionRequired && !description.trim()) {
      Alert.alert("Error", "Description is required for this report.");
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
      formData.append("grade", grade);
      formData.append("status", "awaiting-resolution");
      formData.append("is_anonymous", isAnonymous ? "1" : "0");

      if (attachment) {
        const uriParts = attachment.uri.split('/');
        const fileName = uriParts[uriParts.length - 1];
        const fileType = attachment.type.startsWith('video') ? 'video/mp4' : 'image/jpeg';

        formData.append('file', {
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
      setGrade("");
      setAttachment(null);
      setSchoolSuggestions([]);
    } catch (err: any) {
      console.error("Submission error:", err);
      Alert.alert("Error", "Failed to create report.");
    } finally {
      setLoading(false);
    }
=======
    if (!validateForm()) {
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
      formData.append("grade", grade);
      formData.append("status", "awaiting-resolution");
      formData.append("is_anonymous", isAnonymous ? "1" : "0");

      if (attachment) {
        const uriParts = attachment.uri.split("/");
        const fileName = uriParts[uriParts.length - 1];
        const fileType = (attachment.type && attachment.type.startsWith && attachment.type.startsWith("video")) ? "video/mp4" : "image/jpeg";

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

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server error: ${response.status} ${errorText}`);
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
>>>>>>> b11731a5f1d94c321a2032700bf53ea34237107b
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
        {!menuVisible && (
          <>
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
          </>
        )}
      </View>

      <ScrollView
        contentContainerStyle={styles.container}
        scrollEnabled={!subtypeOpen && !gradeOpen && schoolSuggestions.length === 0}
      >
        <Text style={styles.title}>REPORT CASE</Text>
        {isAnonymous && (
          <Text style={{ color: "black", marginBottom: 10 }}>
            You are reporting anonymously
          </Text>
        )}
        <Text style={styles.abuseTypeText}>Abuse Type: {abuseTypeName}</Text>

        <View style={styles.formWrapper}>
<<<<<<< HEAD
          {schoolSuggestions.length === 0 && (
            <>
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
=======
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
>>>>>>> b11731a5f1d94c321a2032700bf53ea34237107b
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

<<<<<<< HEAD
=======
          {/* Grade */}
>>>>>>> b11731a5f1d94c321a2032700bf53ea34237107b
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

<<<<<<< HEAD
=======
          {/* Attachment */}
>>>>>>> b11731a5f1d94c321a2032700bf53ea34237107b
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

<<<<<<< HEAD
      {/* Loading Modal Overlay */}
=======
      {/* Big Loading Modal (keeps your design & logic) */}
>>>>>>> b11731a5f1d94c321a2032700bf53ea34237107b
      <Modal visible={loading} transparent animationType="fade">
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#c7da30" />
<<<<<<< HEAD
            <Text style={styles.loadingText}>Submitting...</Text>
=======
            <Text style={styles.loadingText}>Submitting report…</Text>
>>>>>>> b11731a5f1d94c321a2032700bf53ea34237107b
          </View>
        </View>
      </Modal>

      {/* Success Modal */}
      <Modal visible={successModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Report Submitted Successfully</Text>
            <MaterialIcons
              name="check-circle"
              size={60}
              color="#c7da30"
              style={{ marginBottom: 15 }}
            />
            <Text style={styles.modalCase}>CASE NUMBER: {submittedCaseNumber}</Text>
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

      {/* Slide-in menu from right */}
      {menuVisible && (
        <TouchableOpacity style={styles.overlay} onPress={toggleMenu} />
      )}
      <Animated.View style={[styles.menu, { transform: [{ translateX: slideAnim }] }]}>
        {/* Close button centered at the top of the menu */}
        <View style={styles.closeButtonContainer}>
          <TouchableOpacity onPress={toggleMenu} style={styles.closeButton}>
            <Ionicons name="close" size={50} color="#c7da30" />
          </TouchableOpacity>
        </View>

<<<<<<< HEAD
      {/* Slide‑in Menu */}
      <Animated.View
        style={[styles.menu, { transform: [{ translateX: slideAnim }] }]}
      >
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => handleNavigate("/")}
        >
          <Text style={styles.menuText}>Home</Text>
        </TouchableOpacity>
=======
        <View style={styles.menuContent}>
          {/** Home */}
          <Pressable
            onPress={() => handleNavigate("/")}
            onPressIn={() => setActiveMenuItem("home")}
            onPressOut={() => setActiveMenuItem(null)}
            style={[
              styles.menuItem,
              activeMenuItem === "home" ? styles.activeItem : null
            ]}
          >
            <Text style={styles.menuText}>Home</Text>
          </Pressable>
>>>>>>> b11731a5f1d94c321a2032700bf53ea34237107b

          <Pressable
            onPress={() => handleNavigate("/report-screen")}
            onPressIn={() => setActiveMenuItem("report")}
            onPressOut={() => setActiveMenuItem(null)}
            style={[
              styles.menuItem,
              activeMenuItem === "report" ? styles.activeItem : null
            ]}
          >
            <Text style={styles.menuText}>Report</Text>
          </Pressable>

          <Pressable
            onPress={() => handleNavigate("/check-status")}
            onPressIn={() => setActiveMenuItem("checkStatus")}
            onPressOut={() => setActiveMenuItem(null)}
            style={[
              styles.menuItem,
              activeMenuItem === "checkStatus" ? styles.activeItem : null
            ]}
          >
            <Text style={styles.menuText}>Check Status</Text>
          </Pressable>

<<<<<<< HEAD
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => handleNavigate("/about-us")}
        >
          <Text style={styles.menuText}>About Us</Text>
        </TouchableOpacity>
=======
          <Pressable
            onPress={() => handleNavigate("/abuse-types")}
            onPressIn={() => setActiveMenuItem("back")}
            onPressOut={() => setActiveMenuItem(null)}
            style={[
              styles.menuItem,
              activeMenuItem === "back" ? styles.activeItem : null
            ]}
          >
            <Text style={styles.menuText}>Back</Text>
          </Pressable>

        </View>
>>>>>>> b11731a5f1d94c321a2032700bf53ea34237107b
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingBottom: 40, alignItems: "center", width: "100%", paddingHorizontal: 10 },
  topBar: { flexDirection: "row", width: "100%", maxWidth: 450, justifyContent: "space-between", alignItems: "center", marginTop: 40, marginBottom: 20, zIndex: 100, paddingHorizontal: 10 },
  logo: { width: 100, height: 80 },
  title: { fontSize: 26, fontWeight: "bold", marginBottom: 20, color: "black" },
  abuseTypeText: { fontSize: 16, fontWeight: "bold", marginBottom: 10 },
  formWrapper: { width: "100%", maxWidth: 450, borderWidth: 2, borderColor: "#c7da30", borderRadius: 6, padding: 20, backgroundColor: "#fff", shadowColor: "#000", shadowOpacity: 0.1, shadowOffset: { width: 0, height: 3 }, shadowRadius: 5, elevation: 3 },
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 15 },
  field: { flex: 1, marginRight: 10 },
  fieldLast: { flex: 1, marginRight: 0 },
  fullField: { width: "100%", marginBottom: 15 },
  label: { color: "black", marginBottom: 6 },
  input: { borderWidth: 2, borderColor: "#c7da30", borderRadius: 8, padding: 10, fontSize: 15, backgroundColor: "#fff" },
  pickerWrapper: { borderWidth: 2, borderColor: "#c7da30", borderRadius: 8, overflow: "hidden" },
  descriptionInput: { height: 100, textAlignVertical: "top" },
  fileInput: { borderWidth: 2, borderColor: "#c7da30", borderRadius: 8, backgroundColor: "#fff", paddingVertical: 12, paddingHorizontal: 10, justifyContent: "center" },
  fileInputText: { color: "#555", fontWeight: "500" },
  submitButton: { backgroundColor: "#fff", paddingVertical: 14, borderRadius: 50, alignItems: "center", width: "100%", marginTop: 10, borderWidth: 2, borderColor: "#c7da30" },
  submitText: { color: "#1aaed3ff", fontSize: 16 },
  suggestionsOverlay: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0, 0, 0, 0.5)", zIndex: 1000, justifyContent: "center", alignItems: "center", padding: 20 },
  suggestionsContainer: { backgroundColor: "#fff", borderRadius: 12, padding: 16, width: "90%", maxHeight: "50%", borderWidth: 2, borderColor: "#c7da30", shadowColor: "#000", shadowOpacity: 0.3, shadowOffset: { width: 0, height: 5 }, shadowRadius: 10, elevation: 10 },
  suggestionsTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  suggestionItem: { paddingVertical: 8 },
  suggestionText: { fontSize: 16 },
  closeSuggestionsButton: { marginTop: 10, alignSelf: "center" },
  closeSuggestionsText: { color: "#c7da30", fontWeight: "bold" },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" },
  modalContainer: { backgroundColor: "#fff", padding: 30, borderRadius: 12, alignItems: "center", width: "85%" },
  modalTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 10, textAlign: "center" },
  modalCase: { fontSize: 18, marginBottom: 20, fontWeight: "bold", textAlign: "center" },
  modalButton: { backgroundColor: "#c7da30", paddingVertical: 12, paddingHorizontal: 25, borderRadius: 8 },
  modalButtonText: { color: "black", fontSize: 16 },
  overlay: { position: "absolute", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.3)", zIndex: 5 },
  menu: {
    position: "absolute",
    top: 0,
    right: 0,
    width: width * 0.7,
    height: "100%",
    backgroundColor: "#FFFFFF",
    zIndex: 10,
  }, 
  closeButtonContainer: {
    position: "absolute",
    top: 40,
    left: 0,
    right: 120,
    alignItems: "center",
    zIndex: 11,
  },
  closeButton: {
    padding: 10,
  },
  menuContent: {
    marginTop: 120,
    paddingHorizontal: 20,
  },
  menuItem: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#fff",
    borderRadius: 25,
    marginBottom: 10,
  },
  menuText: {
    textAlign: "left",
    fontSize: 20,
    color: "#91cae0ff",
  },
  homeText: {
    paddingLeft: 30,
    fontSize: 20,
  },
  // Report item with shadow
  reportItem: {
    paddingLeft: 30,
    borderRadius: 25,
    width: '55%',
    paddingVertical: 4, // This won't affect text alignment
    justifyContent: 'center',
    backgroundColor: "#87CEEB",  // Blue border color
  },
  reportText: {
    color: "white",
    fontSize: 20,
  },
  checkStatusItem: {
    paddingLeft: 10, // Starts a bit later than the others
  },
  checkStatusText: {
    fontSize: 20,
  },
  backItem: {
    paddingLeft: 35, // Adjust this value as needed
  },
  backText: {
    fontSize: 20,
    // Add any other styles you want for Back text
  },

  filePickerWrapper: { flexDirection: "row", alignItems: "center", borderWidth: 2, borderColor: "#c7da30", borderRadius: 8, overflow: "hidden", backgroundColor: "#f0f0f0", height: 45, marginBottom: 10 },
  chooseFileButton: { backgroundColor: "#d3d3d3", paddingHorizontal: 15, justifyContent: "center", alignItems: "center", height: "100%" },
  chooseFileText: { color: "#000", fontWeight: "500" },
  fileNameText: { flex: 1, paddingHorizontal: 10, color: "#555" },
  imagePreview: { width: "100%", height: 120, borderRadius: 8, borderWidth: 2, borderColor: "#c7da30", marginTop: 5 },
  videoPreview: { width: "100%", height: 180, borderRadius: 8, borderWidth: 2, borderColor: "#c7da30" },

  /* --- Loading overlay styles --- */
<<<<<<< HEAD
  loadingOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10000,
  },
  loadingContainer: {
    backgroundColor: '#fff',
    padding: 30,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    width: '70%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
=======
  loadingOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center", zIndex: 10000 },
  loadingContainer: { backgroundColor: "#fff", padding: 30, borderRadius: 12, justifyContent: "center", alignItems: "center", width: "80%", shadowColor: "#000", shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 10 },
  loadingText: { marginTop: 15, fontSize: 16, fontWeight: "bold", color: "black" },
  activeItem: {
    backgroundColor: "#87CEEB",
    borderRadius: 25,
  },


  // inline error style
  errorText: {
    color: "red",
    fontSize: 13,
    marginTop: 4,
>>>>>>> b11731a5f1d94c321a2032700bf53ea34237107b
  },
});
