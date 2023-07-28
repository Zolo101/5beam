// Import the functions you need from the SDKs you need
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import { connectFunctionsEmulator, getFunctions } from "firebase/functions";
import { connectStorageEmulator, getStorage } from "firebase/storage";
import { connectAuthEmulator, getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDRciV0CGRdQAG6iMpGR-6p5GZsHEDNauM",
    authDomain: "beam-329419.firebaseapp.com",
    projectId: "beam-329419",
    storageBucket: "beam-329419.appspot.com",
    messagingSenderId: "842111156351",
    appId: "1:842111156351:web:d3dbe811f67713977bbf4a",
    measurementId: "G-XR1TLCW8H2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// export const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const functions = getFunctions(app, "europe-west2");
// export const messaging = getMessaging(app);
export const analytics = getAnalytics(app);
const EMULATE = false;

if (EMULATE) {
    connectFirestoreEmulator(db, "localhost", 8080)
    connectAuthEmulator(auth, "http://127.0.0.1:9099")
    connectStorageEmulator(storage, "localhost", 9199)
    connectFunctionsEmulator(functions, "localhost", 5001);
}

// export const user = (await signInAnonymously(auth)).user;
//
// // create document if new user
// if (localStorage.getItem("uid") !== user.uid) {
//     await setDoc(doc(db, "users", user.uid), {alivePosts: increment(0)})
//     localStorage.setItem("uid", user.uid)
// }