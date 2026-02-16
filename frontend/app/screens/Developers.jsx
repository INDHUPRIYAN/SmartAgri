// app/developers.jsx
import React, { useEffect } from "react";
import { View, Text, ScrollView, StyleSheet, Image, TouchableOpacity, BackHandler } from "react-native";
import { useRouter } from "expo-router";

const femaleImg = require("../../assets/images/female.jpeg");
const maleImg = require("../../assets/images/Men.jpg");

const teamMembers = [
  {
    name: "Indhu Priyan M",
    gender: "male",
    role: "Mobile & Web App Frontend Developer",
    expertise: "Expert in React Native, Expo Router, and UI animations. Focused on building smooth and responsive mobile interfaces."
  },
  {
    name: "Jeyamoorthi S (Team Lead) ",
    gender: "male",
    role: "Backend & AI Model Developer",
    expertise: "Leads the team and develops AI-powered crop recommendation models. Skilled in Python, TensorFlow, and ML algorithms."
  },
  {
    name: "Kaviya Vikashini J S",
    gender: "female",
    role: "UI/UX Designer & Frontend",
    expertise: "Designs intuitive interfaces and ensures consistent user experience. Proficient in Figma, Adobe XD, and mobile design principles."
  },
  {
    name: "Maanasa Sadagopan",
    gender: "female",
    role: "Database & Backend Developer",
    expertise: "Handles database design, API integration, and server-side logic. Experienced with Firebase, Firestore, and backend optimization."
  },
  {
    name: "Krishna Prasad S",
    gender: "male",
    role: "Backend & Database",
    expertise: "Focuses on backend development, secure data management, and maintaining robust database structures."
  },
  {
    name: "Manasa P",
    gender: "female",
    role: "UI/UX Designer",
    expertise: "Supports UI/UX design and frontend implementation, ensuring seamless navigation and visually appealing layouts."
  },
];

export default function Developers() {
  const router = useRouter();

  const goBackToAbout = () => {
    router.replace("/screens/AboutApp");
  };

  // Handle Android back button
  useEffect(() => {
    const backAction = () => {
      goBackToAbout();
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    return () => backHandler.remove();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity onPress={goBackToAbout}>
        <Text style={styles.back}>{"< Back"}</Text>
      </TouchableOpacity>

      <Text style={styles.heading}>Devengers Team</Text>
      <Text style={styles.subHeading}>
        Sri Shakthi Institute of Engineering and Technology
      </Text>
      <Text style={styles.description}>
        We are B.E. Computer Science Engineering students building innovative AI-powered solutions for real-world problems.
      </Text>

      {teamMembers.map((member, index) => (
        <View key={index} style={styles.card}>
          <Image
            source={member.gender === "female" ? femaleImg : maleImg}
            style={styles.avatar}
          />
          <View style={styles.info}>
            <Text style={styles.name}>{member.name}</Text>
            <Text style={styles.role}>{member.role}</Text>
            <Text style={styles.expertise}>{member.expertise}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f5f5f5",
    paddingTop: 60,
    paddingBottom: 80,
  },
  back: {
    fontSize: 16,
    color: "#047827ff",
    marginBottom: 10,
    fontWeight: "600",
  },
  heading: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#047827ff",
    marginBottom: 5,
  },
  subHeading: {
    fontSize: 16,
    fontWeight: "600",
    color: "#065f46",
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    color: "#374151",
    marginBottom: 20,
    lineHeight: 20,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    elevation: 3,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 15,
  },
  info: {
    flex: 1,
    justifyContent: "center",
  },
  name: {
    fontSize: 18,
    fontWeight: "700",
    color: "#047827ff",
    marginBottom: 3,
  },
  role: {
    fontSize: 14,
    fontWeight: "600",
    color: "#065f46",
    marginBottom: 3,
  },
  expertise: {
    fontSize: 13,
    color: "#374151",
    lineHeight: 18,
  },
});
