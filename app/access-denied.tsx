import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export default function AccessDeniedScreen() {
  const router = useRouter();
  
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
      <Text style={{ fontSize: 26, fontWeight: "bold", color: "red", marginBottom: 20 }}>
        403 – Access Denied
      </Text>

      <Text style={{ textAlign: "center", marginBottom: 30 }}>
        Malicious content detected.  
        Your report cannot be submitted.
      </Text>

      <TouchableOpacity
        onPress={() => router.push("/")}
        style={{
          backgroundColor: "#c7da30",
          padding: 12,
          width: 200,
          borderRadius: 10,
          alignItems: "center",
        }}
      >
        <Text style={{ color: "white", fontWeight: "bold" }}>Go Back Home</Text>
      </TouchableOpacity>
    </View>
  );
}
