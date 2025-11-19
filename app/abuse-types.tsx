import { BACKEND_URL } from "@/utils/config";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Animated,
    Dimensions,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
const { width } = Dimensions.get("window");

export default function AbuseTypesScreen() {
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

    const navigate = (path: string) => {
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
                abuseTypeName: type.type_name,  // <ó make sure this is from the object
                anonymous,
            },
        });
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
                        <Text style={styles.anonymousText}>You're reporting anonymously</Text>
                    )}
                    {anonymous === "no" && (
                        <Text style={styles.anonymousText}>You're reporting with details</Text>

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

                <View style={styles.menuContent}>
                    {/* Home button with centered text */}
                    <TouchableOpacity style={styles.menuItem} onPress={() => navigate("/")}>
                        <Text style={[styles.menuText, styles.homeText]}>Home</Text>
                    </TouchableOpacity>
                    {/* Report button with shadow */}
                    <TouchableOpacity style={[styles.menuItem, styles.reportItem]} onPress={() => navigate("/report-screen")}>
                        <Text style={[styles.menuText, styles.reportText]}>Report</Text>
                    </TouchableOpacity>
                    {/* Check Status button with separate styling */}
                    <TouchableOpacity style={[styles.menuItem, styles.checkStatusItem]} onPress={() => navigate("/check-status")}>
                        <Text style={[styles.menuText, styles.checkStatusText]}>Check Status</Text>
                    </TouchableOpacity>
                    {/* Back button with separate styling */}
                    <TouchableOpacity style={[styles.menuItem, styles.backItem]} onPress={() => navigate("/")}>
                        <Text style={[styles.menuText, styles.backText]}>Back</Text>
                    </TouchableOpacity>
                </View>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        paddingHorizontal: 20,
    },
    topBar: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 40,
        paddingHorizontal: 10,
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
        backgroundColor: "#fff",
        borderColor: "#c7da30",
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 25,
        borderWidth: 3,
        marginBottom: 15,
        width: "48%",
        alignItems: "center",
    },
    abuseText: {
        color: "#91cae0ff",
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
        backgroundColor: "#FFFFFF",
        zIndex: 10,
    },
    // Close button container to center it
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
        borderBottomWidth: 1,
        borderBottomColor: "#fff",
    },
    menuText: {
        alignItems: "center",
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
});