import React, { useState, useEffect } from "react";
import {
View,
Text,
TouchableOpacity,
ScrollView,
TextInput,
Alert,
StyleSheet,
Platform,
BackHandler as RNBackHandler,
} from "react-native";
import { useRouter, usePathname } from "expo-router";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";

// 🌍 Translations
const translations = {
en: {
myCrops: "My Crops",
pastCrops: " Past Crops",
presentCrops: " Present Crops",
addPastCrop: "Add Past Crop",
addPresentCrop: "Add Present Crop",
backToHome: "← Back to Home",
backToMenu: "← Back to Menu",
cropName: "Crop Name",
sowing: "Sowing Date (YYYY-MM-DD)",
harvest: "Harvest Date (YYYY-MM-DD)",
invested: "Invested Amount (₹)",
landArea: "Land Area",
sold: "Crops Sold (Yes/No)",
soldPrice: "Sold Price (₹)",
profit: "Profit (₹)",
disease: "Disease Attack",
saveCrop: "Save Crop",
numbersOnly: "Numbers only",
required: "Required",
useFormat: "Use YYYY-MM-DD format",
emptyField: "Please fill this field",
cropSaved: "✅ Crop Saved",
},
hi: {
myCrops: " मेरी फसलें",
pastCrops: "पिछली फसलें",
presentCrops: " वर्तमान फसलें",
addPastCrop: "पिछली फसल जोड़ें",
addPresentCrop: "वर्तमान फसल जोड़ें",
backToHome: "← होम पर वापस जाएं",
backToMenu: "← मेन्यू पर वापस जाएं",
cropName: "फसल का नाम",
sowing: "बुवाई की तारीख (YYYY-MM-DD)",
harvest: "कटाई की तारीख (YYYY-MM-DD)",
invested: "लगाई गई राशि (₹)",
landArea: "जमीन का क्षेत्रफल",
sold: "फसल बेची गई? (हाँ/नहीं)",
soldPrice: "बेची गई कीमत (₹)",
profit: "लाभ (₹)",
disease: "बीमारी की जानकारी",
saveCrop: "फसल सहेजें",
numbersOnly: "केवल अंक",
required: "आवश्यक",
useFormat: "YYYY-MM-DD प्रारूप का उपयोग करें",
emptyField: "कृपया यह फ़ील्ड भरें",
cropSaved: "✅ फसल सहेज ली गई",
},
ta: {
myCrops: "என் பயிர்கள்",
pastCrops: " கடந்த பயிர்கள்",
presentCrops: " தற்போதைய பயிர்கள்",
addPastCrop: "கடந்த பயிர் சேர்க்கவும்",
addPresentCrop: "தற்போதைய பயிர் சேர்க்கவும்",
backToHome: "← ஹோமுக்கு திரும்பு",
backToMenu: "← மெனுவுக்கு திரும்பு",
cropName: "பயிர் பெயர்",
sowing: "தைமை தேதி (YYYY-MM-DD)",
harvest: "கிடைமுதல் தேதி (YYYY-MM-DD)",
invested: "முதலீட்டு தொகை (₹)",
landArea: "நிலப்பரப்பு",
sold: "பயிர் விற்றீர்களா? (ஆம்/இல்லை)",
soldPrice: "விற்பனை விலை (₹)",
profit: "நிகர லாபம் (₹)",
disease: "நோய் தாக்கம்",
saveCrop: "பயிர் சேமிக்கவும்",
numbersOnly: "எண்கள் மட்டும்",
required: "தேவை",
useFormat: "YYYY-MM-DD வடிவம் பயன்படுத்தவும்",
emptyField: "தயவு செய்து இந்த இடத்தை நிரப்பவும்",
cropSaved: "✅ பயிர் சேமிக்கப்பட்டது",
},
};

