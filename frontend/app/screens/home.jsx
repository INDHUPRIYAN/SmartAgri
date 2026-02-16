// app/home/index.jsx
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  Modal,
  SafeAreaView,
  Dimensions,
} from "react-native";
import { router } from "expo-router";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

// Import local images
import weatherImg from "../../assets/images/weather.jpeg";
import cropsImg from "../../assets/images/mycrops.jpg";
import soilImg from "../../assets/images/soilhealth.jpeg";
import diseaseImg from "../../assets/images/disease.webp";
import schemesImg from "../../assets/images/schemes.jpg";
import communityImg from "../../assets/images/community.jpg";
import topCropImg from "../../assets/images/topcrop.jpeg";
import sustainableImg from "../../assets/images/sustainable.webp";
import predict from "../../assets/images/yield-prediction.webp";

// ----------------------
// Translations
// ----------------------
const translations = {
  en: {
    appName: "SmartAgri",
    greeting: "Hello",
    topBarLanguage: "Language",
    weather: {
      alert: "Weather Alert! Tap to check",
      normal: "☀️ Today's Weather: 23°C Sunny",
    },
    sidebar: {
      Home: "Home",
      Profile: "Profile",
      SoilHealth: "Soil Health Analysis",
      DiseaseDetection: "Disease Detection",
      TopCrop: "Top Crop",
      MyCrops: "My Crops",
      SustainableFarming: "Sustainable Farming",
      Community: "Community",
      Weather: "Weather",
      Settings: "Settings",
      Logout: "Logout",
      Schemes: "Schemes",
      AIChatbot: "AI Chatbot",
      YieldPrediction: "Yield Prediction",
    },
  },
  hi: {
    appName: "स्मार्ट एग्री",
    greeting: "नमस्ते",
    topBarLanguage: "भाषा",
    weather: {
      alert: "मौसम चेतावनी! जाँचने के लिए टैप करें",
      normal: "☀️ आज का मौसम: 23°C धूप",
    },
    sidebar: {
      Home: "मुख्य पृष्ठ",
      Profile: "प्रोफ़ाइल",
      SoilHealth: "मृदा स्वास्थ्य विश्लेषण",
      DiseaseDetection: "फसल रोग पहचान",
      TopCrop: "शीर्ष फसल",
      MyCrops: "मेरी फसलें",
      SustainableFarming: "सतत खेती",
      Community: "सामुदायिक पृष्ठ",
      Weather: "मौसम",
      Settings: "सेटिंग्स",
      Logout: "लॉगआउट",
      Schemes: "योजनाएँ",
      AIChatbot: "एआई चैटबॉट",
      YieldPrediction: "उपज पूर्वानुमान",
    },
  },
  ta: {
    appName: "ஸ்மார்ட் அக்ரி",
    greeting: "வணக்கம்",
    topBarLanguage: "மொழி",
    weather: {
      alert: "வானிலை எச்சரிக்கை! பார்க்க தட்டவும்",
      normal: "☀️ இன்றைய வானிலை: 23°C வெயில்",
    },
    sidebar: {
      Home: "முகப்பு",
      Profile: "சுயவிவரம்",
      SoilHealth: "மண் ஆரோக்கியம்",
      DiseaseDetection: "நோய் கண்டறிதல்",
      TopCrop: "முதல் பயிர்",
      MyCrops: "என் பயிர்கள்",
      SustainableFarming: "நிலைத்த வேளாண்மை",
      Community: "சமூகம்",
      Weather: "வானிலை",
      Settings: "அமைப்புகள்",
      Logout: "வெளியேறு",
      Schemes: "திட்டங்கள்",
      AIChatbot: "ஏ.ஐ. உழவன்",
      YieldPrediction: "விளைச்சல் கணிப்பு",
    },
  },
};

// Translation helper
const t = (lang, key) => {
  const keys = key.split(".");
  let val = translations[lang];
  for (let k of keys) val = val?.[k];
  return val || key;
};

// constants for consistent sizing
const CARD_HEIGHT = 170;
const BANNER_HEIGHT = Math.round(CARD_HEIGHT * 0.6); // e.g. 102
const SCREEN_PADDING_HORIZONTAL = 15;
const SCREEN_WIDTH = Dimensions.get("window").width;
const CONTENT_WIDTH = SCREEN_WIDTH - SCREEN_PADDING_HORIZONTAL * 2;

