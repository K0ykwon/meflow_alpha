import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyArBehpzpmbbeoLkR6Z68LDx44BurrRLHA",
  authDomain: "meflow-1d14e.firebaseapp.com",   
  databaseURL: "https://meflow-1d14e-default-rtdb.firebaseio.com/",
  projectId: "meflow-1d14e",
  storageBucket: "meflow-1d14e.firebasestorage.app",
  messagingSenderId: "841315589174",
  appId: "1:841315589174:web:ed058f737b2da475008c97",
  measurementId: "G-FE4LZ0GT8Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);


export { database };