export default function MyCrops() {
const router = useRouter();
const pathname = usePathname();
const [language, setLanguage] = useState("en");
const t = translations[language];

const [currentPage, setCurrentPage] = useState("menu"); // "menu" | "past" | "present"
const [showForm, setShowForm] = useState(false);
const [formData, setFormData] = useState({});
const [errors, setErrors] = useState({});
const [pastCrops, setPastCrops] = useState([]);
const [presentCrops, setPresentCrops] = useState([]);

// Navigate to Home
const navigateHome = () => router.replace("/screens/home");

// Hardware Back Handler (Android)
useEffect(() => {
if (Platform.OS === "web") return;
const backAction = () => {
navigateHome();
return true;
};
const subscription = RNBackHandler.addEventListener(
"hardwareBackPress",
backAction
);
return () => subscription.remove();
}, []);

// --- form validation (same as before, unchanged) ---
const validateForm = (type) => {
let valid = true;
let newErrors = {};
if (!formData.cropName?.trim()) {
newErrors.cropName = t.required;
valid = false;
}
if (!/^\d{4}-\d{2}-\d{2}$/.test(formData.sowing || "")) {
newErrors.sowing = t.useFormat;
valid = false;
}
if (!/^\d{4}-\d{2}-\d{2}$/.test(formData.harvest || "")) {
newErrors.harvest = t.useFormat;
valid = false;
}
if (!/^\d+$/.test(formData.invested || "")) {
newErrors.invested = t.numbersOnly;
valid = false;
}
if (!formData.landArea?.trim()) {
newErrors.landArea = t.required;
valid = false;
}
if (type === "past") {
if (!formData.sold) {
newErrors.sold = t.required;
valid = false;
}
if (formData.sold === "Yes") {
if (!/^\d+$/.test(formData.soldPrice || "")) {
newErrors.soldPrice = t.numbersOnly;
valid = false;
}
if (!/^\d+$/.test(formData.profit || "")) {
newErrors.profit = t.numbersOnly;
valid = false;
}
}
if (!formData.disease?.trim()) {
newErrors.disease = t.required;
valid = false;
}
}
setErrors(newErrors);
return valid;
};

const handleSubmit = (type) => {
if (!validateForm(type)) return;
if (type === "past") setPastCrops([...pastCrops, formData]);
else
setPresentCrops([
...presentCrops,
{
...formData,
domesticPrice: "₹3,200 / tonne",
exportPrice: "₹3,800 / tonne",
fertilizers: "Compost, Superphosphate, Potash",
},
]);
setFormData({});
setShowForm(false);
Alert.alert(t.cropSaved, `${formData.cropName} added!`);
};

// --- UI building blocks ---
const renderForm = (type) => (
  <View style={styles.form}>
    {/* Crop Name */}
    <TextInput
      style={styles.input}
      placeholder={t.cropName}
      value={formData.cropName || ""}
      onChangeText={(txt) => setFormData({ ...formData, cropName: txt })}
    />
    {errors.cropName && <Text style={styles.error}>{errors.cropName}</Text>}

    {/* Sowing Date */}
    <TextInput
      style={styles.input}
      placeholder={t.sowing}
      value={formData.sowing || ""}
      onChangeText={(txt) => setFormData({ ...formData, sowing: txt })}
    />
    {errors.sowing && <Text style={styles.error}>{errors.sowing}</Text>}

    {/* Harvest Date */}
    <TextInput
      style={styles.input}
      placeholder={t.harvest}
      value={formData.harvest || ""}
      onChangeText={(txt) => setFormData({ ...formData, harvest: txt })}
    />
    {errors.harvest && <Text style={styles.error}>{errors.harvest}</Text>}

    {/* Invested Amount */}
    <TextInput
      style={styles.input}
      placeholder={t.invested}
      keyboardType="numeric"
      value={formData.invested || ""}
      onChangeText={(txt) => setFormData({ ...formData, invested: txt })}
    />
    {errors.invested && <Text style={styles.error}>{errors.invested}</Text>}

    {/* Land Area */}
    <TextInput
      style={styles.input}
      placeholder={t.landArea}
      value={formData.landArea || ""}
      onChangeText={(txt) => setFormData({ ...formData, landArea: txt })}
    />
    {errors.landArea && <Text style={styles.error}>{errors.landArea}</Text>}

    {type === "past" && (
      <>
        {/* Sold (Yes/No) */}
        <TextInput
          style={styles.input}
          placeholder={t.sold}
          value={formData.sold || ""}
          onChangeText={(txt) => setFormData({ ...formData, sold: txt })}
        />
        {errors.sold && <Text style={styles.error}>{errors.sold}</Text>}

        {formData.sold === "Yes" && (
          <>
            {/* Sold Price */}
            <TextInput
              style={styles.input}
              placeholder={t.soldPrice}
              keyboardType="numeric"
              value={formData.soldPrice || ""}
              onChangeText={(txt) =>
                setFormData({ ...formData, soldPrice: txt })
              }
            />
            {errors.soldPrice && (
              <Text style={styles.error}>{errors.soldPrice}</Text>
            )}

            {/* Profit */}
            <TextInput
              style={styles.input}
              placeholder={t.profit}
              keyboardType="numeric"
              value={formData.profit || ""}
              onChangeText={(txt) =>
                setFormData({ ...formData, profit: txt })
              }
            />
            {errors.profit && (
              <Text style={styles.error}>{errors.profit}</Text>
            )}
          </>
        )}

        {/* Disease */}
        <TextInput
          style={styles.input}
          placeholder={t.disease}
          value={formData.disease || ""}
          onChangeText={(txt) => setFormData({ ...formData, disease: txt })}
        />
        {errors.disease && <Text style={styles.error}>{errors.disease}</Text>}
      </>
    )}

    {/* Save Button */}
    <TouchableOpacity
      style={styles.submitButton}
      onPress={() => handleSubmit(type)}
    >
      <Text style={styles.submitText}>{t.saveCrop}</Text>
    </TouchableOpacity>
  </View>
);


const renderCrops = (type) => {
  const list = type === "past" ? pastCrops : presentCrops;
  if (list.length === 0)
    return (
      <Text style={styles.subHeader}>
        {type === "past" ? t.pastCrops : t.presentCrops} empty
      </Text>
    );

  return list.map((crop, i) => (
    <View key={i} style={styles.card}>
      <Text style={styles.field}>{t.cropName}: {crop.cropName}</Text>
      <Text style={styles.field}>{t.sowing}: {crop.sowing}</Text>
      <Text style={styles.field}>{t.harvest}: {crop.harvest}</Text>
      <Text style={styles.field}>{t.invested}: {crop.invested}</Text>
      <Text style={styles.field}>{t.landArea}: {crop.landArea}</Text>

      {type === "past" ? (
        <>
          <Text style={styles.field}>{t.sold}: {crop.sold}</Text>
          {crop.sold === "Yes" && (
            <>
              <Text style={styles.field}>{t.soldPrice}: {crop.soldPrice}</Text>
              <Text style={styles.field}>{t.profit}: {crop.profit}</Text>
            </>
          )}
          <Text style={styles.field}>{t.disease}: {crop.disease}</Text>
        </>
      ) : (
        <>
          <Text style={styles.field}>Domestic Price: {crop.domesticPrice}</Text>
          <Text style={styles.field}>Export Price: {crop.exportPrice}</Text>
          <Text style={styles.field}>Fertilizers: {crop.fertilizers}</Text>
        </>
      )}
    </View>
  ));
};


// --- Layout ---
return ( <View style={styles.page}>
{/* ✅ Top Bar same as Home */} <View style={styles.topBar}> <TouchableOpacity onPress={navigateHome}> <MaterialIcons name="arrow-back" size={24} color="#166534" /> </TouchableOpacity> <Text style={styles.topTitle}>{t.myCrops}</Text>
<TouchableOpacity
onPress={() =>
setLanguage(language === "en" ? "hi" : language === "hi" ? "ta" : "en")
}
> <MaterialIcons name="language" size={24} color="#166534" /> </TouchableOpacity> </View>

  {/* ✅ Content */}
  <ScrollView style={styles.content}>
    {currentPage === "menu" ? (
      <>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => setCurrentPage("past")}
        >
          <Text style={styles.buttonText}>{t.pastCrops}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.menuButton, { backgroundColor: "#2563eb" }]}
          onPress={() => setCurrentPage("present")}
        >
          <Text style={styles.buttonText}>{t.presentCrops}</Text>
        </TouchableOpacity>
      </>
    ) : (
      <>
        <TouchableOpacity
          onPress={() => setCurrentPage("menu")}
          style={{ marginBottom: 10 }}
        >
          <Text style={{ color: "#2563eb" }}>{t.backToMenu}</Text>
        </TouchableOpacity>
        <Text style={styles.header}>
          {currentPage === "past" ? t.pastCrops : t.presentCrops}
        </Text>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => setShowForm(true)}
        >
          <Text style={styles.actionText}>
            {currentPage === "past" ? t.addPastCrop : t.addPresentCrop}
          </Text>
        </TouchableOpacity>
        {showForm && renderForm(currentPage)}
        {renderCrops(currentPage)}
      </>
    )}
  </ScrollView>

  {/* ✅ Bottom Navigation */}
  <View style={styles.bottomNav}>
    <TouchableOpacity onPress={() => router.push("/screens/home")}>
      <Ionicons
        name="home"
        size={22}
        color={pathname === "/screens/home" ? "#047857" : "#666"}
      />
      <Text
        style={[
          styles.navText,
          pathname === "/screens/home" && {
            color: "#047857",
            fontWeight: "bold",
          },
        ]}
      >
        Home
      </Text>
    </TouchableOpacity>
    <TouchableOpacity onPress={() => router.push("/screens/MyCrops")}>
      <Ionicons name="leaf" size={22} color="#666" />
      <Text
        style={[
          styles.navText,
          pathname === "/screens/MyCrops" && {
            color: "#047857",
            fontWeight: "bold",
          },
        ]}
      >
        {t.myCrops}
      </Text>
    </TouchableOpacity>
    <TouchableOpacity onPress={() => router.push("/screens/ChatBot")}>
      <Ionicons
        name="chatbubble-ellipses"
        size={24}
        color={pathname === "/screens/ChatBot" ? "#047857" : "#666"}
      />
      <Text
        style={[
          styles.navText,
          pathname === "/screens/ChatBot" && {
            color: "#047857",
            fontWeight: "bold",
          },
        ]}
      >
        AI Chatbot
      </Text>
    </TouchableOpacity>
    <TouchableOpacity onPress={() => router.push("/screens/Community")}>
      <Ionicons
        name="people"
        size={22}
        color={pathname === "/screens/Community" ? "#047857" : "#666"}
      />
      <Text
        style={[
          styles.navText,
          pathname === "/screens/Community" && {
            color: "#047857",
            fontWeight: "bold",
          },
        ]}
      >
        Community
      </Text>
    </TouchableOpacity>
    <TouchableOpacity onPress={() => router.push("/screens/profile")}>
      <Ionicons
        name="person"
        size={22}
        color={pathname === "/screens/profile" ? "#047857" : "#666"}
      />
      <Text
        style={[
          styles.navText,
          pathname === "/screens/profile" && {
            color: "#047857",
            fontWeight: "bold",
          },
        ]}
      >
        Profile
      </Text>
    </TouchableOpacity>
  </View>
