// app/screens/TopCrop.jsx
import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  TextInput,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";
import * as Speech from "expo-speech";
import { useRouter } from "expo-router";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";

// Enable animation for Android
if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// 🌍 Translations
const translations = {
  en: {
    topTitle: "Top Regional Crops",
    highlights: "Regional Crop Highlights",
    details: "Details",
    save: "Save / Plan",
    aiTip: "AI Tip",
    ask: "Ask Question",
    voice: "Voice Tips",
    planned: "Planned Crops",
    askPlaceholder: "Ask a question about",
  },
  ta: {
    topTitle: "சிறந்த பிராந்திய பயிர்கள்",
    highlights: "பிராந்திய பயிர் சிறப்பம்சங்கள்",
    details: "விவரங்கள்",
    save: "சேமிக்கவும் / திட்டமிடவும்",
    aiTip: "செயற்கை நுண்ணறிவு குறிப்பு",
    ask: "கேள்வி கேட்கவும்",
    voice: "குரல் குறிப்புகள்",
    planned: "திட்டமிட்ட பயிர்கள்",
    askPlaceholder: "கேள்வி கேட்கவும்",
  },
};

// 🌱 Crop Data
const regionalCrops = [
  {
    id: 1,
    name: "Groundnut",
    image: require("../../assets/images/leaf.jpeg"),
    aiTip:
      "Thrives in warm, well-drained loam soil with slightly alkaline pH. Moderate humidity supports good growth.",
  },
  {
    id: 2,
    name: "Soybean",
    image: require("../../assets/images/leaf.jpeg"),
    aiTip:
      "Prefers warm temperatures and well-drained soil. Overcast conditions prevent excessive water loss.",
  },
  {
    id: 3,
    name: "Black Gram (Urad Bean)",
    image: require("../../assets/images/leaf.jpeg"),
    aiTip:
      "Drought-tolerant legume, adapts to slightly alkaline soil. Improves soil fertility while growing.",
  },
];

export default function TopCrop() {
  const router = useRouter();
  const [language, setLanguage] = useState("en");
  const [expandedId, setExpandedId] = useState(null);
  const [plannedCrops, setPlannedCrops] = useState([]);
  const [userQuestion, setUserQuestion] = useState("");
  const t = translations[language];

  const toggleExpand = (id) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedId(expandedId === id ? null : id);
  };

  const handleSavePlan = (crop) => {
    if (plannedCrops.find((c) => c.id === crop.id)) {
      Alert.alert("Already Added", `${crop.name} is already in your plan`);
      return;
    }
    setPlannedCrops([...plannedCrops, crop]);
    Alert.alert("Saved", `${crop.name} added to your crop plan`);
  };

  const handleAskQuestion = (crop) => {
    if (!userQuestion.trim()) {
      Alert.alert("Empty Question", "Please type a question before submitting.");
      return;
    }
    Alert.alert("Question Posted", `Your question about ${crop.name} is saved.`);
    setUserQuestion("");
  };

  const speakTips = (crop) => {
    Speech.speak(`AI Tip: ${crop.name}: ${crop.aiTip}`);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#f9fafb" }}>
      {/* Header */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.replace("/screens/home")}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t.topTitle}</Text>
        <TouchableOpacity
          onPress={() =>
            setLanguage(language === "en" ? "ta" : language === "ta" ? "en" : "en")
          }
        >
          <MaterialIcons name="language" size={26} color="#10b981" />
        </TouchableOpacity>
      </View>

      {/* Scrollable content */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.sectionTitle}>{t.highlights}</Text>

        {regionalCrops.map((crop) => (
          <View key={crop.id} style={styles.cropCard}>
            {/* Crop Header */}
            <TouchableOpacity
              style={styles.cropHeader}
              onPress={() => toggleExpand(crop.id)}
              activeOpacity={0.8}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Image source={crop.image} style={styles.cropImage} />
                <Text style={styles.cropName}>{crop.name}</Text>
              </View>
              <Ionicons
                name={expandedId === crop.id ? "chevron-up" : "chevron-down"}
                size={22}
                color="#047857"
              />
            </TouchableOpacity>

            {/* Expanded Content */}
            {expandedId === crop.id && (
              <View style={styles.expandedSection}>
                <Text style={styles.detailText}>{crop.aiTip}</Text>

                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: "#10b981" }]}
                    onPress={() => handleSavePlan(crop)}
                  >
                    <Ionicons name="save" size={18} color="#fff" />
                    <Text style={styles.buttonText}>{t.save}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: "#f97316" }]}
                    onPress={() => handleAskQuestion(crop)}
                  >
                    <Ionicons name="help-circle" size={18} color="#fff" />
                    <Text style={styles.buttonText}>{t.ask}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: "#8b5cf6" }]}
                    onPress={() => speakTips(crop)}
                  >
                    <Ionicons name="mic" size={18} color="#fff" />
                    <Text style={styles.buttonText}>{t.voice}</Text>
                  </TouchableOpacity>
                </View>

                <TextInput
                  style={styles.input}
                  placeholder={`${t.askPlaceholder} ${crop.name}...`}
                  value={userQuestion}
                  onChangeText={setUserQuestion}
                  multiline
                />
              </View>
            )}
          </View>
        ))}

        {/* Planned Crops */}
        {plannedCrops.length > 0 && (
          <View style={styles.plannedSection}>
            <Text style={styles.sectionTitle}>{t.planned}</Text>
            {plannedCrops.map((c) => (
              <View key={c.id} style={styles.plannedItem}>
                <Image source={c.image} style={styles.smallImage} />
                <Text>{c.name}</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

// 🌿 Styles
const styles = StyleSheet.create({
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#ecfdf5",
    paddingHorizontal: 15,
    paddingVertical: 14,
    elevation: 3,
  },
  backButton: { fontSize: 16, color: "#10b981", fontWeight: "600" },
  headerTitle: { fontSize: 20, fontWeight: "700", color: "#065f46" },
  scrollContainer: { padding: 15, paddingBottom: 40 },
  sectionTitle: { fontSize: 18, fontWeight: "700", color: "#065f46", marginBottom: 10 },

  cropCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 10,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  cropHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
  },
  cropImage: { width: 50, height: 50, borderRadius: 25, marginRight: 10 },
  cropName: { fontSize: 16, fontWeight: "600", color: "#065f46" },

  expandedSection: {
    backgroundColor: "#fef3c7",
    padding: 12,
    borderTopWidth: 1,
    borderColor: "#fcd34d",
  },
  detailText: { fontSize: 14, color: "#78350f", marginBottom: 8 },

  buttonRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 8,
  },
  actionButton: {
    flex: 1,
    padding: 8,
    borderRadius: 8,
    alignItems: "center",
    margin: 3,
    flexDirection: "row",
    justifyContent: "center",
    gap: 4,
  },
  buttonText: { color: "#fff", fontWeight: "600", fontSize: 13 },
  input: {
    borderWidth: 1,
    borderColor: "#9ca3af",
    borderRadius: 8,
    padding: 8,
    marginTop: 8,
    backgroundColor: "#fff",
  },

  plannedSection: {
    marginTop: 20,
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
  },
  plannedItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  smallImage: { width: 35, height: 35, borderRadius: 18, marginRight: 8 },
});
