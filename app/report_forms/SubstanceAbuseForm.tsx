// app/report_forms/SubstanceAbuseForm.tsx
import React from "react";
import { Controller } from "react-hook-form";
import FormLayout from "../reports_layout/form-layout";
import FormField from "../reports_layout/form-field";
import { View, TouchableOpacity, Image, StyleSheet, ActivityIndicator, Text } from "react-native";
import * as ImagePicker from "expo-image-picker";

type Props = {
  control: any;
  handleSubmit: () => void;
  loading: boolean;
  setImageBase64: (base64: string | null) => void;
};

export default function SubstanceAbuseForm({ control, handleSubmit, loading, setImageBase64 }: Props) {
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
    <FormLayout title="Report — Substance Abuse" onSubmit={handleSubmit}>
      <Controller
        control={control}
        name="drugType"
        render={({ field: { value, onChange } }) => (
          <FormField label="Drug / Substance" value={value} onChangeText={onChange} placeholder="e.g., Methamphetamine" />
        )}
      />
      <Controller
        control={control}
        name="frequency"
        render={({ field: { value, onChange } }) => (
          <FormField label="Frequency" value={value} onChangeText={onChange} placeholder="Daily / Weekly" />
        )}
      />
      <Controller
        control={control}
        name="location"
        render={({ field: { value, onChange } }) => (
          <FormField label="Location" value={value} onChangeText={onChange} placeholder="Where it happens" />
        )}
      />

      <View style={styles.imageContainer}>
        <TouchableOpacity onPress={pickImage} style={styles.button}>
          <Text style={styles.buttonText}>Pick Image</Text>
        </TouchableOpacity>
        {imageUri && <Image source={{ uri: imageUri }} style={styles.thumb} />}
      </View>
      
    </FormLayout>
  );
}

const styles = StyleSheet.create({
  imageContainer: { marginBottom: 12 },
  button: { backgroundColor: "#007AFF", paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8, marginBottom: 8 },
  buttonText: { color: "#fff" },
  thumb: { width: 56, height: 56, borderRadius: 6, marginTop: 8 },
  submit: { marginTop: 18, backgroundColor: "#0066CC", padding: 14, borderRadius: 8, alignItems: "center" },
  submitText: { color: "#fff", fontWeight: "600" },
  disabled: { opacity: 0.7 },
});
