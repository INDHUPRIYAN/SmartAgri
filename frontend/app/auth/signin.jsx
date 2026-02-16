// app/auth/signin.jsx
import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { router } from "expo-router";

export default function Signin() {
  const [loading, setLoading] = useState(false);

  const handleSignIn = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.replace("/screens/home"); // Navigate to Home dashboard
    }, 600); // small delay to simulate loading
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🌱 Smart Agri</Text>
      <Text style={styles.subHeader}>Welcome Back!</Text>

      <TouchableOpacity
        style={[styles.signInButton, loading && { opacity: 0.7 }]}
        onPress={handleSignIn}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Sign In</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f5f0",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  header: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#047827",
  },
  subHeader: {
    fontSize: 18,
    color: "#555",
    marginBottom: 50,
  },
  signInButton: {
    backgroundColor: "#047827",
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 12,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
});
