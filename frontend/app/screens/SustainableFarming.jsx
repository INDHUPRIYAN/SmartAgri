import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Modal,
  SafeAreaView,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

// Self-contained Translations
const translations = {
  en: {
    back: "← Back",
    header: "🌿 Sustainable Farming",
    greenPoints: "🌱 Green Points",
    subHeader: "Available Sustainable Practices",
    noActivities: "No activities yet",
    activitiesDone: "✅ Activities Done",
    certificateTitle: "🏆 Sustainable Farming Certificate",
    certificateDesc: "Farmer has demonstrated organic and eco-friendly practices!",
    farmingActivities: [
      "Used Organic Fertilizer",
      "Crop Rotation",
      "Drip Irrigation",
      "Planted Cover Crops",
      "Solar Energy Usage",
    ],
    selectLang: "Select Language",
    en: "English",
    hi: "Hindi",
    ta: "Tamil",
  },
  hi: {
    back: "← वापस",
    header: "🌿 सतत खेती",
    greenPoints: "🌱 ग्रीन पॉइंट्स",
    subHeader: "उपलब्ध टिकाऊ प्रथाएँ",
    noActivities: "अभी कोई गतिविधियाँ नहीं",
    activitiesDone: "✅ पूरी की गई गतिविधियाँ",
    certificateTitle: "🏆 सतत खेती प्रमाण पत्र",
    certificateDesc: "किसान ने जैविक और पर्यावरण-अनुकूल प्रथाओं को अपनाया है!",
    farmingActivities: [
      "जैविक उर्वरक का उपयोग किया",
      "फसल चक्रीकरण",
      "ड्रिप सिंचाई",
      "कवर फसलों की खेती",
      "सौर ऊर्जा का उपयोग",
    ],
    selectLang: "भाषा चुनें",
    en: "अंग्रेज़ी",
    hi: "हिंदी",
    ta: "तमिल",
  },
  ta: {
    back: "← பின் செல்ல",
    header: "🌿 நிலையான வேளாண்மை",
    greenPoints: "🌱 பசுமை புள்ளிகள்",
    subHeader: "கிடைக்கும் நிலைத்த பணி முறைகள்",
    noActivities: "இன்னும் எந்த நடவடிக்கையும் செய்யப்படவில்லை",
    activitiesDone: "✅ செய்யப்பட்ட செயல்கள்",
    certificateTitle: "🏆 நிலையான வேளாண்மை சான்றிதழ்",
    certificateDesc: "விவசாயி கரிம மற்றும் சுற்றுச்சூழல் நண்பர் நடைமுறைகளை முன்னிறுத்தியுள்ளார்!",
    farmingActivities: [
      "ஆர்கானிக் உரம் பயன்படுத்தப்பட்டது",
      "பயிர் சுழற்சி",
      "திரிபி ஊர்தல்",
      "கவர் பயிர்கள் நடவு",
      "சூரிய சக்தி பயன்பாடு",
    ],
    selectLang: "மொழியை தேர்வு செய்யவும்",
    en: "ஆங்கிலம்",
    hi: "ஹிந்தி",
    ta: "தமிழ்",
  },
};

