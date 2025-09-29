// app/report_forms/TeenagePregnancyForm.tsx
import React from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Image } from "react-native";
import { Controller } from "react-hook-form";
import * as ImagePicker from "expo-image-picker";

type Props = {
  control: any;
  handleSubmit: () => void;
  loading: boolean;
  setImageBase64: (base64: string | null) => void;
};

export default function TeenagePregnancyForm({ control, handleSubmit, loading, setImageBase64 }: Props) {
  const [imageUri, setImageUri] = React.useState<string | null>(null);

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      base64: true,
      quality: 0.6,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      setImageBase64(result.assets[0].base64 ?? null);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Report — Teenage Pregnancy</Text>

      <Controller
        control={control}
        name="age"
        render={({ field: { value, onChange } }) => (
          <View style={styles.field}>
            <Text style={styles.label}>Age of victim</Text>
            <TextInput style={styles.input} value={value} onChangeText={onChange} placeholder="e.g., 16" keyboardType="numeric" />
          </View>
        )}
      />

      <Controller
        control={control}
        name="monthsPregnant"
        render={({ field: { value, onChange } }) => (
          <View style={styles.field}>
            <Text style={styles.label}>Months pregnant</Text>
            <TextInput style={styles.input} value={value} onChangeText={onChange} placeholder="e.g., 4" keyboardType="numeric" />
          </View>
        )}
      />

      <Controller
        control={control}
        name="supportNeeded"
        render={({ field: { value, onChange } }) => (
          <View style={styles.field}>
            <Text style={styles.label}>Type of support needed</Text>
            <TextInput style={styles.input} value={value} onChangeText={onChange} placeholder="e.g., Counseling" />
          </View>
        )}
      />

      <View style={styles.field}>
        <Text style={styles.label}>Add photo (optional)</Text>
        <TouchableOpacity onPress={pickImage} style={styles.button}>
          <Text style={styles.buttonText}>Pick Image</Text>
        </TouchableOpacity>
        {imageUri && <Image source={{ uri: imageUri }} style={styles.thumb} />}
      </View>

      <TouchableOpacity style={[styles.submit, loading && styles.disabled]} onPress={handleSubmit} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitText}>Submit Report</Text>}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingBottom: 40 },
  title: { fontSize: 20, fontWeight: "600", marginBottom: 12 },
  field: { marginBottom: 12 },
  label: { marginBottom: 6, fontWeight: "500" },
  input: { borderWidth: 1, borderColor: "#ddd", borderRadius: 8, padding: 10 },
  button: { backgroundColor: "#007AFF", paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8, marginBottom: 8 },
  buttonText: { color: "#fff" },
  thumb: { width: 56, height: 56, borderRadius: 6, marginTop: 8 },
  submit: { marginTop: 18, backgroundColor: "#0066CC", padding: 14, borderRadius: 8, alignItems: "center" },
  submitText: { color: "#fff", fontWeight: "600" },
  disabled: { opacity: 0.7 },
});
