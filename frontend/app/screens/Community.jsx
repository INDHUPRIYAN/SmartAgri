// app/screens/Community.jsx
import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
  Pressable,
  Clipboard,
  Platform,
  LayoutAnimation,
  UIManager,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as Speech from "expo-speech";

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// --- Translations ---
const translations = {
  en: {
    title: "Farmer Community",
    alerts: "Regional Disease Alerts",
    communityFeed: "Community Discussions",
    explainAI: "Explain with AI",
    postPlaceholder: "Share an update or ask a question...",
    postButton: "Post",
    reportAlert: "Report Alert",
    share: "Share",
    like: "Like",
    comment: "Comment",
    created: "Posted",
    alertAdded: "Alert added",
    alertShared: "Alert shared (simulated)",
    copied: "Copied to clipboard",
    addComment: "Add Comment",
    submit: "Submit",
    cancel: "Cancel",
    searchPlaceholder: "Search posts, alerts, or authors...",
  },
  hi: {
    title: "किसान समुदाय",
    alerts: "क्षेत्रीय रोग चेतावनी",
    communityFeed: "समुदाय चर्चा",
    explainAI: "एआई से समझाएं",
    postPlaceholder: "अपडेट साझा करें या प्रश्न पूछें...",
    postButton: "पोस्ट करें",
    reportAlert: "अलर्ट रिपोर्ट करें",
    share: "साझा करें",
    like: "लाइक",
    comment: "टिप्पणी",
    created: "पोस्ट हुआ",
    alertAdded: "अलर्ट जोड़ दिया गया",
    alertShared: "अलर्ट साझा किया गया (नकली)",
    copied: "क्लिपबोर्ड में कॉपी किया गया",
    addComment: "टिप्पणी जोड़ें",
    submit: "जमा करें",
    cancel: "रद्द करें",
    searchPlaceholder: "पोस्ट, अलर्ट या लेखक खोजें...",
  },
  ta: {
    title: "விவசாய சமூகப் பகுதி",
    alerts: "மண்டல நோய் எச்சரிக்கை",
    communityFeed: "சமூக விவாதங்கள்",
    explainAI: "ஏஐ மூலம் விளக்கவும்",
    postPlaceholder: "புதுப்பிப்பை பகிரவும் அல்லது கேள்வி கேளுங்கள்...",
    postButton: "பதிவு",
    reportAlert: "எச்சரிக்கை புகார் செய்யவும்",
    share: "பகிர்",
    like: "பிடித்தது",
    comment: "கருத்து",
    created: "பதிவிடப்பட்டது",
    alertAdded: "எச்சரிக்கை சேர்க்கப்பட்டது",
    alertShared: "எச்சரிக்கை பகிரப்பட்டது (செயற்கை)",
    copied: "காப்பி செய்யப்பட்டார்",
    addComment: "கருத்தைச் சேர்",
    submit: "சமர்ப்பிக்கவும்",
    cancel: "ரத்துசெய்",
    searchPlaceholder: "பதிவுகள், எச்சரிக்கைகள் அல்லது ஆசிரியர்களைத் தேடவும்...",
  },
};

// --- initial mock data (stateful) ---
const initialAlerts = [
  {
    id: "a1",
    title: "Paddy Leaf Blight Detected",
    region: "Thanjavur, Tamil Nadu",
    severity: "High",
    message: "Blight spreading rapidly due to humidity. Use preventive spray immediately.",
    createdAt: Date.now() - 1000 * 60 * 60 * 2,
  },
  {
    id: "a2",
    title: "Groundnut Rust Cases",
    region: "Erode, Tamil Nadu",
    severity: "Moderate",
    message: "Initial symptoms of rust detected. Monitor plants daily.",
    createdAt: Date.now() - 1000 * 60 * 60 * 8,
  },
];

const initialPosts = [
  {
    id: "p1",
    author: "Ramesh Kumar",
    avatar: "https://cdn-icons-png.flaticon.com/512/219/219983.png",
    content: "Anyone facing pest issues in maize crops this week?",
    createdAt: Date.now() - 1000 * 60 * 60 * 6,
    likes: 5,
    comments: [
      { id: "c1", author: "Anita", text: "Yes — saw similar on margins." },
    ],
    verified: false,
  },
  {
    id: "p2",
    author: "Dr. Meena (Agri Expert)",
    avatar: "https://cdn-icons-png.flaticon.com/512/706/706830.png",
    content: "Ensure early morning watering to reduce fungal infection risk.",
    createdAt: Date.now() - 1000 * 60 * 60 * 3,
    likes: 18,
    comments: [],
    verified: true,
  },
];