export default function Home() {
  const username = "Priyan";
  const [language, setLanguage] = useState("en");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [languagePopup, setLanguagePopup] = useState(false);
  const [alertActive, setAlertActive] = useState(true); // simulate weather alert

  const cards = [
    {
    title: "YieldPrediction", // New card
    img: predict, // You can replace with a dedicated yield prediction image
    route: "/screens/yieldprediction",
    subtitle: "Predict your crop yield 🌾",
    icon: <MaterialIcons name="analytics" size={28} color="#fff" />,
    },
    {
      title: "TopCrop",
      img: topCropImg,
      route: "/screens/top-crop",
      icon: <MaterialIcons name="emoji-nature" size={28} color="#fff" />,
    },
    {
      title: "MyCrops",
      img: cropsImg,
      route: "/screens/MyCrops",
      subtitle: "🌞 Sunny - 31% | 🌾 Porays - 37",
      icon: <MaterialIcons name="grass" size={28} color="#fff" />,
    },
    {
      title: "SoilHealth",
      img: soilImg,
      route: "/screens/soil-health",
      subtitle: "pH Nutrient: 17%",
      icon: <MaterialIcons name="terrain" size={28} color="#fff" />,
    },
    {
      title: "DiseaseDetection",
      img: diseaseImg,
      route: "/screens/disease-detection",
      subtitle: "Tap to detect disease",
      icon: <MaterialIcons name="healing" size={28} color="#fff" />,
    },
    {
      title: "Schemes",
      img: schemesImg,
      route: "/screens/Schemes",
      icon: <MaterialIcons name="account-balance" size={28} color="#fff" />,
    },
    {
      title: "Community",
      img: communityImg,
      route: "/screens/Community",
      icon: <Ionicons name="people" size={28} color="#fff" />,
    },
    {
      title: "SustainableFarming",
      img: sustainableImg,
      route: "/screens/SustainableFarming",
      icon: <MaterialIcons name="eco" size={28} color="#fff" />,
    },
  ];

  const topSidebarItems = [
    { name: "SoilHealth", route: "/screens/soil-health", icon: "terrain" },
    { name: "DiseaseDetection", route: "/screens/disease-detection", icon: "healing" },
    { name: "TopCrop", route: "/screens/top-crop", icon: "emoji-nature" },
    { name: "MyCrops", route: "/screens/MyCrops", icon: "grass" },
    { name: "SustainableFarming", route: "/screens/SustainableFarming", icon: "eco" },
    { name: "Community", route: "/screens/Community", icon: "people" },
    { name: "Weather", route: "/screens/weather", icon: "cloud" },
    { name: "Schemes", route: "/screens/Schemes", icon: "account-balance" },
  ];

  const bottomSidebarItems = [
    { name: "Settings", route: "/screens/settings", icon: "settings" },
    { name: "Logout", route: "auth/signin", icon: "exit-to-app" },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Bar with dashboard, title & language icons */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => setSidebarOpen(true)}>
          <MaterialIcons name="menu" size={26} color="#047857" />
        </TouchableOpacity>
        <Text style={styles.appNameTop}>{t(language, "appName")}</Text>
        <TouchableOpacity onPress={() => setLanguagePopup(true)}>
          <MaterialIcons name="language" size={26} color="#047857" />
        </TouchableOpacity>
      </View>

      {/* Scrollable Main Content */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Greeting Section */}
        <View style={styles.greetingSection}>
          <Text style={styles.greeting}>
            {t(language, "greeting")}, {username}
          </Text>
        </View>

        {/* Banner (touchable) */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => router.push("/screens/weather")}
          style={[styles.bannerWrapper, { height: BANNER_HEIGHT }]}
        >
          <ImageBackground
            source={weatherImg}
            style={styles.bannerImage}
            imageStyle={{ borderRadius: 12 }}
            resizeMode="cover"
          >
            {/* dim overlay to keep text readable */}
            <View style={styles.bannerOverlay}>
              <Text style={styles.bannerText}>
  {alertActive
    ? t(language, "weather.alert")
    : t(language, "weather.normal")}
</Text>

            </View>
          </ImageBackground>
        </TouchableOpacity>

        {/* Cards container (keeps two cards per row) */}
        <View style={styles.cardsContainer}>
          {cards.map((card, i) => (
            <TouchableOpacity
              key={i}
              style={styles.card}
              onPress={() => router.push(card.route)}
            >
              <ImageBackground
                source={card.img}
                style={styles.cardBg}
                imageStyle={styles.cardImage}
                resizeMode="cover"
              >
                <View style={styles.overlay} />
                <View style={styles.cardContent}>
                  <View style={styles.iconWrapper}>{card.icon}</View>
                  <Text style={styles.cardTitle}>
                    {t(language, `sidebar.${card.title}`)}
                  </Text>
                  {card.subtitle && (
                    <Text style={styles.cardSubtitle}>{card.subtitle}</Text>
                  )}
                </View>
              </ImageBackground>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity onPress={() => router.push("/screens/home")}>
          <Ionicons name="home" size={22} color="#047857" />
          <Text style={styles.navText}>{t(language, "sidebar.Home")}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/screens/MyCrops")}>
          <Ionicons name="leaf" size={22} color="#666" />
          <Text style={styles.navText}>{t(language, "sidebar.MyCrops")}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/screens/ChatBot")}
        style={styles.chatbotNavButton}>
          <Ionicons name="chatbubble-ellipses" size={26} color="#047857" />
          <Text style={[styles.navText, { color: "#047857", fontWeight: "bold" }]}>
            {t(language, "sidebar.AIChatbot")}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/screens/Community")}>
          <Ionicons name="people" size={22} color="#666" />
          <Text style={styles.navText}>{t(language, "sidebar.Community")}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/screens/profile")}>
          <Ionicons name="person" size={22} color="#666" />
          <Text style={styles.navText}>{t(language, "sidebar.Profile")}</Text>
        </TouchableOpacity>
      </View>

      {/* Sidebar */}
      {sidebarOpen && (
        <View style={styles.sidebar}>
          <TouchableOpacity
            onPress={() => setSidebarOpen(false)}
            style={styles.closeBtn}
          >
            <MaterialIcons name="close" size={28} color="#000" />
          </TouchableOpacity>

          <View style={{ flex: 1 }}>
            {topSidebarItems.map((item) => (
              <TouchableOpacity
                key={item.name}
                style={styles.sidebarItemWrapper}
                onPress={() => {
                  router.push(item.route);
                  setSidebarOpen(false);
                }}
              >
                <MaterialIcons
                  name={item.icon}
                  size={20}
                  color="#35513c"
                  style={{ marginRight: 12 }}
                />
                <Text style={styles.sidebarItem}>
                  {t(language, `sidebar.${item.name}`)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={{ borderTopWidth: 1, borderTopColor: "#ccc", paddingTop: 10 }}>
            {bottomSidebarItems.map((item) => (
              <TouchableOpacity
                key={item.name}
                style={styles.sidebarItemWrapper}
                onPress={() => {
                  if (item.name === "Logout") router.replace(`/${item.route}`);
                  else router.push(item.route);
                  setSidebarOpen(false);
                }}
              >
                <MaterialIcons
                  name={item.icon}
                  size={20}
                  color="#35513c"
                  style={{ marginRight: 12 }}
                />
                <Text style={styles.sidebarItem}>
                  {t(language, `sidebar.${item.name}`)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Language Modal */}
      <Modal
        transparent
        visible={languagePopup}
        animationType="fade"
        onRequestClose={() => setLanguagePopup(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{t(language, "topBarLanguage")}</Text>
            {["en", "hi", "ta"].map((langCode) => (
              <TouchableOpacity
                key={langCode}
                style={styles.modalBtn}
                onPress={() => {
                  setLanguage(langCode);
                  setLanguagePopup(false);
                }}
              >
                <Text>{translations[langCode].appName}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// ----------------------
// Styles
// ----------------------
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fbfbff" },

  // Top Bar
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingTop: 40,
    paddingBottom: 10,
  },
  appNameTop: { fontSize: 20, fontWeight: "bold", color: "#094d18ff" },

  // Scroll Content
  scrollContent: {
    paddingHorizontal: SCREEN_PADDING_HORIZONTAL,
    paddingBottom: 120,
  },

  // Greeting Section
  greetingSection: {
    width: "100%",
    marginBottom: 8,
  },
  greeting: { fontSize: 16,fontWeight: "600", color: "#095d0eff", marginVertical: 6 },

  // Banner wrapper (uses dynamic height)
  bannerWrapper: {
    width: "100%",
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
  },
  bannerImage: {
    width: "100%",
    height: "120%",
    justifyContent: "center",
    alignItems: "center",
  },
  // overlay to ensure text is readable and always centered inside banner
  bannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.25)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  bannerText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
  },

  // Cards
  cardsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    width: "47%",
    height: CARD_HEIGHT,
    borderRadius: 16,
    marginBottom: 15,
    overflow: "hidden",
    backgroundColor: "#ccc",
    elevation: 4,
  },
  cardBg: {
    flex: 1,
    width: "100%",
    height: "100%",
    justifyContent: "flex-end",
  },
  cardImage: { borderRadius: 16 },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.35)" },
  cardContent: { padding: 10, alignItems: "flex-start" },
  iconWrapper: { marginBottom: 5 },
  cardTitle: { fontSize: 16, fontWeight: "bold", color: "#fff" },
  cardSubtitle: { fontSize: 13, color: "#eee", marginTop: 2 },

  // Bottom nav
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 8,
    paddingBottom: 10,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    backgroundColor: "#fff",
  },
  navText: { fontSize: 12, color: "#444", marginTop: 2, textAlign: "center" },
  chatbotNavButton: { alignItems: "center", justifyContent: "center" },

  // Sidebar
  sidebar: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 220,
    height: "100%",
    backgroundColor: "#fff",
    padding: 20,
    elevation: 8,
    zIndex: 20,
  },
  closeBtn: { alignSelf: "flex-end", marginBottom: 20 },
  sidebarItemWrapper: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  sidebarItem: { fontSize: 15, color: "#111" },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: 220,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 10 },
  modalBtn: {
    paddingVertical: 8,
    marginVertical: 5,
    backgroundColor: "#e5f7eb",
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
  },
});
