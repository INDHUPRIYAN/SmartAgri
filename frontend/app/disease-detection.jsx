// app/screens/disease-detection.jsx
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";

// 🔹 Change this to your PC's LAN IP if testing on a real device
const BACKEND_URL = "http://192.168.137.1:8000/predict";

export default function DiseaseDetection() {
  const [imageUri, setImageUri] = useState(null);
  const [diseaseResult, setDiseaseResult] = useState("");
  const [loading, setLoading] = useState(false);

  // Open camera
  const openCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      alert("Camera permission is required!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: false,
      quality: 0.7,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setImageUri(uri);
      sendToModel(uri);
    }
  };

  // Open gallery
  const openGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Gallery permission is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: false,
      quality: 0.7,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setImageUri(uri);
      sendToModel(uri);
    }
  };

  // Send image to backend
  const sendToModel = async (uri) => {
    setLoading(true);
    setDiseaseResult("");

    const formData = new FormData();
    formData.append("file", {
      uri,
      name: "plant.jpg",
      type: "image/jpeg",
    });

    try {
      const response = await fetch(BACKEND_URL, {
        method: "POST",
        body: formData,
        headers: {
          //"Content-Type": "multipart/form-data",
        },
      });

      const data = await response.json();
      console.log("Backend response:", data);

      if (data.error) {
        setDiseaseResult("Error: " + data.error);
      } else {
        setDiseaseResult(`${data.predicted_class} (${data.confidence}%)`);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setDiseaseResult("Something went wrong. Check console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>🌿 Plant Disease Detection</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={openCamera} style={styles.button}>
          <Text style={styles.buttonText}>Open Camera</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={openGallery} style={styles.button}>
          <Text style={styles.buttonText}>Pick from Gallery</Text>
        </TouchableOpacity>
      </View>

      {imageUri && <Image source={{ uri: imageUri }} style={styles.imagePreview} />}

      {loading && <ActivityIndicator size="large" color="#56ab2f" style={{ marginTop: 20 }} />}

      {diseaseResult ? <Text style={styles.resultText}>{diseaseResult}</Text> : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f0f5f0",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 20,
    color: "#2e7d32",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#56ab2f",
    padding: 12,
    borderRadius: 12,
    flex: 1,
    marginHorizontal: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  imagePreview: {
    width: 300,
    height: 300,
    marginVertical: 20,
    borderRadius: 12,
    resizeMode: "contain",
  },
  resultText: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
    color: "#1b5e20",
    textAlign: "center",
  },
});
