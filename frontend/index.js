import React, { Suspense } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { I18nextProvider } from "react-i18next";
import i18n from "./utils/i18n"; // your i18n setup
import Home from "../app/screens/Home"; // your main screen

export default function App() {
  return (
    <Suspense fallback={<Loading />}>
      <I18nextProvider i18n={i18n}>
        <Home />
      </I18nextProvider>
    </Suspense>
  );
}

// Simple loading screen while i18n loads
function Loading() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color="#0000ff" />
      <Text>Loading...</Text>
    </View>
  );
}
