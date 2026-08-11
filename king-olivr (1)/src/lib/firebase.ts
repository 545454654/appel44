import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, onValue } from 'firebase/database';

export const firebaseConfig = {
  apiKey: "AIzaSyAVUQQMS2pvCfmmr8F0nfmEbXH1UhFZNYQ",
  authDomain: "swtyyyy-6ca13.firebaseapp.com",
  databaseURL: "https://swtyyyy-6ca13-default-rtdb.firebaseio.com",
  projectId: "swtyyyy-6ca13",
  storageBucket: "swtyyyy-6ca13.firebasestorage.app",
  messagingSenderId: "1094753151167",
  appId: "1:1094753151167:web:19f0a686a7401612abfe0a",
  measurementId: "G-HN3JJYZSEE"
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);
export const rtdb = getDatabase(firebaseApp);

export { ref, set, onValue };