export default function Community() {
  // language + UI state
  const [language, setLanguage] = useState("en");
  const t = translations[language];
  const router = useRouter();

  // dynamic state
  const [alerts, setAlerts] = useState(initialAlerts);
  const [posts, setPosts] = useState(initialPosts);
  const [newPostText, setNewPostText] = useState("");
  const [search, setSearch] = useState("");

  // modals
  const [aiModal, setAiModal] = useState({ open: false, title: "", message: "" });
  const [commentModal, setCommentModal] = useState({ open: false, postId: null, text: "" });
  const [reportModal, setReportModal] = useState({ open: false, title: "", region: "", severity: "Moderate", message: "" });

  // filtered results for search (posts + alerts)
  const filteredPosts = useMemo(() => {
    if (!search.trim()) return posts;
    const q = search.toLowerCase();
    return posts.filter(
      (p) =>
        p.author.toLowerCase().includes(q) ||
        p.content.toLowerCase().includes(q)
    );
  }, [search, posts]);

  const filteredAlerts = useMemo(() => {
    if (!search.trim()) return alerts;
    const q = search.toLowerCase();
    return alerts.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.region.toLowerCase().includes(q) ||
        a.message.toLowerCase().includes(q)
    );
  }, [search, alerts]);

  // layout animation helper
  const animateLayout = () => LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

  // --- posts functionality ---
  const handleCreatePost = () => {
    if (!newPostText.trim()) {
      Alert.alert("Empty", "Please write something before posting.");
      return;
    }
    const newPost = {
      id: "p" + Date.now(),
      author: "You",
      avatar: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
      content: newPostText.trim(),
      createdAt: Date.now(),
      likes: 0,
      comments: [],
      verified: false,
    };
    animateLayout();
    setPosts((p) => [newPost, ...p]);
    setNewPostText("");
    Alert.alert(t.created, `${t.postButton} ✓`);
  };

  const toggleLike = (postId) => {
    animateLayout();
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId ? { ...p, likes: (p._liked ? p.likes - 1 : p.likes + 1), _liked: !p._liked } : p
      )
    );
  };

  const openCommentModal = (postId) => {
    setCommentModal({ open: true, postId, text: "" });
  };

  const submitComment = () => {
    const { postId, text } = commentModal;
    if (!text.trim()) {
      Alert.alert("Empty", "Please add a comment.");
      return;
    }
    animateLayout();
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? { ...p, comments: [...(p.comments || []), { id: "c" + Date.now(), author: "You", text: text.trim() }] }
          : p
      )
    );
    setCommentModal({ open: false, postId: null, text: "" });
  };

  // --- alert functionality ---
  const handleShareAlert = (alert) => {
    // try navigator.share if available (web/mobile), otherwise copy text to clipboard
    const shareText = `${alert.title} • ${alert.region}\n${alert.message}`;
    if (navigator && navigator.share) {
      navigator.share({ title: alert.title, text: shareText }).catch(() => {
        Clipboard.setString(shareText);
        Alert.alert(t.copied, t.alertShared);
      });
    } else if (Platform.OS === "web") {
      // fallback: copy to clipboard
      try {
        Clipboard.setString(shareText);
        Alert.alert(t.copied, t.alertShared);
      } catch (e) {
        Alert.alert(t.alertShared, shareText);
      }
    } else {
      // mobile fallback
      Clipboard.setString(shareText);
      Alert.alert(t.alertShared, t.copied);
    }
  };

  const handleAskAI = (alert) => {
    // simple canned explanation + speak — in production integrate real AI
    const explanation = `Detected: ${alert.title}. Severity: ${alert.severity}. Advice: ${alert.message}`;
    setAiModal({ open: true, title: alert.title, message: explanation });
    Speech.speak(explanation);
  };

  const submitReport = () => {
    const { title, region, severity, message } = reportModal;
    if (!title.trim() || !region.trim()) {
      Alert.alert("Incomplete", "Please provide a title and region.");
      return;
    }
    const newAlert = {
      id: "a" + Date.now(),
      title: title.trim(),
      region: region.trim(),
      severity,
      message: message.trim() || "No message provided.",
      createdAt: Date.now(),
    };
    animateLayout();
    setAlerts((a) => [newAlert, ...a]);
    setReportModal({ open: false, title: "", region: "", severity: "Moderate", message: "" });
    Alert.alert(t.alertAdded, `${title} ✓`);
  };

  // small helper: format relative time (simple)
  const timeAgo = (ts) => {
    const diff = Date.now() - ts;
    const mins = Math.round(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.round(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.round(hrs / 24);
    return `${days}d ago`;
  };

  // UI render functions
  const renderAlertCard = (alert) => (
    <View key={alert.id} style={[styles.alertCard, alert.severity === "High" ? styles.alertHigh : alert.severity === "Moderate" ? styles.alertModerate : styles.alertLow]}>
      <View style={styles.alertRow}>
        <Ionicons name={alert.severity === "High" ? "alert-circle" : "warning-outline"} size={18} color={alert.severity === "High" ? "#B91C1C" : "#B45309"} />
        <Text style={styles.alertTitle}>{alert.title}</Text>
      </View>
      <Text style={styles.alertRegion}>📍 {alert.region} · {timeAgo(alert.createdAt || Date.now())}</Text>
      <Text style={styles.alertMessage}>{alert.message}</Text>

      <View style={styles.alertActions}>
        <TouchableOpacity style={styles.smallBtn} onPress={() => handleAskAI(alert)}>
          <Ionicons name="bulb-outline" size={16} color="#fff" />
          <Text style={styles.smallBtnText}>{t.explainAI}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.smallBtn, styles.shareOutline]} onPress={() => handleShareAlert(alert)}>
          <Ionicons name="share-social" size={16} color="#047857" />
          <Text style={[styles.shareText]}> {t.share}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderPostCard = (post) => (
    <View key={post.id} style={styles.postCard}>
      <View style={styles.postHeader}>
        <Image source={{ uri: post.avatar }} style={styles.avatar} />
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={styles.postAuthor}>{post.author}</Text>
            {post.verified && <Ionicons name="checkmark-circle" size={14} color="#10B981" style={{ marginLeft: 6 }} />}
            <Text style={styles.postTime}>{post.createdAt ? timeAgo(post.createdAt) : ""}</Text>
          </View>
        </View>
      </View>

      <Text style={styles.postText}>{post.content}</Text>

      <View style={styles.postFooter}>
        <TouchableOpacity style={styles.actionBtn} onPress={() => toggleLike(post.id)}>
          <Ionicons name={post._liked ? "heart" : "heart-outline"} size={18} color={post._liked ? "#E11D48" : "#374151"} />
          <Text style={styles.actionLabel}>{post.likes + (post._liked ? 0 : 0)}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionBtn} onPress={() => openCommentModal(post.id)}>
          <Ionicons name="chatbubble-ellipses-outline" size={18} color="#374151" />
          <Text style={styles.actionLabel}>{(post.comments && post.comments.length) || 0}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionBtn} onPress={() => {
          Clipboard.setString(`${post.author}: ${post.content}`);
          Alert.alert(t.copied, t.copied);
        }}>
          <Ionicons name="share-social-outline" size={18} color="#374151" />
          <Text style={styles.actionLabel}>Share</Text>
        </TouchableOpacity>
      </View>

      {/* show comments preview */}
      {(post.comments || []).slice(-2).map((c) => (
        <View key={c.id} style={styles.commentRow}>
          <Text style={styles.commentAuthor}>{c.author}:</Text>
          <Text style={styles.commentText}>{c.text}</Text>
        </View>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* top bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back-outline" size={24} color="#065f46" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>{translations[language].title}</Text>

        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity onPress={() => setReportModal((s) => ({ ...s, open: true }))} style={{ marginRight: 12 }}>
            <MaterialIcons name="add-alert" size={24} color="#065f46" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setLanguage(language === "en" ? "hi" : language === "hi" ? "ta" : "en")}>
            <MaterialIcons name="language" size={22} color="#065f46" />
          </TouchableOpacity>
        </View>
      </View>

      {/* search */}
      <View style={styles.searchRow}>
        <Ionicons name="search" size={18} color="#9CA3AF" />
        <TextInput
          placeholder={t.searchPlaceholder}
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Alerts */}
        <Text style={styles.sectionTitle}>{t.alerts}</Text>
        <View style={styles.alertList}>
          {filteredAlerts.length === 0 ? <Text style={styles.emptyText}>No alerts found</Text> : filteredAlerts.map(renderAlertCard)}
        </View>

        {/* Community feed */}
        <Text style={styles.sectionTitle}>{t.communityFeed}</Text>
        <View style={styles.feedList}>
          {filteredPosts.length === 0 ? <Text style={styles.emptyText}>No posts yet</Text> : filteredPosts.map(renderPostCard)}
        </View>
      </ScrollView>

      {/* post input */}
      <View style={styles.postInput}>
        <TextInput
          placeholder={t.postPlaceholder}
          value={newPostText}
          onChangeText={setNewPostText}
          style={styles.input}
          multiline
        />
        <TouchableOpacity style={styles.postBtn} onPress={handleCreatePost}>
          <Ionicons name="send" size={18} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* AI modal */}
      <Modal visible={aiModal.open} transparent animationType="slide" onRequestClose={() => setAiModal({ open: false, title: "", message: "" })}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>{aiModal.title}</Text>
            <ScrollView style={{ maxHeight: 180 }}>
              <Text style={styles.modalText}>{aiModal.message}</Text>
            </ScrollView>

            <View style={{ flexDirection: "row", justifyContent: "flex-end", marginTop: 12 }}>
              <Pressable onPress={() => { Speech.speak(aiModal.message || "No details"); }} style={styles.modalAction}>
                <Text style={styles.modalActionText}>🔊 Speak</Text>
              </Pressable>
              <Pressable onPress={() => setAiModal({ open: false, title: "", message: "" })} style={[styles.modalAction, { marginLeft: 10 }]}>
                <Text style={[styles.modalActionText, { color: "#065f46" }]}>Close</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* comment modal */}
      <Modal visible={commentModal.open} transparent animationType="fade" onRequestClose={() => setCommentModal({ open: false, postId: null, text: "" })}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>{t.addComment}</Text>
            <TextInput placeholder="Write a helpful comment..." value={commentModal.text} onChangeText={(txt) => setCommentModal((s) => ({ ...s, text: txt }))} style={[styles.input, { marginTop: 10 }]} multiline />
            <View style={{ flexDirection: "row", justifyContent: "flex-end", marginTop: 10 }}>
              <Pressable onPress={() => setCommentModal({ open: false, postId: null, text: "" })} style={styles.modalAction}>
                <Text style={styles.modalActionText}>{t.cancel}</Text>
              </Pressable>
              <Pressable onPress={submitComment} style={[styles.modalAction, { marginLeft: 10, backgroundColor: "#065f46" }]}>
                <Text style={[styles.modalActionText, { color: "#fff" }]}>{t.submit}</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* report alert modal */}
      <Modal visible={reportModal.open} transparent animationType="slide" onRequestClose={() => setReportModal({ open: false, title: "", region: "", severity: "Moderate", message: "" })}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalBox, { width: "92%" }]}>
            <Text style={styles.modalTitle}>{t.reportAlert}</Text>

            <TextInput placeholder="Alert title (e.g. Rice blast in Thanjavur)" value={reportModal.title} onChangeText={(v) => setReportModal((s) => ({ ...s, title: v }))} style={[styles.input, { marginTop: 8 }]} />
            <TextInput placeholder="Region (District, State)" value={reportModal.region} onChangeText={(v) => setReportModal((s) => ({ ...s, region: v }))} style={[styles.input, { marginTop: 8 }]} />
            <TextInput placeholder="Optional message / notes" value={reportModal.message} onChangeText={(v) => setReportModal((s) => ({ ...s, message: v }))} style={[styles.input, { marginTop: 8, height: 80 }]} multiline />

            <View style={{ flexDirection: "row", justifyContent: "flex-end", marginTop: 8 }}>
              <Pressable onPress={() => setReportModal({ open: false, title: "", region: "", severity: "Moderate", message: "" })} style={styles.modalAction}>
                <Text style={styles.modalActionText}>{t.cancel}</Text>
              </Pressable>
              <Pressable onPress={submitReport} style={[styles.modalAction, { marginLeft: 10, backgroundColor: "#065f46" }]}>
                <Text style={[styles.modalActionText, { color: "#fff" }]}>{t.submit}</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// --- STYLES ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },

  topBar: {
    height: 64,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E6EEF1",
    elevation: 2,
  },
  headerTitle: { fontSize: 18, fontWeight: "700", color: "#065f46" },

  searchRow: {
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 8,
    margin: 12,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.03,
    elevation: 1,
  },
  searchInput: { marginLeft: 8, flex: 1, fontSize: 14 },

  sectionTitle: { marginHorizontal: 16, marginTop: 6, fontSize: 16, fontWeight: "700", color: "#0F5132" },

  // alerts
  alertList: { marginHorizontal: 12, marginTop: 8 },
  alertCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    elevation: 1,
  },
  alertHigh: { borderLeftWidth: 4, borderLeftColor: "#ef4444" },
  alertModerate: { borderLeftWidth: 4, borderLeftColor: "#f97316" },
  alertLow: { borderLeftWidth: 4, borderLeftColor: "#10b981" },
  alertRow: { flexDirection: "row", alignItems: "center" },
  alertTitle: { fontWeight: "700", marginLeft: 8, fontSize: 15 },
  alertRegion: { marginTop: 6, color: "#47606B", fontSize: 13 },
  alertMessage: { marginTop: 6, color: "#39424A", fontSize: 14 },
  alertActions: { flexDirection: "row", justifyContent: "space-between", marginTop: 10 },
  smallBtn: { flexDirection: "row", alignItems: "center", paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8 },
  smallBtnText: { color: "#fff", marginLeft: 8, fontWeight: "600" },
  shareOutline: { backgroundColor: "#fff", borderWidth: 1, borderColor: "#047857" },
  shareText: { color: "#047857", fontWeight: "600", marginLeft: 6 },

  // map card
  mapCard: { marginHorizontal: 12, borderRadius: 12, overflow: "hidden", marginTop: 6, marginBottom: 12 },
  mapImage: { width: "100%", height: 160 },
  mapOverlay: { position: "absolute", bottom: 10, left: 12 },
  mapOverlayTitle: { color: "#fff", fontWeight: "700", fontSize: 14 },
  mapOverlaySub: { color: "#fff", fontSize: 12 },

  // feed
  feedList: { marginHorizontal: 12, marginTop: 4, paddingBottom: 90 },
  postCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.02,
    elevation: 1,
  },
  postHeader: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
  postAuthor: { fontWeight: "700", fontSize: 15, color: "#0F5132" },
  postTime: { marginLeft: 8, color: "#6B7280", fontSize: 12 },
  postText: { color: "#17202A", fontSize: 14, marginTop: 6 },
  postFooter: { flexDirection: "row", justifyContent: "flex-start", marginTop: 12 },
  actionBtn: { flexDirection: "row", alignItems: "center", marginRight: 20 },
  actionLabel: { marginLeft: 6, color: "#475569" },

  commentRow: { flexDirection: "row", marginTop: 8 },
  commentAuthor: { fontWeight: "700", marginRight: 6, color: "#0F5132" },
  commentText: { color: "#374151" },

  // post input
  postInput: {
    position: "absolute",
    bottom: 14,
    left: 12,
    right: 12,
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 8,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    elevation: 4,
  },
  input: { flex: 1, minHeight: 40, fontSize: 14 },
  postBtn: { marginLeft: 10, backgroundColor: "#065f46", paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10 },

  // modal
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.35)", justifyContent: "center", alignItems: "center" },
  modalBox: { width: "86%", backgroundColor: "#fff", borderRadius: 12, padding: 14, elevation: 6 },
  modalTitle: { fontWeight: "800", fontSize: 16, color: "#0F5132", marginBottom: 8 },
  modalText: { color: "#21323A", fontSize: 14 },

  modalAction: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8, backgroundColor: "#EFEFEF" },
  modalActionText: { color: "#333", fontWeight: "700" },

  emptyText: { marginHorizontal: 16, color: "#6B7280", fontStyle: "italic", marginTop: 8 },
});
