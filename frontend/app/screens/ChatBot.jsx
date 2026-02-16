/* ChatBot.js */
import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
  KeyboardAvoidingView,
  Alert,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { chatWithBot } from "../api"; // Import the chat API function

const translations = {
  en: {
    chatbotTitle: "SmartAgri AI",
    welcomeMessage: "Welcome to SmartAgri AI Chatbot !",
    inputPlaceholder: "Ask me about crops, weather, soil, and more...",
    faqs: [
      { question: "Best crop for my soil?", answer: "Use Soil Health Analysis for crop recommendations." },
      { question: "Weather today?", answer: "Check the Weather section for live updates." },
      { question: "Detect crop disease?", answer: "Use Disease Detection to capture plant images." },
      { question: "Top crops this season?", answer: "Top Crops card shows seasonal high-performing crops." },
      { question: "Improve soil fertility?", answer: "Follow recommended fertilizers or organic amendments." },
      { question: "Join farming community?", answer: "Connect with other farmers in the Community section." },
      { question: "Irrigation tips?", answer: "Check irrigation guidelines based on your soil type and crop." },
      { question: "Organic farming methods?", answer: "Follow eco-friendly techniques to maintain soil health." },
      { question: "Pest control suggestions?", answer: "Use Pest Management techniques suitable for your crop." },
      { question: "Fertilizer recommendation?", answer: "Perform Soil Health Analysis for the correct fertilizer." },
      { question: "Crop rotation tips?", answer: "Rotate crops to maintain soil fertility and prevent disease." },
      { question: "High yield techniques?", answer: "Follow recommended sowing, spacing, and harvesting methods." },
      { question: "Sustainable farming practices?", answer: "Use crop residues, composting, and water-saving methods." },
      { question: "Market price info?", answer: "Check Market section for latest crop prices in your area." },
      { question: "Government schemes for farmers?", answer: "Explore Schemes section for subsidies and assistance." },
      { question: "How to store harvested crops?", answer: "Follow proper drying and storage techniques." },
      { question: "Planting calendar?", answer: "Use the Crop Calendar to plan sowing and harvesting dates." },
      { question: "Use of organic manure?", answer: "Apply compost or vermicompost as per soil requirements." },
      { question: "Soil pH testing?", answer: "Use Soil Health Analysis to measure soil pH levels." },
      { question: "Which seeds to buy?", answer: "Select high-quality certified seeds for better yields." },
      { question: "I want to learn new techniques?", answer: "Check the Tutorials section for modern farming practices." },
      { question: "How to prevent soil erosion?", answer: "Use contour farming and mulching to prevent erosion." },
      { question: "Climate change effects?", answer: "Plan crops and irrigation according to local climate trends." },
      { question: "Farm equipment guidance?", answer: "Refer to Equipment section for machine selection and usage." },
      { question: "Harvesting tips?", answer: "Follow recommended harvesting time for best crop quality." },
    ],
    sidebar: {
      Home: "Home",
      MyCrops: "MyCrops",
      AIChatbot: "AIChatbot",
      Community: "Community",
      Profile: "Profile",
    },
    sending: "Sending...",
    error: "Sorry, I couldn't process your request. Please try again.",
  },
  hi: {
    chatbotTitle: "स्मार्ट एग्री AI",
    welcomeMessage: "स्मार्ट एग्री AI चैटबोट में आपका स्वागत है!",
    inputPlaceholder: "कृषि, मौसम, मिट्टी आदि से संबंधित प्रश्न पूछें...",
    faqs: [
      { question: "मेरे मिट्टी के लिए सबसे अच्छी फसल?", answer: "Soil Health Analysis का उपयोग करें।" },
      { question: "आज का मौसम?", answer: "Weather सेक्शन में लाइव अपडेट देखें।" },
      { question: "फसल रोग पहचान?", answer: "Disease Detection का उपयोग करें।" },
      { question: "इस मौसम की शीर्ष फसलें?", answer: "Top Crops कार्ड उच्च प्रदर्शन वाली फसलें दिखाता है।" },
      { question: "मिट्टी की उर्वरता सुधारें?", answer: "अनुशंसित जैविक संशोधन और उर्वरक का पालन करें।" },
      { question: "कृषक समुदाय में शामिल हों?", answer: "Community सेक्शन में जुड़ें।" },
      { question: "सिंचाई सुझाव?", answer: "मिट्टी और फसल के अनुसार सिंचाई करें।" },
      { question: "जैविक खेती विधियाँ?", answer: "पर्यावरण-अनुकूल तकनीक अपनाएँ।" },
      { question: "कीट नियंत्रण?", answer: "Pest Management तकनीकें अपनाएँ।" },
      { question: "उर्वरक सुझाव?", answer: "Soil Health Analysis से सही उर्वरक चुनें।" },
      { question: "फसल चक्र सलाह?", answer: "फसलों को घुमाकर मिट्टी की उर्वरता बनाए रखें।" },
      { question: "उच्च उपज तकनीकें?", answer: "सही बुवाई, दूरी और कटाई विधियाँ अपनाएँ।" },
      { question: "सतत खेती?", answer: "Crop residues, compost और water-saving तकनीकें अपनाएँ।" },
      { question: "बाजार मूल्य जानकारी?", answer: "Market सेक्शन में ताज़ा कीमतें देखें।" },
      { question: "सरकारी योजनाएं?", answer: "Schemes सेक्शन में सब्सिडी और सहायता देखें।" },
      { question: "फसल संग्रह कैसे करें?", answer: "सही सुखाने और भंडारण तकनीकें अपनाएँ।" },
      { question: "बुवाई और कटाई कैलेंडर?", answer: "Crop Calendar से तारीखें प्लान करें।" },
      { question: "जैविक खाद का उपयोग?", answer: "मिट्टी अनुसार compost या vermicompost लगाएँ।" },
      { question: "मिट्टी pH जांच?", answer: "Soil Health Analysis से pH जांचें।" },
      { question: "बीज कौन से खरीदें?", answer: "सर्टिफाइड उच्च गुणवत्ता बीज चुनें।" },
      { question: "नई तकनीक सीखना?", answer: "Tutorials सेक्शन देखें।" },
      { question: "मिट्टी कटाव रोकना?", answer: "Contour farming और mulching अपनाएँ।" },
      { question: "जलवायु परिवर्तन प्रभाव?", answer: "स्थानीय जलवायु अनुसार फसल और सिंचाई तय करें।" },
      { question: "कृषि उपकरण मार्गदर्शन?", answer: "Equipment सेक्शन देखें।" },
      { question: "कटाई सुझाव?", answer: "सही समय पर कटाई करें।" },
    ],
    sidebar: {
      Home: "मुख्य पृष्ठ",
      MyCrops: "मेरी फसलें",
      AIChatbot: "AI चैटबोट",
      Community: "समुदाय",
      Profile: "प्रोफ़ाइल",
    },
    sending: "भेजा जा रहा है...",
    error: "क्षमा करें, मैं आपके अनुरोध को संसाधित नहीं कर सका। कृपया पुन: प्रयास करें।",
  },
  ta: {
    chatbotTitle: "ஸ்மார்ட் அகரி AI",
    inputPlaceholder: "பயிர்கள், வானிலை, மண் மற்றும் மற்றவைகளைப் பற்றி கேளுங்கள்...",
    welcomeMessage: "ஸ்மார்ட் அகரி AI சோட்பாட் வரவேற்கிறது!",
    faqs: [
      { question: "என் மண்ணிற்கு சிறந்த பயிர் எது?", answer: "Soil Health Analysis பயன்படுத்தி பரிந்துரைகளை பெறுங்கள்." },
      { question: "இன்றைய வானிலை?", answer: "Weather பிரிவில் நேரடி வானிலை பார்க்கவும்." },
      { question: "பயிர் நோய்களை கண்டறிய?", answer: "Disease Detection பயன்படுத்தி தாவர படங்களை எடுத்து நோய்களை கண்டறியவும்." },
      { question: "இந்த பருவத்தின் சிறந்த பயிர்கள்?", answer: "Top Crops கார்டு பருவப்போக்கில் சிறந்த பயிர்களை காட்டுகிறது." },
      { question: "மண்ணின் உற்பத்தி திறனை மேம்படுத்த எப்படி?", answer: "பரிந்துரைக்கப்பட்ட உரம் மற்றும் உயிரணு திருத்தங்களை பின்பற்றவும்." },
      { question: "சமூதாயத்தில் சேர எப்படி?", answer: "Community பிரிவில் மற்ற விவசாயிகளுடன் இணைக." },
      { question: "நீர்ப்பாசன குறிப்பு?", answer: "மண் மற்றும் பயிரின் வகையின் அடிப்படையில் நீர் வழங்கவும்." },
      { question: "நுண்ணறிவு உரம் பரிந்துரை?", answer: "Soil Health Analysis மூலம் உரம் அளவை தெரிந்து கொள்ளுங்கள்." },
      { question: "பொது விலை தகவல்?", answer: "Market பிரிவில் உள்ள தற்போதைய விலை விவரங்களைப் பார்க்கவும்." },
      { question: "பழைய பயிர்களை சுழற்சி செய்ய?", answer: "Crop rotation மூலம் மண்ணின் ஊட்டச்சத்து பாதுகாக்கவும்." },
      { question: "உயர் விளைவு பெறுதல்?", answer: "சரியான விதை, தூரம் மற்றும் அறுவடை முறைகளை பின்பற்றவும்." },
      { question: "நிலைத்த வேளாண்மை செயல்முறை?", answer: "Crop residues மற்றும் composting போன்ற முறைகளை பின்பற்றவும்." },
      { question: "நோய் கட்டுப்பாடு?", answer: "Pest Management முறைகளை பின்பற்றவும்." },
      { question: "மண்ணின் pH பரிசோதனை?", answer: "Soil Health Analysis மூலம் pH நிலையை கண்டறியவும்." },
      { question: "வளர்ச்சி கால அட்டவணை?", answer: "Crop Calendar மூலம் விதை மற்றும் அறுவடை நாட்களை திட்டமிடவும்." },
      { question: "புதிய தொழில்நுட்பம் கற்க?", answer: "Tutorials பிரிவில் நவீன விவசாய முறைகளை கற்றுக்கொள்ளவும்." },
      { question: "மண் கடத்தல் தடுப்பு?", answer: "Contour farming மற்றும் mulching பயன்படுத்தவும்." },
      { question: "அரசு திட்டங்கள்?", answer: "Schemes பிரிவில் விவசாய சலுகைகள் மற்றும் உதவிகளைப் பார்க்கவும்." },
      { question: "நீர் சேமிப்பு முறைகள்?", answer: "Drip irrigation மற்றும் rainwater harvesting போன்ற முறைகளை பின்பற்றவும்." },
      { question: "பசுபால், காய்கறி விவசாயம்?", answer: "சரியான விதை மற்றும் நேரத்தில் அறுவடை செய்யவும்." },
    ],
     sidebar: {
      Home: "முகப்பு",
      MyCrops: "எனது பயிர்கள்",
      AIChatbot: "AI சோட்பாட்",
      Community: "சமூகம்",
      Profile: "சுயவிவரம்",
    },
    sending: "அனுப்பப்படுகிறது...",
    error: "மன்னிக்கவும், உங்கள் கோரிக்கையை செயலாக்க முடியவில்லை. மீண்டும் முயற்சிக்கவும்.",
  },
  te: {
    chatbotTitle: "స్మార్ట్ అగ్రి AI",
    inputPlaceholder: "పంటలు, వాతావరణం, నేల మరియు మరిన్ని అడగండి...",
    welcomeMessage: "స్మార్ట్ అగ్రి AI చాట్‌బాట్‌కి స్వాగతం!",
    faqs: [
      { question: "నా మట్టికి ఉత్తమ పంట?", answer: "Soil Health Analysis ఉపయోగించి సిఫార్సులు పొందండి." },
      { question: "నేడు వాతావరణం?", answer: "Weather విభాగంలో లైవ్ అప్డేట్స్ చూడండి." },
      { question: "పంట రోగాలను గుర్తించడానికి?", answer: "Disease Detection ఉపయోగించి మొక్కల చిత్రాలను తీసుకోండి." },
      { question: "ఈ సీజన్లో టాప్ పంటలు?", answer: "Top Crops కార్డ్ సీజనల్ అత్యుత్తమ పంటలను చూపిస్తుంది." },
      { question: "నిరంతర పంటల ఫలితాన్ని ఎలా పెంచాలి?", answer: "పరిమాణం మరియు జీరో-కెమికల్ సూత్రాలను అనుసరించండి." },
      { question: "కమ్యూనిటీలో చేరడానికి?", answer: "Community విభాగంలో ఇతర రైతులతో కలిసిపోండి." },
      { question: "నీటి వ్యవస్థల సూచనలు?", answer: "మట్టి మరియు పంటల ఆధారంగా సరైన నీరు ఇవ్వండి." },
      { question: "సరైన విత్తన ఎంపిక?", answer: "అధిక-మట్టికి తగిన ధ్రువీకృత విత్తనాలను ఎంచుకోండి." },
      { question: "రసాయనాలు మరియు ఎరువులు?", answer: "Soil Health Analysis ద్వారా సరైన ఎరువులు మరియు మోతాదు తెలుసుకోండి." },
      { question: "బజారులో ధరల సమాచారం?", answer: "Market విభాగంలో తాజా ధరలు చూడండి." },
      { question: "పురాతన పంటల రొటేషన్?", answer: "Crop rotation ద్వారా నేలలో న్యూట్రియెంట్స్ నిల్వ చేయండి." },
      { question: "పెరుగుదల కోసం సూత్రాలు?", answer: "సరైన విత్తన రోపణ, spacing మరియు harvest పద్ధతులు అనుసరించండి." },
      { question: "సస్టైనబుల్ ఫార్మింగ్?", answer: "Crop residues, composting మరియు నీరు ఆదా పద్ధతులను అనుసరించండి." },
      { question: "వాతావరణ మార్పుల ప్రభావం?", answer: "స్థానిక climate పరిస్థితులను గమనించి పంటలను ప్లాన్ చేయండి." },
      { question: "రోగాల నియంత్రణ?", answer: "Pest Management విధానాలను అనుసరించండి." },
      { question: "మట్టి pH పరీక్ష?", answer: "Soil Health Analysis ద్వారా pH స్థాయి తెలుసుకోండి." },
      { question: "పంటల నాటే మరియు కోత కాలం?", answer: "Crop Calendar ద్వారా తగిన తేదీలను ప్లాన్ చేయండి." },
      { question: "ఫలితాలను నిల్వ చేయడం ఎలా?", answer: "Proper drying మరియు storage పద్ధతులను అనుసరించండి." },
      { question: "సరికొత్త techniques నేర్చుకోవడం?", answer: "Tutorials విభాగంలో ఆధునిక వ్యవసాయ పద్ధతులను నేర్చుకోండి." },
      { question: "మట్టిఅరగడం నివారణ?", answer: "Contour farming మరియు mulching ఉపయోగించండి." },
    ],
    sidebar: {
      Home: "హోమ్",
      MyCrops: "నా పంటలు",
      AIChatbot: "AI చాట్‌బాట్",
      Community: "కమ్యూనిటీ",
      Profile: "ప్రొఫైల్",
    },
    sending: "పంపబడుతోంది...",
    error: "క్షమించండి, మీ అభ్యర్థనను ప్రాసెస్ చేయలేకపోయాము. దయచేసి మళ్ళీ ప్రయత్నించండి.",
  },
  ml: {
    chatbotTitle: "സ്മാർട്ട് അഗ്രി AI",
    inputPlaceholder: "പംട, കാലാവസ്ഥ, മണ്ണ് എന്നിവയെക്കുറിച്ച് ചോദിക്കുക...",
    welcomeMessage: "സ്മാർട്ട് അഗ്രി AI ചാറ്റ്ബോട്ടിലേക്ക് സ്വാഗതം!",
    faqs: [
      { question: "എന്റെ മണ്ണിനുള്ള മികച്ച വിള എന്താണ്?", answer: "Soil Health Analysis ഉപയോഗിച്ച് ശുപാർശകൾ ലഭിക്കുക." },
      { question: "ഇന്നത്തെ കാലാവസ്ഥ?", answer: "Weather സെക്ഷനിൽ ലൈവ് അപ്‌ഡേറ്റുകൾ പരിശോധിക്കുക." },
      { question: "പംട രോഗം കണ്ടെത്താൻ?", answer: "Disease Detection ഉപയോഗിച്ച് ചെടികളുടെ ചിത്രം എടുത്ത് രോഗം കണ്ടെത്തുക." },
      { question: "ഈ സീസണിലെ ടോപ്പ് വിളകൾ?", answer: "Top Crops കാർഡ് മികച്ച സീസണൽ വിളകൾ കാണിക്കുന്നു." },
      { question: "നിരന്തര വിള ഫലങ്ങൾ മെച്ചപ്പെടുത്താൻ?", answer: "അനുസൃത എറുവുകളും ഓർഗാനിക് സവരണങ്ങളും പാലിക്കുക." },
      { question: "കമ്മ്യൂണിറ്റിയിൽ ചേരാൻ?", answer: "Community സെക്ഷനിൽ മറ്റ് കര്‍ഷകരുമായി ബന്ധപ്പെടുക." },
      { question: "സിഞ്ചൈറേഷൻ നിർദ്ദേശങ്ങൾ?", answer: "മണ്ണിന്റെ തരം അനുസരിച്ച് ശരിയായ ജലം നൽകുക." },
      { question: "വീണ്ടും വിത്ത് എടുക്കേണ്ടത്?", answer: "ഉയർന്ന നിലവാരമുള്ള സേർട്ടിഫൈഡ് വിത്തുകൾ തിരഞ്ഞെടുക്കുക." },
      { question: "എറുവുകൾ / സപ്ലിമെന്റുകൾ?", answer: "Soil Health Analysis വഴി ശരിയായ എറുവും അളവും അറിയുക." },
      { question: "മാർക്കറ്റ് വില വിവരങ്ങൾ?", answer: "Market സെക്ഷനിൽ പുതിയ വിലകൾ പരിശോധിക്കുക." },
      { question: "പഴയ വിളകളെ മാറ്റിക്കളയേണ്ടത്?", answer: "Crop rotation വഴി മണ്ണിലെ പോഷകങ്ങൾ നിലനിർത്തുക." },
      { question: "ഉയർന്ന വിളക്കാർഷിക സാങ്കേതികവിദ്യകൾ?", answer: "വിത്ത്ത്, spacing, harvest വിധികൾ പാലിക്കുക." },
      { question: "സുസ്ഥിര കൃഷി?", answer: "Crop residues, composting, water-saving രീതികൾ ഉപയോഗിക്കുക." },
      { question: "കാലാവസ്ഥാ മാറ്റത്തിന്റെ സ്വാധീനം?", answer: "പ്രാദേശിക climate അനുസരിച്ച് പംടകളും ജലസേചനവും തയാറാക്കുക." },
      { question: "പോക്കുകളും കീടങ്ങളും നിയന്ത്രണം?", answer: "Pest Management മാർഗ്ഗങ്ങൾ പാലിക്കുക." },
      { question: "മണ്ണിന്റെ pH പരിശോധന?", answer: "Soil Health Analysis വഴി pH നില അറിയുക." },
      { question: "പ്ലാന്റിംഗ്/ഹാർവെസ്റ്റ് കാലാവധി?", answer: "Crop Calendar ഉപയോഗിച്ച് തിയതികൾ പ്ലാൻ ചെയ്യുക." },
      { question: "ഫലങ്ങൾ സൂക്ഷിക്കുക?", answer: "ശരിയായ drying & storage മാർഗ്ഗങ്ങൾ പാലിക്കുക." },
      { question: "പുതിയ സാങ്കേതിക വിദ്യ പഠിക്കാൻ?", answer: "Tutorials സെക്ഷനിൽ പഠിക്കുക." },
      { question: "മണ്ണ് മുറിവ് തടയാൻ?", answer: "Contour farming & mulching ഉപയോഗിക്കുക." },
    ],
    sidebar: {
      Home: "ഹോം",
      MyCrops: "എന്റെ വിളകൾ",
      AIChatbot: "AI ചാറ്റ്‌ബോട്ട്",
      Community: "കമ്മ്യൂണിറ്റി",
      Profile: "പ്രൊഫൈൽ",
    },
    sending: "അയയ്ക്കുന്നു...",
    error: "ക്ഷമിക്കുക, നിങ്ങളുടെ അഭ്യർത്ഥന പ്രോസസ്സ് ചെയ്യാൻ കഴിഞ്ഞില്ല. വീണ്ടും ശ്രമിക്കുക.",
  },
};

