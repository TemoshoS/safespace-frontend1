import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';


type AbuseType = {
  id: number;
  type_name: string;
};

export default function AbuseTypesScreen() {
  const [abuseTypes, setAbuseTypes] = useState<AbuseType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    
    fetch('http://localhost:3000/abuse_types')
      .then(res => res.json())
      .then((data: AbuseType[]) => {
        setAbuseTypes(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching abuse types:', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <Text style={styles.loading}>Loading...</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Abuse Types</Text>
      <FlatList
        data={abuseTypes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <Text style={styles.item}>{item.type_name}</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  item: { fontSize: 18, paddingVertical: 8 },
  loading: { fontSize: 18, textAlign: 'center', marginTop: 50 },
});
