// app/screens/Settings.jsx
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Switch,
  Alert,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

// 🌍 Multi-lingual translations
const translations = {
  en: {
    title: "Settings",
    back: "← Back",
    notifications: "Notifications",
    notificationsDesc: "Enable or disable app notifications",
    darkMode: "Dark Mode",
    darkModeDesc: "Switch between light and dark themes",
    changePassword: "Change Password",
    changePasswordDesc: "Update your password securely",
    aboutApp: "About App",
    aboutAppDesc: "Learn more about SmartAgri features",
    logout: "Logout",
    logoutAlert: "Logged out successfully",
  },
  hi: {
    title: "सेटिंग्स",
    back: "← पीछे",
    notifications: "सूचनाएँ",
    notificationsDesc: "ऐप सूचनाओं को सक्षम या अक्षम करें",
    darkMode: "डार्क मोड",
    darkModeDesc: "लाइट और डार्क थीम के बीच स्विच करें",
    changePassword: "पासवर्ड बदलें",
    changePasswordDesc: "अपना पासवर्ड सुरक्षित रूप से अपडेट करें",
    aboutApp: "एप्लिकेशन के बारे में",
    aboutAppDesc: "SmartAgri सुविधाओं के बारे में जानें",
    logout: "लॉग आउट",
    logoutAlert: "सफलतापूर्वक लॉग आउट किया गया",
  },
  ta: {
    title: "அமைப்புகள்",
    back: "← பின்",
    notifications: "அறிவிப்புகள்",
    notificationsDesc: "அப்பில் அறிவிப்புகளை இயக்கவும் அல்லது முடக்கவும்",
    darkMode: "இருண்ட முறை",
    darkModeDesc: "ஒளி மற்றும் இருண்ட தீம்களில் மாறவும்",
    changePassword: "கடவுச்சொல்லை மாற்றவும்",
    changePasswordDesc: "உங்கள் கடவுச்சொல்லை பாதுகாப்பாக புதுப்பிக்கவும்",
    aboutApp: "அப் பற்றி",
    aboutAppDesc: "SmartAgri அம்சங்கள் பற்றி அறிக",
    logout: "வெளியேறு",
    logoutAlert: "வெற்றிகரமாக வெளியேறியிருக்கிறீர்கள்",
  },
};

export default function Settings() {
  const router = useRouter();

  const [language, setLanguage] = useState("en");
  const t = translations[language];

  const [isNotificationEnabled, setIsNotificationEnabled] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "hi" : language === "hi" ? "ta" : "en");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Top Bar with Back and Language Toggle */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.replace("/screens/home")}>
          <Text style={styles.backText}>{t.back}</Text>
        </TouchableOpacity>
        <Text style={styles.heading}>{t.title}</Text>
        <TouchableOpacity onPress={toggleLanguage}>
          <MaterialIcons name="language" size={26} color="#047827ff" />
        </TouchableOpacity>
      </View>

      {/* Notifications Section */}
      <View style={styles.item}>
        <MaterialIcons name="notifications" size={24} color="#047827ff" />
        <View style={styles.itemContent}>
          <Text style={styles.itemText}>{t.notifications}</Text>
          <Text style={styles.subText}>{t.notificationsDesc}</Text>
        </View>
        <Switch
          value={isNotificationEnabled}
          onValueChange={() => setIsNotificationEnabled(!isNotificationEnabled)}
          thumbColor={isNotificationEnabled ? "#047827ff" : "#f4f3f4"}
          trackColor={{ true: "#a7f3d0", false: "#d1d5db" }}
        />
      </View>

      {/* Dark Mode Section */}
      <View style={styles.item}>
        <MaterialIcons name="brightness-4" size={24} color="#047827ff" />
        <View style={styles.itemContent}>
          <Text style={styles.itemText}>{t.darkMode}</Text>
          <Text style={styles.subText}>{t.darkModeDesc}</Text>
        </View>
        <Switch
          value={isDarkMode}
          onValueChange={() => setIsDarkMode(!isDarkMode)}
          thumbColor={isDarkMode ? "#047827ff" : "#f4f3f4"}
          trackColor={{ true: "#a7f3d0", false: "#d1d5db" }}
        />
      </View>

      {/* Change Password */}
      <TouchableOpacity
        style={styles.item}
        onPress={() => router.push("/screens/ChangePassword")}
      >
        <MaterialIcons name="lock" size={24} color="#047827ff" />
        <View style={styles.itemContent}>
          <Text style={styles.itemText}>{t.changePassword}</Text>
          <Text style={styles.subText}>{t.changePasswordDesc}</Text>
        </View>
      </TouchableOpacity>

      {/* About App */}
      <TouchableOpacity
        style={styles.item}
        onPress={() => router.push("/screens/AboutApp")}
      >
        <MaterialIcons name="info" size={24} color="#047827ff" />
        <View style={styles.itemContent}>
          <Text style={styles.itemText}>{t.aboutApp}</Text>
          <Text style={styles.subText}>{t.aboutAppDesc}</Text>
        </View>
      </TouchableOpacity>

      {/* Logout */}
      <TouchableOpacity
        style={[styles.item, styles.logout]}
        onPress={() => {
          Alert.alert(t.logoutAlert);
          router.replace("/signin");
        }}
      >
        <MaterialIcons name="exit-to-app" size={24} color="#fff" />
        <Text style={[styles.itemText, { color: "#fff" }]}>{t.logout}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
    paddingTop: 60,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
    marginBottom: 20,
    textAlign: "center",
    flex: 1,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    marginBottom: 15,
    backgroundColor: "#fff",
    borderRadius: 12,
    elevation: 2,
  },
  itemContent: {
    flex: 1,
    marginLeft: 15,
  },
  itemText: {
    fontSize: 18,
    color: "#333",
    fontWeight: "600",
  },
  subText: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 2,
  },
  logout: {
    backgroundColor: "#e53935",
    justifyContent: "center",
  },
});
