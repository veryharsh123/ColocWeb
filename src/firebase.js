// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyALN-CFGulwdhcfd4GqmWAKm7GjNlh-3Zk",
  authDomain: "colocweb.firebaseapp.com",
  projectId: "colocweb",
  storageBucket: "colocweb.appspot.com",
  messagingSenderId: "533553464834",
  appId: "1:533553464834:web:769f85bdafafd15fac891b",
  measurementId: "G-0QJFBBH978"
};

// Initialize Firebase
initializeApp(firebaseConfig);
export  const db = getFirestore();