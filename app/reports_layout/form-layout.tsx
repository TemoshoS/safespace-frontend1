// src/components/FormLayout.tsx
import React, { ReactNode } from 'react';
import { View, ScrollView, KeyboardAvoidingView, Platform, StyleSheet, TouchableOpacity, Text, ActivityIndicator } from 'react-native';

type Props = {
  title: string;
  children: ReactNode;
  onSubmit: () => void;
  loading?: boolean;
};

export default function FormLayout({ title, children, onSubmit, loading }: Props) {
  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>{title}</Text>
        {children}
        <TouchableOpacity style={[styles.submit, loading && styles.disabled]} onPress={onSubmit} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitText}>Submit</Text>}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, paddingBottom: 40 },
  title: { fontSize: 20, fontWeight: '600', marginBottom: 12 },
  submit: { marginTop: 18, backgroundColor: '#0066CC', padding: 14, borderRadius: 8, alignItems: 'center' },
  submitText: { color: '#fff', fontWeight: '600' },
  disabled: { opacity: 0.7 },
});