export default function SustainableFarming() {
  const router = useRouter();
  const [language, setLanguage] = useState("en");
  const [greenPoints, setGreenPoints] = useState(0);
  const [activities, setActivities] = useState([]);
  const [certificateUnlocked, setCertificateUnlocked] = useState(false);
  const [langModalVisible, setLangModalVisible] = useState(false);

  const t = translations[language];

  const farmingActivities = [
    { name: t.farmingActivities[0], points: 10 },
    { name: t.farmingActivities[1], points: 8 },
    { name: t.farmingActivities[2], points: 7 },
    { name: t.farmingActivities[3], points: 5 },
    { name: t.farmingActivities[4], points: 6 },
  ];

  const addActivity = (act) => {
    setActivities([...activities, act]);
    const newPoints = greenPoints + act.points;
    setGreenPoints(newPoints);

    if (newPoints >= 50 && !certificateUnlocked) {
      setCertificateUnlocked(true);
      alert(t.certificateDesc);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header Bar */}
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => router.replace("/screens/home")}>
            <Text style={styles.backButton}>{t.back}</Text>
          </TouchableOpacity>

          <Text style={styles.header}>{t.header}</Text>

          <TouchableOpacity onPress={() => setLangModalVisible(true)}>
            <Ionicons name="language-outline" size={28} color="#065f46" />
          </TouchableOpacity>
        </View>

        {/* Green Points */}
        <Text style={styles.greenPoints}>
          {t.greenPoints}: <Text style={{ fontWeight: "bold" }}>{greenPoints}</Text>
        </Text>

        {/* Farming Activities Buttons */}
        <Text style={styles.subHeader}>{t.subHeader}</Text>
        <View style={styles.activityButtonsContainer}>
          {farmingActivities.map((act, i) => (
            <TouchableOpacity
              key={i}
              style={styles.activityButton}
              onPress={() => addActivity(act)}
            >
              <Text style={styles.activityText}>
                {act.name} (+{act.points})
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Done Activities */}
        <Text style={styles.subHeader}>{t.activitiesDone}</Text>
        <View style={styles.activitiesList}>
          {activities.length === 0 ? (
            <Text style={styles.noActivities}>{t.noActivities}</Text>
          ) : (
            activities.map((a, i) => (
              <Text key={i} style={styles.doneActivity}>
                ✔ {a.name} (+{a.points})
              </Text>
            ))
          )}
        </View>

        {/* Certificate */}
        {certificateUnlocked && (
          <View style={styles.certificateContainer}>
            <Text style={styles.certificateTitle}>{t.certificateTitle}</Text>
            <Text style={styles.certificateDesc}>{t.certificateDesc}</Text>
          </View>
        )}

        <View style={{ height: 40 }} />

        {/* Language Selector Modal */}
        <Modal visible={langModalVisible} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.langModalTitle}>{t.selectLang}</Text>

              {["en", "hi", "ta"].map((lang) => (
                <TouchableOpacity
                  key={lang}
                  style={styles.langButton}
                  onPress={() => {
                    setLanguage(lang);
                    setLangModalVisible(false);
                  }}
                >
                  <Text style={styles.langButtonText}>{t[lang]}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f9fafb",
    flexGrow: 1,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  backButton: {
    fontSize: 18,
    color: "#2563eb",
    fontWeight: "600",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#065f46",
  },
  greenPoints: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
    marginVertical: 10,
    color: "#16a34a",
  },
  subHeader: {
    fontSize: 20,
    fontWeight: "600",
    marginTop: 15,
    color: "#065f46",
  },
  activityButtonsContainer: {
    marginVertical: 15,
    gap: 12,
  },
  activityButton: {
    backgroundColor: "#10b981",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  activityText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
  activitiesList: {
    backgroundColor: "#ffffff",
    padding: 15,
    borderRadius: 10,
    minHeight: 100,
  },
  noActivities: {
    textAlign: "center",
    color: "#6b7280",
    fontSize: 16,
  },
  doneActivity: {
    fontSize: 16,
    paddingVertical: 5,
    color: "#065f46",
  },
  certificateContainer: {
    backgroundColor: "#d1fae5",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 25,
  },
  certificateTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#10b981",
    textAlign: "center",
  },
  certificateDesc: {
    marginTop: 8,
    fontSize: 16,
    textAlign: "center",
    color: "#065f46",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#ffffff",
    padding: 25,
    borderRadius: 12,
    width: "80%",
    alignItems: "center",
  },
  langModalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#065f46",
  },
  langButton: {
    paddingVertical: 12,
    width: "100%",
    backgroundColor: "#10b981",
    borderRadius: 10,
    marginVertical: 8,
    alignItems: "center",
  },
  langButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
