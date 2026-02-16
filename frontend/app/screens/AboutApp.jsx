// app/screens/AboutApp.jsx
import React, { useState, useEffect } from "react";
import { 
  View, Text, ScrollView, StyleSheet, TouchableOpacity, BackHandler, Modal 
} from "react-native";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

// ----------------------
// Translation JSONs
// ----------------------
const translations = {
  en: {
    back: "Back",
    aboutAppHeading: "About Smart Agri App",
    
    // Overview
    overview: "Overview",
    overviewText1: "The Smart Agri App is an AI-powered, mobile-first platform designed to empower farmers with data-driven agricultural guidance.",
    overviewText2: "Our goal is to make modern farming accessible, efficient, and profitable.",
    overviewText3: "Farmers can get personalized crop recommendations, market insights, and sustainable farming tips directly from their mobile devices.",
    
    // Key Features
    keyFeatures: "Key Features",
    feature1: "• AI-Based Crop Recommendations",
    feature2: "• Plant Health & Disease Detection",
    feature3: "• Market Price Insights",
    feature4: "• Offline Mode & Multilingual Support",
    feature5: "• Sustainable Farming Recommendations",
    feature6: "• Farm Activity Tracking & Reports",
    
    // How It Helps
    howItHelps: "How It Helps Farmers",
    help1: "• Increase Income by choosing profitable crops",
    help2: "• Reduce Risks with early disease detection",
    help3: "• Save Time & Effort with AI-assisted guidance",
    help4: "• Promote Sustainability for long-term productivity",
    help5: "• Access information in native languages",
    
    // Technology
    technology: "Technology Behind the App",
    tech1: "• Machine Learning Models for crop prediction",
    tech2: "• Computer Vision for disease detection",
    tech3: "• APIs & IoT Integration for real-time data",
    tech4: "• Offline Storage & Multilingual NLP for accessibility",
    tech5: "• Cloud Infrastructure for scalability",
    
    // Vision
    ourVision: "Our Vision",
    visionText1: "To make agriculture more data-driven, sustainable, and profitable for small and medium farmers.",
    visionText2: "Empowering farmers with technology to make informed decisions and increase productivity.",

    // Team
    meetTeam: "Meet Our Team",
    
    // Footer/Extra
    contactUs: "Contact Us",
    contactInfo: "Email: support@smartagri.com | Phone: +91 9842220096",
  },

  hi: {
    back: "वापस",
    aboutAppHeading: "स्मार्ट एग्री ऐप के बारे में",
    
    overview: "सारांश",
    overviewText1: "स्मार्ट एग्री ऐप एक एआई-संचालित मोबाइल प्लेटफ़ॉर्म है जो किसानों को डेटा-संचालित कृषि मार्गदर्शन प्रदान करता है।",
    overviewText2: "हमारा लक्ष्य आधुनिक खेती को सुलभ, कुशल और लाभकारी बनाना है।",
    overviewText3: "किसान सीधे अपने मोबाइल डिवाइस से व्यक्तिगत फसल सिफारिशें, बाजार जानकारी और सतत खेती के सुझाव प्राप्त कर सकते हैं।",
    
    keyFeatures: "मुख्य विशेषताएं",
    feature1: "• एआई-आधारित फसल सिफारिशें",
    feature2: "• पौध स्वास्थ्य और रोग पहचान",
    feature3: "• बाजार मूल्य जानकारी",
    feature4: "• ऑफ़लाइन मोड और बहुभाषी समर्थन",
    feature5: "• सतत खेती की सिफारिशें",
    feature6: "• खेत गतिविधि ट्रैकिंग और रिपोर्ट्स",
    
    howItHelps: "किसानों की मदद कैसे करता है",
    help1: "• लाभकारी फसल चुनकर आय बढ़ाएं",
    help2: "• जल्दी रोग पहचान के साथ जोखिम कम करें",
    help3: "• एआई-सहायता मार्गदर्शन से समय और प्रयास बचाएं",
    help4: "• दीर्घकालिक उत्पादकता के लिए स्थिरता को बढ़ावा दें",
    help5: "• अपनी मातृभाषा में जानकारी प्राप्त करें",
    
    technology: "एप के पीछे की तकनीक",
    tech1: "• फसल भविष्यवाणी के लिए मशीन लर्निंग मॉडल",
    tech2: "• रोग पहचान के लिए कंप्यूटर विज़न",
    tech3: "• रीयल-टाइम डेटा के लिए APIs और IoT इंटीग्रेशन",
    tech4: "• पहुँच के लिए ऑफ़लाइन स्टोरेज और बहुभाषी NLP",
    tech5: "• स्केलेबिलिटी के लिए क्लाउड इन्फ्रास्ट्रक्चर",
    
    ourVision: "हमारी दृष्टि",
    visionText1: "छोटे और मध्यम किसानों के लिए कृषि को डेटा-संचालित, स्थायी और लाभकारी बनाना।",
    visionText2: "किसानों को जानकारीपूर्ण निर्णय लेने और उत्पादकता बढ़ाने के लिए तकनीक से सशक्त बनाना।",
    
    meetTeam: "हमारी टीम से मिलें",
    
    
    contactUs: "संपर्क करें",
    contactInfo: "ईमेल: support@smartagri.com | फोन: +91 9842220096",
  },

  ta: {
    back: "பின்செல்",
    aboutAppHeading: "ஸ்மார்ட் அகரி செயலியின் பற்றி",
    
    overview: "சுருக்கம்",
    overviewText1: "ஸ்மார்ட் அகரி செயலி ஒரு AI இயங்கும் மொபைல் முதன்மை தளம், விவசாயிகளை தரவின்மூலம் வழிகாட்டுகிறது.",
    overviewText2: "எங்கள் இலக்கு நவீன வேளாண்மையை எளிமையானது, திறமையானது மற்றும் லாபகரமானதாக செய்வது.",
    overviewText3: "விவசாயிகள் தங்கள் மொபைல் சாதனங்களிலிருந்து தனிப்பட்ட பயிர் பரிந்துரைகள், சந்தை தகவல்கள் மற்றும் நிலைத்த பயிர் அறிவுரைகளைப் பெறலாம்.",
    
    keyFeatures: "முக்கிய அம்சங்கள்",
    feature1: "• AI அடிப்படையிலான பயிர் பரிந்துரைகள்",
    feature2: "• செடிகள் ஆரோக்கியம் மற்றும் நோய் கண்டறிதல்",
    feature3: "• சந்தை விலை தகவல்கள்",
    feature4: "• ஆஃப்லைன் மோடு மற்றும் பலமொழி ஆதரவு",
    feature5: "• நிலைத்த வேளாண்மை பரிந்துரைகள்",
    feature6: "• விவசாய செயல்பாடுகள் கண்காணிப்பு & அறிக்கைகள்",
    
    howItHelps: "விவசாயிகளுக்கு உதவும் வழிகள்",
    help1: "• லாபகரமான பயிர்களைத் தேர்ந்தெடுத்து வருமானத்தை அதிகரிக்கவும்",
    help2: "• நோய் ஆரம்ப கட்டத்தில் கண்டறிதல் மூலம் அபாயத்தை குறைக்கவும்",
    help3: "• AI உதவியுடன் நேரம் மற்றும் முயற்சியை சேமிக்கவும்",
    help4: "• நீண்ட கால விளைச்சலுக்கான நிலைத்தன்மையை ஊக்குவிக்கவும்",
    help5: "• தாய்மொழியில் தகவலை அணுகவும்",
    
    technology: "செயலியின் தொழில்நுட்பம்",
    tech1: "• பயிர் கணிப்பிற்கான மெஷின் லெர்னிங் மாதிரிகள்",
    tech2: "• நோய் கண்டறிதலுக்கான கம்ப்யூட்டர் விஷன்",
    tech3: "• நேரடி தரவு API மற்றும் IoT ஒருங்கிணைப்பு",
    tech4: "• அணுகலுக்கான ஆஃப்லைன் சேமிப்பு மற்றும் பலமொழி NLP",
    tech5: "• விரிவாக்கத்திற்கான கிளவுட் கட்டமைப்பு",
    
    ourVision: "எங்கள் நோக்கம்",
    visionText1: "சிறிய மற்றும் நடுத்தர விவசாயிகளுக்கான விவசாயத்தை தரவு சார்ந்த, நிலைத்த மற்றும் லாபகரமானதாக மாற்றுதல்.",
    visionText2: "விவசாயிகளை அறிவார்ந்த முடிவுகளை எடுக்கவும், பயிர் விளைச்சலை அதிகரிக்கவும் தொழில்நுட்பத்தால் ஆதரிக்கவும்.",
    
    meetTeam: "எங்கள் குழுவை சந்திக்கவும்",
    
    
    contactUs: "எங்களை தொடர்பு கொள்ளவும்",
    contactInfo: "மின்னஞ்சல்: support@smartagri.com | தொலைபேசி: +91 9842220096",
  }
};



