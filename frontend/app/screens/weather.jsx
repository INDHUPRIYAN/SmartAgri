import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  BackHandler,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

export default function Weather() {
  const router = useRouter();
  const [location, setLocation] = useState("Delhi");
  const [language, setLanguage] = useState("en"); // Default language

  // Inline translations including Tamil
  const translations = {
    en: {
      weather_info: "Weather Info",
      location: "Location",
      temperature: "Temperature",
      condition: "Condition",
      humidity: "Humidity",
      wind_speed: "Wind Speed",
      back: "← Back",
      sidebar: {
        Home: "Home",
        MyCrops: "My Crops",
        AIChatbot: "AI Chatbot",
        Community: "Community",
        Profile: "Profile",
      },
    },
    hi: {
      weather_info: "मौसम की जानकारी",
      location: "स्थान",
      temperature: "तापमान",
      condition: "स्थिति",
      humidity: "आर्द्रता",
      wind_speed: "वायु गति",
      back: "← पीछे",
      sidebar: {
        Home: "होम",
        MyCrops: "मेरी फसलें",
        AIChatbot: "एआई चैटबॉट",
        Community: "समुदाय",
        Profile: "प्रोफ़ाइल",
      },
    },
    ta: {
      weather_info: "வானிலை தகவல்",
      location: "இடம்",
      temperature: "வெப்பநிலை",
      condition: "நிலைமை",
      humidity: "ஈரப்பதம்",
      wind_speed: "காற்றின் வேகம்",
      back: "← பின்புறம்",
      sidebar: {
        Home: "முகப்பு",
        MyCrops: "என் பயிர்கள்",
        AIChatbot: "ஏஐ உரையாடல்",
        Community: "சமூகம்",
        Profile: "சுயவிவரம்",
      },
    },
  };

  const t = translations[language]; // Current language strings

  const data = {
    current: {
      temp: 28.55,
      description: "Few clouds",
      humidity: 24,
      wind_speed: 2.62,
    },
  };

  // Tap language icon to cycle: en → hi → ta → en ...
  const handleLanguageTap = () => {
    setLanguage(language === "en" ? "hi" : language === "hi" ? "ta" : "en");
  };

  useEffect(() => {
    const backAction = () => {
      router.replace("/screens/home");
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      {/* Main Content */}
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {/* Top Bar */}
        <View style={styles.topBar}>
          <TouchableOpacity
            onPress={() => router.replace("/screens/home")}
            style={styles.backButtonContainer}
          >
            <Text style={styles.backButton}>{t.back}</Text>
          </TouchableOpacity>

          <Text style={styles.headerTitle}>{t.weather_info}</Text>

          <TouchableOpacity
            onPress={handleLanguageTap}
            style={styles.langIconContainer}
          >
            <MaterialIcons name="language" size={28} color="#28a745" />
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <View style={styles.cardTitleRow}>
            <Ionicons name="location-outline" size={20} color="#28a745" />
            <Text style={styles.cardTitle}>{t.location}</Text>
          </View>
          <Text style={styles.cardText}>{location}</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.cardTitleRow}>
            <Ionicons name="thermometer-outline" size={20} color="#28a745" />
            <Text style={styles.cardTitle}>{t.temperature}</Text>
          </View>
          <Text style={styles.cardText}>{data.current.temp} °C</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.cardTitleRow}>
            <Ionicons name="cloud-outline" size={20} color="#28a745" />
            <Text style={styles.cardTitle}>{t.condition}</Text>
          </View>
          <Text style={styles.cardText}>{data.current.description}</Text>
        </View>

        <View style={styles.cardRow}>
          <View style={styles.smallCard}>
            <View style={styles.cardTitleRow}>
              <Ionicons name="water-outline" size={16} color="#28a745" />
              <Text style={styles.smallCardTitle}>{t.humidity}</Text>
            </View>
            <Text style={styles.smallCardText}>{data.current.humidity}%</Text>
          </View>

          <View style={styles.smallCard}>
            <View style={styles.cardTitleRow}>
              <Ionicons name="rainy-outline" size={16} color="#28a745" />
              <Text style={styles.smallCardTitle}>{t.wind_speed}</Text>
            </View>
            <Text style={styles.smallCardText}>
              {data.current.wind_speed} km/h
            </Text>
          </View>
        </View>
        <View style={{ height: 80 }} />
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity onPress={() => router.push("/screens/home")}>
          <Ionicons name="home" size={22} color="#047857" />
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

        <TouchableOpacity onPress={() => router.push("/screens/profile")}>
          <Ionicons name="person" size={22} color="#666" />
          <Text style={styles.navText}>{t.sidebar.Profile}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 60,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  backButtonContainer: {
    padding: 8,
  },
  backButton: {
    color: "#28a745",
    fontSize: 18,
    fontWeight: "600",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#155f19",
    textAlign: "center",
  },
  langIconContainer: {
    padding: 5,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },
  cardTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#28a745",
    marginLeft: 5,
  },
  cardText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  smallCard: {
    backgroundColor: "#ffffff",
    flex: 1,
    marginHorizontal: 5,
    borderRadius: 12,
    padding: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },
  smallCardTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#28a745",
    marginLeft: 5,
  },
  smallCardText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
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
  navText: {
    fontSize: 12,
    textAlign: "center",
    color: "#444",
  },
  chatbotNavButton: {
    alignItems: "center",
  },
});
