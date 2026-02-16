// app/screens/Profile.jsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  MaterialIcons,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useRouter } from "expo-router";

// Dummy Firebase-style user data
const firebaseUser = {
  avg_yield_kg: 1200.5,
  city: "Erode",
  email: "jeyamoorthis25@gmail.com",
  farmland_acres: 5,
  income: 850000,
  invested: 500000,
  location: { lat: 11.341, lon: 77.7172 },
  mobile_number: "9876543210",
  name: "Ramesh Kumar",
  past_crops: ["Cotton", "Groundnut", "Turmeric"],
  preferred_language: "ta",
  profile_picture: "https://cdn-icons-png.flaticon.com/512/147/147144.png",
  regular_crops: ["Paddy", "Suggarcane"],
};

// 🌍 Multi-lingual translations
const translations = {
  en: {
    profile: "My Profile",
    back: "Back",
    name: "Name",
    mobile: "Mobile Number",
    email: "Email",
    city: "City",
    farmland: "Farmland (Acres)",
    avgYield: "Avg Yield (kg)",
    income: "Income (₹)",
    invested: "Invested (₹)",
    pastCrops: "Past Crops",
    regularCrops: "Regular Crops",
    preferredLanguage: "Preferred Language",
    location: "Location (Lat, Lon)",
    editProfile: "Edit Profile",
    saveChanges: "Save Changes",
    updatedAlert: "Profile Updated Successfully",
    sidebar: {
      Home: "Home",
      MyCrops: "My Crops",
      AIChatbot: "AI Chatbot",
      Community: "Community",
      Profile: "Profile",
    },
  },
  hi: {
    profile: "मेरी प्रोफ़ाइल",
    back: "पीछे",
    name: "नाम",
    mobile: "मोबाइल नंबर",
    email: "ईमेल",
    city: "शहर",
    farmland: "खेत (एकड़ में)",
    avgYield: "औसत उपज (किलो)",
    income: "आय (₹)",
    invested: "निवेश (₹)",
    pastCrops: "पिछले फसलें",
    regularCrops: "नियमित फसलें",
    preferredLanguage: "पसंदीदा भाषा",
    location: "स्थान (अक्षांश, देशांतर)",
    editProfile: "प्रोफ़ाइल संपादित करें",
    saveChanges: "परिवर्तन सहेजें",
    updatedAlert: "प्रोफ़ाइल सफलतापूर्वक अपडेट हुई",
    sidebar: {
      Home: "होम",
      MyCrops: "मेरी फसलें",
      AIChatbot: "एआई चैटबॉट",
      Community: "समुदाय",
      Profile: "प्रोफ़ाइल",
    },
  },
  ta: {
    profile: "எனது சுயவிவரம்",
    back: "பின்",
    name: "பெயர்",
    mobile: "மொபைல் எண்",
    email: "மின்னஞ்சல்",
    city: "நகரம்",
    farmland: "வயல் (எக்கரங்களில்)",
    avgYield: "சராசரி விளை (கிலோ)",
    income: "வருமானம் (₹)",
    invested: "முதலீடு (₹)",
    pastCrops: "கடந்த பயிர்கள்",
    regularCrops: "வழக்கமான பயிர்கள்",
    preferredLanguage: "விரும்பிய மொழி",
    location: "இடம் (அட்சாங், நீளம்)",
    editProfile: "சுயவிவரம் திருத்தவும்",
    saveChanges: "மாற்றங்களை சேமிக்கவும்",
    updatedAlert: "சுயவிவரம் வெற்றிகரமாக புதுப்பிக்கப்பட்டது",
    sidebar: {
      Home: "முகப்பு",
      MyCrops: "என் பயிர்கள்",
      AIChatbot: "ஏஐ சாட்பாட்",
      Community: "சமூகம்",
      Profile: "சுயவிவரம்",
    },
  },
};

// Icon mapping
const icons = {
  name: <Ionicons name="person-outline" size={18} color="#28a745" />,
  mobile_number: <Ionicons name="call-outline" size={18} color="#28a745" />,
  email: <Ionicons name="mail-outline" size={18} color="#28a745" />,
  city: <Ionicons name="business-outline" size={18} color="#28a745" />,
  farmland_acres: <MaterialCommunityIcons name="crop" size={18} color="#28a745" />,
  avg_yield_kg: <MaterialCommunityIcons name="chart-line" size={18} color="#28a745" />,
  income: <MaterialCommunityIcons name="cash" size={18} color="#28a745" />,
  invested: <MaterialCommunityIcons name="wallet" size={18} color="#28a745" />,
  past_crops: <MaterialCommunityIcons name="leaf" size={18} color="#28a745" />,
  regular_crops: <MaterialCommunityIcons name="leaf-maple" size={18} color="#28a745" />,
  preferred_language: <Ionicons name="globe-outline" size={18} color="#28a745" />,
  location: <Ionicons name="location-outline" size={18} color="#28a745" />,
};