// ----------------------
// Translation helper
// ----------------------
const t = (lang, key) => translations[lang][key] || key;

// ----------------------
// AboutApp Component
// ----------------------
export default function AboutApp() {
  const router = useRouter();
  const [lang, setLang] = useState("en");
  const [modalVisible, setModalVisible] = useState(false);

  const goBackToSettings = () => router.replace("/screens/settings");
  const goToDevelopers = () => router.replace("/screens/Developers");

  useEffect(() => {
    const backAction = () => { goBackToSettings(); return true; };
    const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
    return () => backHandler.remove();
  }, []);

  const sections = [
    { title: "overview", texts: ["overviewText1","overviewText2","overviewText3"] },
    { title: "keyFeatures", texts: ["feature1","feature2","feature3","feature4","feature5","feature6"] },
    { title: "howItHelps", texts: ["help1","help2","help3","help4","help5"] },
    { title: "technology", texts: ["tech1","tech2","tech3","tech4","tech5"] },
    { title: "ourVision", texts: ["visionText1","visionText2"] },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backButton} onPress={goBackToSettings}>
          <MaterialIcons name="arrow-back-ios" size={20} color="#047827ff" />
          <Text style={styles.backText}>{t(lang, "back")}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.langIcon}>
          <MaterialIcons name="language" size={28} color="#047827ff" />
        </TouchableOpacity>
      </View>

      {/* Language Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {["en", "hi", "ta"].map((l) => (
              <TouchableOpacity
                key={l}
                style={styles.langOption}
                onPress={() => { setLang(l); setModalVisible(false); }}
              >
                <Text style={styles.langText}>
                  {l === "en" ? "English" : l === "hi" ? "हिंदी" : "தமிழ்"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>

      {/* Page Heading */}
      <Text style={styles.heading}>{t(lang, "aboutAppHeading")}</Text>

      {/* Sections */}
      {sections.map((sec) => (
        <View style={styles.section} key={sec.title}>
          <Text style={styles.sectionHeading}>{t(lang, sec.title)}</Text>
          {sec.texts.map((txtKey) => (
            <Text style={styles.sectionText} key={txtKey}>{t(lang, txtKey)}</Text>
          ))}
        </View>
      ))}

      {/* Contact Section */}
      <View style={styles.section}>
        <Text style={styles.sectionHeading}>{t(lang, "contactUs")}</Text>
        <Text style={styles.sectionText}>{t(lang, "contactInfo")}</Text>
      </View>

      {/* Developers Button */}
      <TouchableOpacity style={styles.teamButton} onPress={goToDevelopers}>
        <Text style={styles.teamButtonText}>{t(lang, "meetTeam")}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#f9fafb", paddingTop: 60, paddingBottom: 80 },
  topBar: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 15 },
  backButton: { flexDirection: "row", alignItems: "center" },
  backText: { fontSize: 16, color: "#047827ff", fontWeight: "600", marginLeft: 5 },
  langIcon: { padding: 5 },
  heading: { fontSize: 26, fontWeight: "bold", color: "#047827ff", marginBottom: 20, textAlign: "center" },
  section: { marginBottom: 25 },
  sectionHeading: { fontSize: 20, fontWeight: "700", color: "#065f46", marginBottom: 8 },
  sectionText: { fontSize: 15, color: "#374151", lineHeight: 22, marginTop: 3 },
  teamButton: { backgroundColor: "#047827ff", padding: 15, borderRadius: 12, alignItems: "center", marginTop: 10 },
  teamButtonText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.3)", justifyContent: "center", alignItems: "center" },
  modalContent: { backgroundColor: "#fff", borderRadius: 12, padding: 20, width: 200 },
  langOption: { paddingVertical: 10, alignItems: "center" },
  langText: { fontSize: 16, fontWeight: "600" },
});


