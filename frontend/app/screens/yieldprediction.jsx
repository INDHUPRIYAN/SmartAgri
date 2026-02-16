import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LineChart } from "react-native-chart-kit";
import { useRouter } from "expo-router";

const screenWidth = Dimensions.get("window").width;

const translations = {
  en: {
    title: "Yield Prediction",
    inputTitle: "Input Crop Details",
    crop: "Crop Type (e.g., Paddy, Wheat)",
    location: "Location (e.g., Thanjavur, Tamil Nadu)",
    season: "Season (e.g., Kharif / Rabi)",
    soilType: "Soil Type (Loamy, Clay, Sandy)",
    temp: "Average Temperature (°C)",
    rain: "Rainfall (mm)",
    predict: "Predict Yield",
    clear: "Clear",
    predicted: "Predicted Yield",
    confidence: "Confidence",
    suggestionTitle: "AI Suggestion",
    suggestion:
      "Based on your soil and weather, increase nitrogen by 10% and maintain proper irrigation in week 3 for optimal yield.",
    history: "Prediction History",
  },
  ta: {
    title: "மதிப்பிடப்பட்ட விளைச்சல்",
    inputTitle: "பயிர் விவரங்களை உள்ளிடவும்",
    crop: "பயிர் வகை (உ.தா., நெல், கோதுமை)",
    location: "இடம் (உ.தா., தஞ்சாவூர், தமிழ்நாடு)",
    season: "பருவம் (உ.தா., கறிஃப் / ரபி)",
    soilType: "மண் வகை (மணல், மண்ணி, கரிமம்)",
    temp: "சராசரி வெப்பநிலை (°C)",
    rain: "மழை அளவு (mm)",
    predict: "விளைச்சல் கணிக்க",
    clear: "அழி",
    predicted: "கணிக்கப்பட்ட விளைச்சல்",
    confidence: "நம்பகத்தன்மை",
    suggestionTitle: "AI பரிந்துரை",
    suggestion:
      "உங்கள் மண் மற்றும் வானிலை அடிப்படையில், நைட்ரஜனை 10% அதிகரித்து 3வது வாரத்தில் தண்ணீர் பராமரிக்கவும்.",
    history: "கணிப்பு வரலாறு",
  },
};