export default function Profile() {
  const router = useRouter();

  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editableData, setEditableData] = useState({});
  const [language, setLanguage] = useState(firebaseUser.preferred_language || "en");
  const t = translations[language];

  useEffect(() => {
    setUserData(firebaseUser);
    setEditableData(firebaseUser);
  }, []);

  const handleSave = () => {
    setUserData(editableData);
    setIsEditing(false);
    Alert.alert(t.updatedAlert);
  };

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "hi" : language === "hi" ? "ta" : "en");
  };

  if (!userData) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Top Bar */}
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => router.replace("/screens/home")}>
            <MaterialIcons name="arrow-back-ios" size={20} color="#047827ff" />
            <Text style={styles.backText}>{t.back}</Text>
          </TouchableOpacity>
          <Text style={styles.heading}>{t.profile}</Text>
          <TouchableOpacity onPress={toggleLanguage}>
            <MaterialIcons name="language" size={26} color="#047827ff" />
          </TouchableOpacity>
        </View>

        {/* Profile Picture */}
        <Image
          source={{ uri: editableData.profile_picture }}
          style={styles.profileImage}
        />

        {/* Profile Info */}
        <View style={styles.infoCard}>
          {[
            { key: "name", label: t.name },
            { key: "mobile_number", label: t.mobile },
            { key: "email", label: t.email },
            { key: "city", label: t.city },
            { key: "farmland_acres", label: t.farmland },
            { key: "avg_yield_kg", label: t.avgYield },
            { key: "income", label: t.income },
            { key: "invested", label: t.invested },
            { key: "preferred_language", label: t.preferredLanguage },
          ].map((field, idx) => (
            <View key={idx} style={{ marginTop: 10 }}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                {icons[field.key]}
                <Text style={[styles.label, { marginLeft: 5 }]}>{field.label}:</Text>
              </View>
              {isEditing ? (
                <TextInput
                  style={styles.input}
                  value={String(editableData[field.key])}
                  keyboardType={
                    ["farmland_acres", "avg_yield_kg", "income", "invested"].includes(
                      field.key
                    )
                      ? "numeric"
                      : "default"
                  }
                  onChangeText={(val) =>
                    setEditableData({ ...editableData, [field.key]: val })
                  }
                />
              ) : (
                <Text style={styles.value}>{String(userData[field.key])}</Text>
              )}
            </View>
          ))}

          {/* Location */}
          <View
            style={{ flexDirection: "row", alignItems: "center", marginTop: 10 }}
          >
            {icons.location}
            <Text style={[styles.label, { marginLeft: 5 }]}>{t.location}:</Text>
          </View>
          {isEditing ? (
            <>
              <TextInput
                style={styles.input}
                placeholder="Lat"
                value={String(editableData.location.lat)}
                keyboardType="numeric"
                onChangeText={(val) =>
                  setEditableData({
                    ...editableData,
                    location: { ...editableData.location, lat: val },
                  })
                }
              />
              <TextInput
                style={styles.input}
                placeholder="Lon"
                value={String(editableData.location.lon)}
                keyboardType="numeric"
                onChangeText={(val) =>
                  setEditableData({
                    ...editableData,
                    location: { ...editableData.location, lon: val },
                  })
                }
              />
            </>
          ) : (
            <Text style={styles.value}>
              Lat: {userData.location.lat}, Lon: {userData.location.lon}
            </Text>
          )}

          {/* Past Crops */}
          <View
            style={{ flexDirection: "row", alignItems: "center", marginTop: 10 }}
          >
            {icons.past_crops}
            <Text style={[styles.label, { marginLeft: 5 }]}>{t.pastCrops}:</Text>
          </View>
          <Text style={styles.value}>{editableData.past_crops.join(", ")}</Text>

          {/* Regular Crops */}
          <View
            style={{ flexDirection: "row", alignItems: "center", marginTop: 10 }}
          >
            {icons.regular_crops}
            <Text style={[styles.label, { marginLeft: 5 }]}>{t.regularCrops}:</Text>
          </View>
          <Text style={styles.value}>{editableData.regular_crops.join(", ")}</Text>
        </View>

        {/* Edit/Save Button */}
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => (isEditing ? handleSave() : setIsEditing(true))}
        >
          <LinearGradient colors={["#56ab2f", "#3d8b1e"]} style={styles.editGradient}>
            <Text style={styles.editText}>
              {isEditing ? t.saveChanges : t.editProfile}
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        <View style={{ height: 60 }} />
      </ScrollView>

      {/* ✅ Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity onPress={() => router.push("/screens/home")}>
          <Ionicons name="home" size={22} color="#666" />
          <Text style={styles.navText}>{t.sidebar.Home}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/screens/MyCrops")}>
          <Ionicons name="leaf" size={22} color="#666" />
          <Text style={styles.navText}>{t.sidebar.MyCrops}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/screens/ChatBot")}
          style={styles.chatbotNavButton}
        >
          <Ionicons name="chatbubble-ellipses" size={26} color="#047857" />
          <Text style={[styles.navText, { color: "#047857", fontWeight: "bold" }]}>
            {t.sidebar.AIChatbot}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/screens/Community")}>
          <Ionicons name="people" size={22} color="#666" />
          <Text style={styles.navText}>{t.sidebar.Community}</Text>
        </TouchableOpacity>

        <TouchableOpacity>
          <Ionicons name="person" size={22} color="#047857" />
          <Text style={[styles.navText, { color: "#047857", fontWeight: "bold" }]}>
            {t.sidebar.Profile}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    paddingTop: 60,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 20,
  },
  backText: {
    fontSize: 16,
    color: "#047827ff",
    fontWeight: "600",
    marginLeft: 5,
  },
  heading: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#047827ff",
    flex: 1,
    textAlign: "center",
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
  },
  infoCard: {
    width: "100%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    elevation: 3,
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  value: {
    fontSize: 16,
    color: "#555",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
    fontSize: 16,
    color: "#333",
    backgroundColor: "#fff",
  },
  editButton: {
    marginTop: 20,
    borderRadius: 12,
    overflow: "hidden",
    alignSelf: "center",
  },
  editGradient: {
    padding: 15,
    alignItems: "center",
    width: 200,
  },
  editText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  loadingText: {
    fontSize: 18,
    color: "#666",
    marginTop: 40,
  },

  // ✅ Bottom Nav styles
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    paddingVertical: 8,
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
  navText: { fontSize: 10, textAlign: "center", color: "#666" },
  chatbotNavButton: { alignItems: "center" },
});
