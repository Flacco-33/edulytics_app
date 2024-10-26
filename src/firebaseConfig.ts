// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getStorage} from 'firebase/storage'
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDw72-HjOLs4u0g3D27-NJrNd-mDCvwdqA",
  authDomain: "edulytics-8a525.firebaseapp.com",
  projectId: "edulytics-8a525",
  storageBucket: "edulytics-8a525.appspot.com",
  messagingSenderId: "178184689277",
  appId: "1:178184689277:web:9d619ffbcdcf1cc960c314"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const storage = getStorage(app);
export const firestore = getFirestore(app);