const YieldPrediction = () => {
  const router = useRouter();
  const [lang, setLang] = useState("en");
  const t = translations[lang];

  const [crop, setCrop] = useState("");
  const [location, setLocation] = useState("");
  const [season, setSeason] = useState("");
  const [soilType, setSoilType] = useState("");
  const [temperature, setTemperature] = useState("");
  const [rainfall, setRainfall] = useState("");
  const [predictedYield, setPredictedYield] = useState(null);
  const [history, setHistory] = useState([]);

  const handlePrediction = () => {
    if (!crop || !location || !season) {
      Alert.alert("Missing Fields", "Please fill in crop, location, and season.");
      return;
    }

    const yieldValue = (Math.random() * 4 + 3).toFixed(2);
    const confidence = Math.floor(Math.random() * 20 + 80);

    const result = {
      crop,
      location,
      season,
      yieldValue,
      confidence,
      date: new Date().toLocaleDateString(),
    };

    setPredictedYield(result);
    setHistory([result, ...history]);
  };

  const handleClear = () => {
    setCrop("");
    setLocation("");
    setSeason("");
    setSoilType("");
    setTemperature("");
    setRainfall("");
    setPredictedYield(null);
  };

  return (
    <ScrollView style={styles.container}>
      {/* 🌾 Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push("/screens/home")}>
          <Ionicons name="arrow-back" size={26} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>{t.title}</Text>

        <TouchableOpacity
          style={styles.langBtn}
          onPress={() => setLang(lang === "en" ? "ta" : "en")}
        >
          <Ionicons name="language-outline" size={20} color="#fff" />
          <Text style={styles.langText}>{lang === "en" ? "தமிழ்" : "EN"}</Text>
        </TouchableOpacity>
      </View>

      {/* 🧾 Input Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t.inputTitle}</Text>

        <TextInput placeholder={t.crop} style={styles.input} value={crop} onChangeText={setCrop} />
        <TextInput placeholder={t.location} style={styles.input} value={location} onChangeText={setLocation} />
        <TextInput placeholder={t.season} style={styles.input} value={season} onChangeText={setSeason} />
        <TextInput placeholder={t.soilType} style={styles.input} value={soilType} onChangeText={setSoilType} />
        <TextInput placeholder={t.temp} style={styles.input} keyboardType="numeric" value={temperature} onChangeText={setTemperature} />
        <TextInput placeholder={t.rain} style={styles.input} keyboardType="numeric" value={rainfall} onChangeText={setRainfall} />

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.predictBtn} onPress={handlePrediction}>
            <Ionicons name="analytics-outline" size={20} color="#fff" />
            <Text style={styles.predictBtnText}>{t.predict}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.clearBtn} onPress={handleClear}>
            <Ionicons name="refresh-outline" size={20} color="#333" />
            <Text style={styles.clearBtnText}>{t.clear}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 📊 Prediction Result */}
      {predictedYield && (
        <View style={styles.resultCard}>
          <Text style={styles.resultTitle}>{t.predicted}</Text>
          <Text style={styles.resultCrop}>{predictedYield.crop}</Text>
          <Text style={styles.resultValue}>🌾 {predictedYield.yieldValue} tons/hectare</Text>
          <Text style={styles.resultConfidence}>
            {t.confidence}: {predictedYield.confidence}%
          </Text>
          <Text style={styles.resultMeta}>
            {predictedYield.location} | {predictedYield.season}
          </Text>

          {/* Responsive Chart */}
          <View style={styles.chartWrapper}>
            <LineChart
              data={{
                labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
                datasets: [
                  {
                    data: [3, 4.5, 6, parseFloat(predictedYield.yieldValue)],
                  },
                ],
              }}
              width={screenWidth * 0.9}
              height={220}
              chartConfig={{
                backgroundColor: "#2E7D32",
                backgroundGradientFrom: "#43A047",
                backgroundGradientTo: "#1B5E20",
                decimalPlaces: 2,
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                labelColor: () => "#fff",
                propsForDots: { r: "4", strokeWidth: "2", stroke: "#fff" },
                propsForBackgroundLines: {
                  strokeDasharray: "",
                  stroke: "rgba(255,255,255,0.2)",
                },
              }}
              bezier
              style={styles.chart}
            />
          </View>

          <TouchableOpacity
            style={styles.tipsBtn}
            onPress={() => Alert.alert(t.suggestionTitle, t.suggestion)}
          >
            <Ionicons name="bulb-outline" size={20} color="#fff" />
            <Text style={styles.tipsBtnText}>{t.suggestionTitle}</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* 🕒 History Section */}
      {history.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t.history}</Text>
          {history.map((item, index) => (
            <View key={index} style={styles.historyCard}>
              <Text style={styles.historyCrop}>{item.crop}</Text>
              <Text style={styles.historyMeta}>
                {item.location} | {item.season}
              </Text>
              <Text style={styles.historyYield}>
                🌾 {item.yieldValue} tons/ha | {item.confidence}%
              </Text>
              <Text style={styles.historyDate}>{item.date}</Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

export default YieldPrediction;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAF9",
  },
  header: {
    backgroundColor: "#1B5E20",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 18,
    paddingHorizontal: 18,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 6,
  },
  headerText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
  },
  langBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2E7D32",
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  langText: {
    color: "#fff",
    fontWeight: "600",
    marginLeft: 5,
  },
  section: {
    padding: 20,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1b5e20",
    marginBottom: 10,
  },
  input: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    fontSize: 15,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  predictBtn: {
    flexDirection: "row",
    backgroundColor: "#388E3C",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    flex: 0.48,
    justifyContent: "center",
  },
  predictBtnText: {
    color: "#fff",
    marginLeft: 6,
    fontWeight: "600",
    fontSize: 16,
  },
  clearBtn: {
    flexDirection: "row",
    backgroundColor: "#E8F5E9",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    flex: 0.48,
    justifyContent: "center",
  },
  clearBtnText: {
    color: "#333",
    marginLeft: 6,
    fontWeight: "600",
    fontSize: 16,
  },
  resultCard: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginTop: 20,
    borderRadius: 18,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
    overflow: "hidden",
    alignItems: "flex-start", // 👈 aligns to left
    width: "90%",
    alignSelf: "center",
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2E7D32",
    marginBottom: 6,
  },
  resultCrop: {
    fontSize: 17,
    fontWeight: "600",
    marginBottom: 4,
    color: "#444",
  },
  resultValue: {
    fontSize: 21,
    fontWeight: "700",
    color: "#388E3C",
    marginVertical: 5,
  },
  resultConfidence: {
    color: "#666",
    marginBottom: 6,
  },
  resultMeta: {
    color: "#999",
    fontSize: 13,
    marginBottom: 10,
  },
  chartWrapper: {
  width: "100%",
  alignItems: "center",
  justifyContent: "center",
  overflow: "hidden",
  marginTop: 10,
  marginBottom: 15,
},
chart: {
  borderRadius: 16,
  marginVertical: 10,
  width: "100%",
  maxWidth: 400, // ✅ same width limit as AI suggestion button
  alignSelf: "center", // ✅ centers chart perfectly
},

tipsBtn: {
  flexDirection: "row",
  backgroundColor: "#1B5E20",
  paddingVertical: 12,
  borderRadius: 10,
  alignItems: "center",
  justifyContent: "center",
  marginTop: 12,
  alignSelf: "center", // stays inside the container
  width: "100%", // responsive full width for mobile
  maxWidth: 400,
},

  tipsBtnText: {
    color: "#fff",
    marginLeft: 6,
    fontWeight: "600",
  },
  historyCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: "#4CAF50",
  },
  historyCrop: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2E7D32",
  },
  historyMeta: {
    color: "#666",
    fontSize: 13,
  },
  historyYield: {
    color: "#388E3C",
    fontWeight: "600",
    marginVertical: 2,
  },
  historyDate: {
    fontSize: 12,
    color: "#aaa",
  },
});
