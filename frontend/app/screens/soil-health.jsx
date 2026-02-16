import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, ScrollView, StyleSheet, Platform } from "react-native";

const BACKEND_BASE ="http://localhost:8000";

export default function SoilHealth() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const lat = 11.1;
    const lon = 76.9;
    const depth = "15-30cm";
    const url = `${BACKEND_BASE}/soil/point?lat=${lat}&lon=${lon}&depth=${encodeURIComponent(
      depth
    )}`;

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((json) => setData(json))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Loading soil data...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>Error: {error}</Text>
      </View>
    );
  }

  if (!data) {
    return (
      <View style={styles.center}>
        <Text>No data available</Text>
      </View>
    );
  }

  const { location, depth, soil_summary } = data;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Soil Summary</Text>
      <Text style={styles.sub}>
        Location: {location.lat}, {location.lon}
      </Text>
      <Text style={styles.sub}>Depth: {depth}</Text>

      <View style={styles.grid}>
        {Object.entries(soil_summary).map(([key, value]) => (
          <View key={key} style={styles.card}>
            <Text style={styles.k}>{key.toUpperCase()}</Text>
            <Text style={styles.v}>{value}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, alignItems: "stretch" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 8 },
  sub: { fontSize: 14, marginBottom: 4 },
  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", marginTop: 12 },
  card: {
    width: "48%",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: "#f9f9f9",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  k: { fontSize: 12, fontWeight: "700" },
  v: { fontSize: 20, marginTop: 6 },
  error: { color: "red" },
});