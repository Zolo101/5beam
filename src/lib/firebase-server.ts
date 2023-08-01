// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getFunctions } from "firebase-admin/functions";
import { getStorage } from "firebase-admin/storage";
import { getAuth } from "firebase-admin/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDRciV0CGRdQAG6iMpGR-6p5GZsHEDNauM",
    authDomain: "beam-329419.firebaseapp.com",
    projectId: "beam-329419",
    storageBucket: "beam-329419.appspot.com",
    messagingSenderId: "842111156351",
    appId: "1:842111156351:web:d3dbe811f67713977bbf4a",
    measurementId: "G-XR1TLCW8H2"
};

// process.env.FIRESTORE_EMULATOR_HOST = "localhost:8080";

// Initialize Firebase
const app = initializeApp(firebaseConfig, "server");
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);
