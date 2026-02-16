// app/auth/loader.jsx
import React, { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

export default function Loader() {
  useEffect(() => {
    const checkLogin = async () => {
      const token = await AsyncStorage.getItem("userToken");

      if (token) {
        try {
          const res = await fetch("http://192.168.X.X:8000/verify-token", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });

          if (res.status === 200) {
            router.replace("/screens/home");
          } else {
            router.replace("/auth/signin");
          }
        } catch (error) {
          router.replace("/auth/signin");
        }
      } else {
        router.replace("/auth/signin");
      }
    };

    checkLogin();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" />
    </View>
  );
}
