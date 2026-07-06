import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your real project config, from the Firebase console.
const firebaseConfig = {
  apiKey: "AIzaSyC-yDfoyWKA89GBSHjMic0j9hsodwzC8tY",
  authDomain: "saas-e-receipt-app.firebaseapp.com",
  projectId: "saas-e-receipt-app",
  storageBucket: "saas-e-receipt-app.firebasestorage.app",
  messagingSenderId: "922294144912",
  appId: "1:922294144912:web:d26f8efbf90268cc312d15",
  measurementId: "G-GWS8WZB7MZ",
};

const app = initializeApp(firebaseConfig);

// This is what Login.jsx and App.jsx actually import and use for OTP
// sign-in — auth, not analytics.
export const auth = getAuth(app);