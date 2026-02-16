// app/auth/register.jsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

// Firebase
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

// AsyncStorage
import AsyncStorage from "@react-native-async-storage/async-storage";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyApmqvvzvq2IoIUqSfWI60L9qg7JUkZsCQ",
  authDomain: "smart-agri-plus.firebaseapp.com",
  projectId: "smart-agri-plus",
  storageBucket: "smart-agri-plus.appspot.com",
  messagingSenderId: "175443715706",
  appId: "1:175443715706:android:9fbf8c2d989248b81c7dc3",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

import { signUpUser } from "../firebaseFunctions";
import { db } from "../../firebaseConfig";

export default function Register() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [numberOfFarms, setNumberOfFarms] = useState("");
  const [farms, setFarms] = useState([]);

  const navigateSignIn = () => router.replace("/auth/signin");


  const handleNumberOfFarms = (num) => {
    setNumberOfFarms(num);
    const n = parseInt(num);
    if (n > 0) {
      const farmsArray = Array(n).fill({
        farmName: "",
        taluk: "",
        district: "",
        farmLocation: "",
        acres: "",
      });
      setFarms(farmsArray);
    } else {
      setFarms([]);
    }
  };

  const handleFarmChange = (index, key, value) => {
    const updatedFarms = [...farms];
    updatedFarms[index][key] = value;
    setFarms(updatedFarms);
  };
  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const token = await user.getIdToken();


      await AsyncStorage.setItem("userToken", token);
      await AsyncStorage.setItem(
        "userInfo",
        JSON.stringify({ uid: user.uid, email: user.email, name })
      );

      Alert.alert("Success", "Account created successfully!");
      navigateSignIn();
    } catch (error) {
      console.error(error);
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false)
    }
  };

  const handleSignUp = async () => {
    try {
      const userData = {
        name,
        email,
        mobile_number: "", // Add field if needed
        preferred_language: "", // Add field if needed
        password, // Used for Auth only
        farms: farms.map((f) => ({
          farmName: f.farmName,
          taluk: f.taluk,
          district: f.district,
          farmLocation: f.farmLocation,
          acres: f.acres,
        })),
      };

      console.log("User data to save:", userData);
      await signUpUser(userData);

      console.log("User saved:", userData.email);

      router.replace("/home");
    } catch (error) {
      console.error("Error signing up:", error);

    }
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <LinearGradient colors={["#a8e063", "#56ab2f"]} style={styles.container}>
        <View style={styles.card}>
          {/* Logo + Title */}
          <View style={styles.logoContainer}>
            <Image
              source={require("../../assets/images/leaf.jpeg")}
              style={styles.logo}
            />
            <Text style={styles.appName}>SmartAgri</Text>
          </View>

          <Text style={styles.heading}>Register</Text>
          <Text style={styles.tagline}>Create your account to get started!</Text>

          {/* Name */}
          <View style={styles.inputContainer}>
            <MaterialIcons name="person" size={20} color="#047827" />
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              placeholderTextColor="#666"
              value={name}
              onChangeText={setName}
            />
          </View>

          {/* Email */}
          <View style={styles.inputContainer}>
            <MaterialIcons name="email" size={20} color="#047827" />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#666"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          {/* Password */}
          <View style={styles.inputContainer}>
            <MaterialIcons name="lock" size={20} color="#047827" />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#666"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          {/* Confirm Password */}
          <View style={styles.inputContainer}>
            <MaterialIcons name="lock" size={20} color="#047827" />
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              placeholderTextColor="#666"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
          </View>

          <TouchableOpacity
            style={styles.registerButton}
            onPress={handleRegister}
            disabled={loading}
          >
            <LinearGradient
              colors={["#56ab2f", "#3d8b1e"]}
              style={styles.registerGradient}
            >
              <Text style={styles.registerText}>
                {loading ? "Loading..." : "Register"}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <Text style={styles.sectionTitle}>Farm Details</Text>

          <View style={styles.inputContainer}>
            <MaterialIcons name="list" size={20} color="#047827ff" />
            <TextInput
              style={styles.input}
              placeholder="Number of Farms Owned"
              placeholderTextColor="#666"
              keyboardType="numeric"
              value={numberOfFarms}
              onChangeText={handleNumberOfFarms}
            />
          </View>

          {farms.map((farm, index) => (
            <View key={index} style={{ marginBottom: 20 }}>
              <Text style={{ fontWeight: "bold", marginBottom: 8 }}>
                Farm {index + 1}
              </Text>

              <View style={styles.inputContainer}>
                <MaterialIcons name="edit" size={20} color="#047827ff" />
                <TextInput
                  style={styles.input}
                  placeholder="Farm Name"
                  placeholderTextColor="#666"
                  value={farm.farmName}
                  onChangeText={(t) => handleFarmChange(index, "farmName", t)}
                />
              </View>

              <View style={styles.inputContainer}>
                <MaterialIcons name="location-city" size={20} color="#047827ff" />
                <TextInput
                  style={styles.input}
                  placeholder="Taluk"
                  placeholderTextColor="#666"
                  value={farm.taluk}
                  onChangeText={(t) => handleFarmChange(index, "taluk", t)}
                />
              </View>

              <View style={styles.inputContainer}>
                <MaterialIcons name="map" size={20} color="#047827ff" />
                <TextInput
                  style={styles.input}
                  placeholder="District"
                  placeholderTextColor="#666"
                  value={farm.district}
                  onChangeText={(t) => handleFarmChange(index, "district", t)}
                />
              </View>

              <View style={styles.inputContainer}>
                <MaterialIcons name="pin-drop" size={20} color="#047827ff" />
                <TextInput
                  style={styles.input}
                  placeholder="Farm Location"
                  placeholderTextColor="#666"
                  value={farm.farmLocation}
                  onChangeText={(t) => handleFarmChange(index, "farmLocation", t)}
                />
              </View>

              <View style={styles.inputContainer}>
                <MaterialIcons name="nature" size={20} color="#047827ff" />
                <TextInput
                  style={styles.input}
                  placeholder="Acres of Land Owned"
                  placeholderTextColor="#666"
                  keyboardType="numeric"
                  value={farm.acres}
                  onChangeText={(t) => handleFarmChange(index, "acres", t)}
                />
              </View>
            </View>
          ))}

          <TouchableOpacity style={styles.signinButton} onPress={handleSignUp}>
            <LinearGradient
              colors={["#56ab2f", "#3d8b1e"]}
              style={styles.signinGradient}
            >
              <Text style={styles.signinText}>Sign Up</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Navigate Signin */}
          <View style={styles.signinContainer}>
            <Text>Already have an account? </Text>
            <TouchableOpacity onPress={navigateSignIn}>
              <Text style={styles.signinText}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, justifyContent: "center", alignItems: "center" },
  card: {
    width: "100%",
    padding: 24,
    borderRadius: 16,
    backgroundColor: "#fff",
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    alignItems: "center",
  },
  logoContainer: { alignItems: "center", marginBottom: 20 },
  logo: { width: 80, height: 80, borderRadius: 40 },
  appName: { fontSize: 24, fontWeight: "bold", color: "#2F855A", marginTop: 8 },
  heading: { fontSize: 22, fontWeight: "bold", color: "#276749", marginBottom: 8 },
  tagline: { fontSize: 14, color: "#666", marginBottom: 24, textAlign: "center" },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: 16,
    borderBottomWidth: 1,
    borderColor: "#ccc",
    paddingBottom: 8,
  },
  input: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: "#333",
  },
  registerButton: {
    width: "100%",
    marginVertical: 12,
  },
  registerGradient: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  registerText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  sectionTitle: {
    fontWeight: "bold",
    fontSize: 18,
    marginVertical: 16,
    color: "#276749",
  },
  signinButton: {
    marginTop: 10,
    borderRadius: 12,
    overflow: "hidden",
  },
  signinGradient: {
    padding: 15,
    alignItems: "center",
  },
  signinText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  signinContainer: {
    flexDirection: "row",
    marginTop: 20,
  },
  input: { flex: 1, marginLeft: 8, fontSize: 16, color: "#333" },
  registerButton: { width: "100%", marginVertical: 12 },
  registerGradient: { paddingVertical: 12, borderRadius: 8, alignItems: "center" },
  registerText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  signinContainer: { flexDirection: "row", marginTop: 20 },
  signinText: { color: "#2e7d32", fontWeight: "bold" },
});
