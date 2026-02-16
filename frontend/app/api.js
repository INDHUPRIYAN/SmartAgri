// frontend/api.js
import axios from "axios";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";

// IMPORTANT: Replace with your machine IP when testing on Expo Go
// e.g., http://192.168.1.5:8000
const API_BASE = "http://localhost:8000";

// Helper: add Firebase token automatically
async function axiosWithAuth() {
  const token = auth.currentUser
    ? await auth.currentUser.getIdToken()
    : null;

  const instance = axios.create({
    baseURL: API_BASE,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  return instance;
}

/* 🌤 Weather */
export const getWeather = async (lat, lon) => {
  const api = await axiosWithAuth();
  const res = await api.get(`/weather?lat=${lat}&lon=${lon}`);
  return res.data;
};

/* 🧪 Soil Health */
export const getSoilHealth = async (lat, lon, depth = "15-30cm") => {
  const api = await axiosWithAuth();
  const res = await api.get(`/soil/point?lat=${lat}&lon=${lon}&depth=${depth}`);
  return res.data;
};

/* 🌱 Top Crops */
export const getTopCrops = async (lat, lon) => {
  const api = await axiosWithAuth();
  const res = await api.get(`/crops/top?lat=${lat}&lon=${lon}`);
  return res.data;
};

/* 🤖 AI Crop Recommendation */
export const getCropRecommendation = async (soilData, weatherData) => {
  const api = await axiosWithAuth();
  const res = await api.post(`/recommend`, { soil: soilData, weather: weatherData });
  return res.data;
};

/* 🦠 Disease Detection */
export const detectDisease = async (imageBase64) => {
  const api = await axiosWithAuth();
  const res = await api.post(`/disease/predict`, { image: imageBase64 });
  return res.data;
};

/* 🗣 Chatbot */
export const chatWithBot = async (message) => {
  const api = await axiosWithAuth();
  const res = await api.post(`/chatbot/intent`, { text: message, user_id: "test_user" });
  return res.data;
};

/* User Profile */
export const getUserProfile = async (userId) => {
  try {
    const res = await axios.get(`${API_BASE}/user/${userId}`);
    return res.data;
  } catch (err) {
    console.error("User API error:", err);
    throw err;
  }
};

/* Generic fetch with Firebase Auth token */
const BACKEND_BASE = "http://localhost:8000"; // fixed typo

export async function apiFetch(path, options = {}) {
  const token = await auth.currentUser.getIdToken();

  return fetch(`${BACKEND_BASE}${path}`, {
    ...options,
    headers: {
      ...(options.headers || {}),
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // fixed missing backticks
    },
  });
}