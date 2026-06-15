import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCr0xPdRMniiPjktern5BpzZN4Eyhb7Osw",
  authDomain: "mellow-minis-hub.firebaseapp.com",
  projectId: "mellow-minis-hub",
  storageBucket: "mellow-minis-hub.firebasestorage.app",
  messagingSenderId: "668704711609",
  appId: "1:668704711609:web:9ed49994f5e8760468cc68"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
