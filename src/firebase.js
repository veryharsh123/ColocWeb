// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDYFDlhwKbCH18CMWq8DNVv7_C1Srpex-I",
  authDomain: "octopols-coloc.firebaseapp.com",
  projectId: "octopols-coloc",
  storageBucket: "octopols-coloc.appspot.com",
  messagingSenderId: "505790733254",
  appId: "1:505790733254:web:9f4062e8027a92b8ca70c7"
};

// Initialize Firebase
initializeApp(firebaseConfig);
export  const db = getFirestore()