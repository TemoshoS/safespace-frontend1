import axios from "axios";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    Animated,
    Dimensions,
    Image,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Alert,
    ActivityIndicator
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

export default function AbuseTypesScreen() {
   const BACKEND_URL = "https://mobile.teketesafespace.co.za";


    const [abuseTypes, setAbuseTypes] = useState<any[]>([]);
    const [menuVisible, setMenuVisible] = useState(false);
    const slideAnim = useState(new Animated.Value(width))[0];

    const router = useRouter();
    const params = useLocalSearchParams();
    const anonymous = params.anonymous;

    useEffect(() => {
        axios
            .get(`${BACKEND_URL}/abuse_types`)
            .then((res) => setAbuseTypes(res.data))
            .catch((err) => {
                console.error("Error fetching abuse types:", err);
                Alert.alert("Failed to load abuse types. Please try again.");
            });
    }, []);

    const handleNavigate = (path: string) => {
        toggleMenu();
        setTimeout(() => {
            router.push({ pathname: path as any });
        }, 250);
    };

    const handleAbuseTypeSelect = (type: any) => {
        router.push({
            pathname: "/report-form",
            params: {
                abuseTypeId: type.id,
                abuseTypeName: type.type_name,  // <— make sure this is from the object
                anonymous,
            },
        });
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
        <View style={styles.container}>
            {/* Top bar */}
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

            {/* Show loader if abuseTypes is empty */}
            {abuseTypes.length === 0 ? (
                <View style={styles.loaderContainer}>
                    <ActivityIndicator size="large" color="#c7da30" style={{ transform: [{ scale: 1.5 }] }} />
                </View>
            ) : (
                <View style={styles.centeredContent}>
                    <Text style={styles.title}>TYPES OF ABUSE</Text>
                    {anonymous === "yes" && (
                        <Text style={styles.anonymousText}>You’re reporting anonymously</Text>
                    )}

                    <View style={styles.abuseBox}>
                        <View style={styles.abuseGrid}>
                            {abuseTypes.map((type) => (
                                <TouchableOpacity
                                    key={type.id}
                                    style={styles.abuseButton}
                                    onPress={() => handleAbuseTypeSelect(type)}
                                >
                                    <Text style={styles.abuseText}>{type.type_name}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                </View>
            )}

            {/* Overlay & Menu */}
            {menuVisible && <TouchableOpacity style={styles.overlay} onPress={toggleMenu} />}
            <Animated.View style={[styles.menu, { transform: [{ translateX: slideAnim }] }]}>
                <TouchableOpacity style={styles.menuItem} onPress={() => handleNavigate("/")}>
                    <Text style={styles.menuText}>Home</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => router.back()}
                >

                    <Text style={styles.menuText}>Back</Text>


                </TouchableOpacity>
                <TouchableOpacity style={styles.menuItem} onPress={() => handleNavigate("/contact-us")}>
                    <Text style={styles.menuText}>Contact Us</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuItem} onPress={() => handleNavigate("/about-us")}>
                    <Text style={styles.menuText}>About Us</Text>
                </TouchableOpacity>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        paddingTop: 40,
        paddingHorizontal: 20,
    },
    topBar: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    logo: {
        width: 100,
        height: 100,
    },
    loaderContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    centeredContent: {
        flex: 1,
        justifyContent: "center",
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 10,
        color: "#000",
    },
    anonymousText: {
        textAlign: "center",
        color: "black",
        marginBottom: 20,
        fontWeight: "500",
    },
    abuseBox: {
        borderColor: "#c7da30",
        borderWidth: 1,
        padding: 20,
        borderRadius: 10,
    },
    abuseGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
    },
    abuseButton: {
        backgroundColor: "#c7da30",
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 25,
        marginBottom: 15,
        width: "48%",
        alignItems: "center",
    },
    abuseText: {
        color: "#000",
        fontWeight: "500",
        fontSize: 14,
        textAlign: "center",
    },
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
});