// Sidebar translation helper
const t = (lang, key) => translations[lang]?.sidebar[key] || key;

export default function ChatBot() {
  const [lang, setLang] = useState("en");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [showWelcome, setShowWelcome] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef();
  const router = useRouter();

  const currentTrans = translations[lang];

  const cycleLang = () => {
    const langs = Object.keys(translations);
    const currentIndex = langs.indexOf(lang);
    const nextIndex = (currentIndex + 1) % langs.length;
    setLang(langs[nextIndex]);
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;
    if (showWelcome) setShowWelcome(false);

    // Add user message to chat
    setMessages((prev) => [...prev, { type: "user", text: input }]);
    const userInput = input;
    setInput("");
    setIsLoading(true);

    try {
      // Call the backend API
      const response = await chatWithBot(userInput);
      
      // Process the response based on the type
      let botReply = "";
      if (response.intent === "NAVIGATION") {
        botReply = `I can help you navigate to the ${response.page} page. Would you like me to take you there?`;
      } else if (response.intent === "SUSTAINABLE_TIP") {
        botReply = "Here's a sustainable farming tip for you...";
      } else if (response.intent === "GENERAL_KNOWLEDGE") {
        botReply = response.answer || "I can help you with that. Here's what I know...";
      } else {
        botReply = response.tip || "I can help you with that. Here's what I know...";
      }
      
      setMessages((prev) => [...prev, { type: "bot", text: botReply }]);
    } catch (error) {
      console.error("Chatbot error:", error);
      setMessages((prev) => [...prev, { type: "bot", text: currentTrans.error }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to get a tip from the backend
  const getFarmingTip = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      // For now, we'll simulate this with a static message
      // In a real implementation, you would call an API endpoint
      const tip = "Did you know? Crop rotation can help maintain soil fertility and reduce pest buildup. Try alternating between different plant families each season!";
      setMessages((prev) => [...prev, { type: "bot", text: tip }]);
    } catch (error) {
      console.error("Tip error:", error);
      setMessages((prev) => [...prev, { type: "bot", text: currentTrans.error }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.push("/screens/home")}>
            <Ionicons name="arrow-back" size={28} color="#2a2828ff" />
          </TouchableOpacity>
          <Text style={styles.title}>{currentTrans.chatbotTitle}</Text>
          <TouchableOpacity onPress={cycleLang}>
            <MaterialIcons name="language" size={28} color="#09bd18ff" />
          </TouchableOpacity>
        </View>

        {/* Chat messages */}
        <ScrollView
          ref={scrollRef}
          style={styles.chatContainer}
          onContentSizeChange={() => {
            if (scrollRef.current) scrollRef.current.scrollToEnd({ animated: true });
          }}
        >
          {showWelcome && (
            <View style={styles.welcomeContainer}>
              <Text style={styles.welcomeText}>{currentTrans.welcomeMessage}</Text>
              <TouchableOpacity style={styles.tipButton} onPress={getFarmingTip}>
                <Text style={styles.tipButtonText}>Get a Farming Tip</Text>
              </TouchableOpacity>
            </View>
          )}

          {messages.map((msg, idx) => (
            <View
              key={idx}
              style={[
                styles.message,
                msg.type === "user" ? styles.userMessage : styles.botMessage,
              ]}
            >
              <Text style={{ color: msg.type === "user" ? "#000" : "#fff" }}>
                {msg.text}
              </Text>
            </View>
          ))}
          
          {isLoading && (
            <View style={[styles.message, styles.botMessage]}>
              <Text style={{ color: "#fff" }}>{currentTrans.sending}</Text>
            </View>
          )}
        </ScrollView>

        {/* FAQs */ }
        <View style={styles.faqs}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {currentTrans.faqs.map((faq, idx) => (
              <TouchableOpacity
                key={idx}
                style={styles.faqCard}
                onPress={() => {
                  setInput(faq.question);
                  setTimeout(sendMessage, 100);
                }}
              >
                <Text style={styles.faqText}>{faq.question}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Input */}
        <View style={styles.inputContainer}>
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder={currentTrans.inputPlaceholder}
            style={styles.input}
            returnKeyType="send"
            onSubmitEditing={sendMessage}
            editable={!isLoading}
          />
          <TouchableOpacity onPress={sendMessage} disabled={isLoading}>
            <Ionicons name="send" size={28} color={isLoading ? "#ccc" : "#2344e8ff"} />
          </TouchableOpacity>
        </View>

        {/* Bottom Navigation */}
        <View style={styles.bottomNav}>
          <TouchableOpacity onPress={() => router.push("/screens/home")} style={styles.navButton}>
            <Ionicons name="home" size={22} color="#047857" />
            <Text style={styles.navTextActive}>{t(lang, "Home")}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push("/screens/MyCrops")} style={styles.navButton}>
            <Ionicons name="leaf" size={22} color="#666" />
            <Text style={styles.navText}>{t(lang, "MyCrops")}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/screens/ChatBot")}
            style={styles.chatbotNavButton}
          >
            <Ionicons name="chatbubble-ellipses" size={26} color="#047857" />
            <Text style={[styles.navTextActive, { fontWeight: "bold" }]}>
              {t(lang, "AIChatbot")}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push("/screens/Community")} style={styles.navButton}>
            <Ionicons name="people" size={22} color="#666" />
            <Text style={styles.navText}>{t(lang, "Community")}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push("/screens/profile")} style={styles.navButton}>
            <Ionicons name="person" size={22} color="#666" />
            <Text style={styles.navText}>{t(lang, "Profile")}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  title: { fontSize: 20, fontWeight: "bold", color: "#09bd18ff" },
  chatContainer: { flex: 1, paddingHorizontal: 16 },
  message: {
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
    maxWidth: "80%",
  },
  userMessage: { alignSelf: "flex-end", backgroundColor: "#e0e0e0" },
  botMessage: { alignSelf: "flex-start", backgroundColor: "#09bd18ff" },
  welcomeContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 50,
    paddingHorizontal: 20,
  },
  welcomeText: {
    fontSize: 30,
    fontWeight: "bold",
    paddingTop: 100,
    color: "#16bf70ff",
    textAlign: "center",
    marginBottom: 20,
  },
  tipButton: {
    backgroundColor: "#09bd18ff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  tipButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderTopWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
  },
  input: { flex: 1, padding: 10, fontSize: 16 },
  faqs: { paddingVertical: 10 },
  faqCard: {
    padding: 8,
    backgroundColor: "#bcf6cbff",
    borderWidth: 1,
    borderColor: "#0b4c10ff",
    marginRight: 8,
    borderRadius: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  faqText: { fontSize: 14, color: "#09490eff" },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
  },
  navText: { fontSize: 12, color: "#666" },
  navTextActive: { fontSize: 12, color: "#047857" },
  chatbotNavButton: { alignItems: "center" },
  navButton: { alignItems: "center" },
});