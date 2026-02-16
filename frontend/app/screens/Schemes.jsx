// app/screens/Schemes.jsx
import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { MaterialIcons, FontAwesome5, Ionicons } from "@expo/vector-icons";

// 🌍 Multi-lingual translations for UI, Schemes & Bottom Nav
const translations = {
  en: {
    title: "🌾 Government Agricultural Schemes",
    schemesHeader: "📜 Important Schemes",
    back: "← Back",
    sidebar: {
      Home: "Home",
      MyCrops: "My Crops",
      AIChatbot: "AI Chatbot",
      Community: "Community",
      Profile: "Profile",
    },
    schemes: [
      {
        name: "Pradhan Mantri Fasal Bima Yojana",
        description:
          "Crop insurance scheme providing financial support to farmers in case of crop failure.",
      },
      {
        name: "PM-Kisan Samman Nidhi",
        description:
          "Direct income support scheme providing ₹6,000 per year to small and marginal farmers.",
      },
      {
        name: "Soil Health Card Scheme",
        description:
          "Provides farmers with soil health cards with crop-wise nutrient recommendations.",
      },
      {
        name: "Pradhan Mantri Krishi Sinchai Yojana",
        description:
          "Irrigation scheme to improve water efficiency and expand irrigation coverage.",
      },
      {
        name: "National Agriculture Market (eNAM)",
        description:
          "An online trading platform to help farmers sell their produce directly in markets across India.",
      },
    ],
  },
  hi: {
    title: "🌾 सरकारी कृषि योजनाएँ",
    schemesHeader: "📜 महत्वपूर्ण योजनाएँ",
    back: "← पीछे",
    sidebar: {
      Home: "होम",
      MyCrops: "मेरी फसलें",
      AIChatbot: "एआई चैटबॉट",
      Community: "समुदाय",
      Profile: "प्रोफ़ाइल",
    },
    schemes: [
      {
        name: "प्रधान मंत्री फसल बीमा योजना",
        description:
          "फसल विफलता के मामले में किसानों को वित्तीय सहायता प्रदान करने वाली बीमा योजना।",
      },
      {
        name: "पीएम-किसान सम्मान निधि",
        description:
          "छोटे और सीमांत किसानों को प्रति वर्ष ₹6,000 की सीधे आय सहायता प्रदान करने वाली योजना।",
      },
      {
        name: "मृदा स्वास्थ्य कार्ड योजना",
        description:
          "किसानों को फसल-वार पोषक तत्वों की सिफारिशों के साथ मृदा स्वास्थ्य कार्ड प्रदान करती है।",
      },
      {
        name: "प्रधान मंत्री कृषि सिंचाई योजना",
        description:
          "सिंचाई योजना जो जल दक्षता में सुधार और सिंचाई कवरेज का विस्तार करती है।",
      },
      {
        name: "राष्ट्रीय कृषि बाजार (eNAM)",
        description:
          "एक ऑनलाइन ट्रेडिंग प्लेटफ़ॉर्म जो किसानों को सीधे भारत भर के बाजारों में अपनी उपज बेचने में मदद करता है।",
      },
    ],
  },
  ta: {
    title: "🌾 அரசாங்க விவசாய திட்டங்கள்",
    schemesHeader: "📜 முக்கிய திட்டங்கள்",
    back: "← பின்னால்",
    sidebar: {
      Home: "முகப்பு",
      MyCrops: "என் பயிர்கள்",
      AIChatbot: "ஏஐ உரையாடல்",
      Community: "சமூகம்",
      Profile: "சுயவிவரம்",
    },
    schemes: [
      {
        name: "பிரதான் மந்திரி பயிர் காப்பீட்டு திட்டம்",
        description:
          "பயிர் தோல்வியின் போது விவசாயிகளுக்கு நிதி ஆதரவை வழங்கும் காப்பீட்டு திட்டம்.",
      },
      {
        name: "பிஎம்-கிசான் ஸம்மான் நிதி",
        description:
          "சிறிய மற்றும் எல்லைப்பார்வை விவசாயிகளுக்கு ஆண்டு ₹6,000 நேரடி ஆதரவு வழங்கும் திட்டம்.",
      },
      {
        name: "மண் சுகாதார அட்டை திட்டம்",
        description:
          "விவசாயிகளுக்கு பயிர் வாரி ஊட்டச்சத்து பரிந்துரைகளுடன் மண் சுகாதார அட்டைகள் வழங்குகிறது.",
      },
      {
        name: "பிரதான் மந்திரி கிரிஷி சிண்சாய் யோஜனா",
        description:
          "நீர்வழி திறன் மேம்படுத்த மற்றும் நீர்ப்பாசனத்தினை விரிவாக்கும் திட்டம்.",
      },
      {
        name: "தேசிய வேளாண் சந்தை (eNAM)",
        description:
          "விவசாயிகளுக்கு இந்தியா முழுவதும் சந்தைகளில் நேரடியாக தங்கள் விளைவுகளை விற்க உதவும் ஆன்லைன் வணிக தளம்.",
      },
    ],
  },
};

// 🌱 Scheme icons
const schemeIcons = [
  <MaterialIcons name="security" size={24} color="#10b981" />,
  <FontAwesome5 name="rupee-sign" size={20} color="#f59e0b" />,
  <Ionicons name="leaf-outline" size={24} color="#34d399" />,
  <MaterialIcons name="water-drop" size={24} color="#3b82f6" />,
  <MaterialIcons name="storefront" size={24} color="#8b5cf6" />,
];

export default function Schemes() {
  const router = useRouter();
  const [language, setLanguage] = useState("en");
  const t = translations[language];

  // Toggle language
  const toggleLanguage = () => {
    setLanguage(language === "en" ? "hi" : language === "hi" ? "ta" : "en");
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Top Bar */}
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => router.replace("/screens/home")}>
            <Text style={styles.backButton}>{t.back}</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t.title}</Text>
          <TouchableOpacity onPress={toggleLanguage}>
            <MaterialIcons name="language" size={26} color="#10b981" />
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionHeader}>{t.schemesHeader}</Text>

        {/* Schemes List */}
        {t.schemes.map((scheme, index) => (
          <View key={index} style={styles.schemeCard}>
            <View style={styles.schemeIcon}>{schemeIcons[index]}</View>
            <View style={styles.schemeInfo}>
              <Text style={styles.schemeName}>{scheme.name}</Text>
              <Text style={styles.schemeDescription}>{scheme.description}</Text>
            </View>
          </View>
        ))}

        <View style={{ height: 80 }} />
      </ScrollView>

      {/* ✅ Bottom Navigation */}
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
          <Text
            style={[styles.navText, { color: "#047857", fontWeight: "bold" }]}
          >
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
  container: {
    padding: 15,
    paddingTop: 60,
    paddingBottom: 40,
    backgroundColor: "#f9fafb",
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  backButton: {
    fontSize: 16,
    fontWeight: "600",
    color: "#10b981",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#065f46",
    flex: 1,
    textAlign: "center",
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: "600",
    marginVertical: 10,
    color: "#065f46",
  },
  schemeCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 2,
    alignItems: "center",
  },
  schemeIcon: {
    width: 40,
    height: 40,
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  schemeInfo: {
    flex: 1,
  },
  schemeName: {
    fontWeight: "600",
    fontSize: 16,
    marginBottom: 4,
    color: "#065f46",
  },
  schemeDescription: {
    fontSize: 14,
    color: "#374151",
  },

  // ✅ Bottom Nav Styles
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