</View>
);
}

const styles = StyleSheet.create({
page: { flex: 1, backgroundColor: "#f9fafb" },
topBar: {
flexDirection: "row",
justifyContent: "space-between",
alignItems: "center",
padding: 12,
backgroundColor: "#fff",
borderBottomWidth: 1,
borderBottomColor: "#ddd",
},
topTitle: { fontSize: 20, fontWeight: "bold", color: "#166534" },
content: { flex: 1, padding: 16 },
header: {
fontSize: 22,
fontWeight: "bold",
marginVertical: 12,
color: "#166534",
},
menuButton: {
width: "100%",
backgroundColor: "#10c31cff",
padding: 18,
borderRadius: 12,
alignItems: "center",
marginVertical: 10,
},
buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
input: {
borderWidth: 1,
borderColor: "#d1d5db",
borderRadius: 8,
padding: 10,
marginBottom: 8,
},
error: { color: "red", fontSize: 12, marginBottom: 8 },
form: {
backgroundColor: "white",
padding: 15,
borderRadius: 12,
marginBottom: 15,
elevation: 2,
},
submitButton: {
backgroundColor: "#10c31cff",
padding: 12,
borderRadius: 10,
alignItems: "center",
},
submitText: { color: "#fff", fontWeight: "600", fontSize: 16 },
actionButton: {
padding: 16,
borderRadius: 10,
alignItems: "center",
backgroundColor: "#10c31cff",
marginBottom: 12,
},
actionText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
card: {
backgroundColor: "white",
padding: 15,
borderRadius: 12,
marginBottom: 12,
elevation: 2,
},
field: { fontSize: 16, marginBottom: 5 },
subHeader: {
textAlign: "center",
fontSize: 16,
color: "#4a5777ff",
marginTop: 20,
},
bottomNav: {
flexDirection: "row",
justifyContent: "space-around",
alignItems: "center",
paddingVertical: 8,
borderTopWidth: 1,
borderTopColor: "#ddd",
backgroundColor: "#fff",
},
navText: {
fontSize: 12,
color: "#444",
marginTop: 2,
textAlign: "center",
},
});

