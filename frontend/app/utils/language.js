// app/utils/language.js

let currentLang = "en"; // default language

export const translations = {
  en: {
    back: "Back",
    aboutAppHeading: "About Smart Agri App",
    overview: "Overview",
    keyFeatures: "Key Features",
    howItHelps: "How It Helps Farmers",
    technology: "Technology Behind the App",
    ourVision: "Our Vision",
    meetTeam: "Meet Our Team",
    overviewText1: "The Smart Agri App is an AI-powered, mobile-first platform designed to empower farmers with data-driven agricultural guidance. It addresses critical challenges such as low crop yield, price fluctuations, and lack of access to expert advice by providing real-time, personalized, and actionable recommendations.",
    overviewText2: "Our goal is to make modern farming accessible, efficient, and profitable—even in regions with limited connectivity or technical literacy.",
    feature1: "• AI-Based Crop Recommendations",
    feature2: "• Plant Health & Disease Detection",
    feature3: "• Market Price Insights",
    feature4: "• Offline Mode & Multilingual Support",
    feature5: "• Sustainable Farming Recommendations",
    help1: "• Increase Income by choosing profitable crops",
    help2: "• Reduce Risks with early disease detection",
    help3: "• Save Time & Effort with AI-assisted guidance",
    help4: "• Promote Sustainability for long-term productivity",
    tech1: "• Machine Learning Models for crop prediction",
    tech2: "• Computer Vision for disease detection",
    tech3: "• APIs & IoT Integration for real-time data",
    tech4: "• Offline Storage & Multilingual NLP for accessibility"
  },
  hi: {
    back: "वापस",
    aboutAppHeading: "स्मार्ट एग्री ऐप के बारे में",
    overview: "सारांश",
    keyFeatures: "मुख्य विशेषताएं",
    howItHelps: "किसानों के लिए कैसे मदद करता है",
    technology: "ऐप के पीछे की तकनीक",
    ourVision: "हमारा दृष्टिकोण",
    meetTeam: "हमारी टीम से मिलें",
    overviewText1: "स्मार्ट एग्री ऐप एक एआई-संचालित मोबाइल-पहले प्लेटफ़ॉर्म है, जिसे किसानों को डेटा-आधारित कृषि मार्गदर्शन प्रदान करने के लिए डिज़ाइन किया गया है। यह कम फसल उत्पादन, मूल्य अस्थिरता और विशेषज्ञ सलाह की कमी जैसी समस्याओं को हल करता है।",
    overviewText2: "हमारा लक्ष्य आधुनिक खेती को सभी के लिए सुलभ, प्रभावी और लाभकारी बनाना है, यहां तक कि उन क्षेत्रों में भी जहाँ कनेक्टिविटी या तकनीकी ज्ञान सीमित है।",
    feature1: "• एआई-आधारित फसल सिफारिशें",
    feature2: "• पौधों की स्वास्थ्य और रोग पहचान",
    feature3: "• बाजार मूल्य जानकारी",
    feature4: "• ऑफ़लाइन मोड और बहुभाषी समर्थन",
    feature5: "• सतत खेती की सिफारिशें",
    help1: "• लाभकारी फसलें चुनकर आय बढ़ाएँ",
    help2: "• जल्दी रोग पहचान से जोखिम कम करें",
    help3: "• एआई-सहायता मार्गदर्शन से समय और मेहनत बचाएँ",
    help4: "• दीर्घकालिक उत्पादकता के लिए स्थिरता बढ़ाएँ",
    tech1: "• फसल भविष्यवाणी के लिए मशीन लर्निंग मॉडल",
    tech2: "• रोग पहचान के लिए कंप्यूटर विज़न",
    tech3: "• वास्तविक समय डेटा के लिए APIs और IoT एकीकरण",
    tech4: "• ऑफ़लाइन संग्रहण और बहुभाषी NLP"
  },
  ta: {
    back: "பின் செல்ல",
    aboutAppHeading: "ஸ்மார்ட் அக்\u200cரி செயலியைப் பற்றி",
    overview: "கண்ணோட்டம்",
    keyFeatures: "முக்கிய அம்சங்கள்",
    howItHelps: "விவசாயிகளுக்கு உதவும் விதம்",
    technology: "செயலியின் பின்னணி தொழில்நுட்பம்",
    ourVision: "எங்கள் நோக்கு",
    meetTeam: "எங்கள் குழுவை சந்திக்கவும்",
    overviewText1: "ஸ்மார்ட் அக்\u200cரி செயலி ஒரு AI இயக்கிய மொபைல் முதன்மை பிளாட்ஃபாரமாகும், இது விவசாயிகளுக்கு தரவுத்தடிப்பான வழிகாட்டலை வழங்க வடிவமைக்கப்பட்டுள்ளது. குறைந்த பயிர் உற்பத்தி, விலை மாறுபாடு மற்றும் நிபுணர் ஆலோசனை இல்லை போன்ற சவால்களை இது தீர்க்கிறது.",
    overviewText2: "எங்கள் நோக்கம் தொழில்நுட்ப அறிவு குறைந்த பகுதிகளிலும் விவசாயத்தை அனைவருக்கும் அணுகக்கூடிய, திறம்பட செயல்படும் மற்றும் லாபகரமானதாக மாற்றுவதாகும்.",
    feature1: "• AI-அடிப்படையிலான பயிர் பரிந்துரைகள்",
    feature2: "• செடி ஆரோக்கியம் & நோய் கண்டறிதல்",
    feature3: "• சந்தை விலை தகவல்கள்",
    feature4: "• ஆஃப்லைன் முறை & பல மொழி ஆதரவு",
    feature5: "• நிலையான விவசாய பரிந்துரைகள்",
    help1: "• லாபகரமான பயிர்களைத் தேர்ந்தெடுத்து வருமானத்தை அதிகரிக்கவும்",
    help2: "• நோய் கண்டறிதல் மூலம் அபாயங்களை குறைக்கவும்",
    help3: "• AI-உதவி வழிகாட்டலால் நேரம் & முயற்சியைச் சேமிக்கவும்",
    help4: "• நீண்ட கால உற்பத்திக்கான நிலைத்தன்மையை மேம்படுத்தவும்",
    tech1: "• பயிர் கணிப்புக்கு மெஷின் லேர்னிங் மாதிரிகள்",
    tech2: "• நோய் கண்டறிதலுக்கான கணினி பார்வை",
    tech3: "• நேரடி தரவுக்கான APIs & IoT ஒருங்கிணைப்பு",
    tech4: "• ஆஃப்லைன் சேமிப்பு & பல மொழி NLP"
  }
};

// helper to get translation
export const t = (key) => translations[currentLang][key] || key;

// helper to change language
export const setLanguage = (lang) => {
  currentLang = lang;
};
