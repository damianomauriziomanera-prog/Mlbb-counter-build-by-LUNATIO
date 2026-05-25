/// <reference types="vite/client" />
import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

// Inserisci qui i dati del tuo progetto Firebase (prendili da console.firebase.google.com)
// Per sicurezza, in produzione dovresti usare variabili d'ambiente (import.meta.env.VITE_FIREBASE_API_KEY)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBohpmm2HaaSs4MFTxCifUvxj72GEEmifk",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "mlbb-counter-build.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "mlbb-counter-build",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "mlbb-counter-build.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "449940224601",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:449940224601:web:b8ce229d93217594abcf48"
};

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let googleProvider: GoogleAuthProvider | null = null;

try {
  // Inizializza solo se c'è un'API Key valida o non siamo in modalità mock
  if (firebaseConfig.apiKey && firebaseConfig.apiKey !== "INSERISCI_API_KEY") {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    googleProvider = new GoogleAuthProvider();
  } else {
    console.warn("Firebase non configurato. L'app userà il LocalStorage per i salvataggi.");
  }
} catch (error) {
  console.error("Errore nell'inizializzazione di Firebase:", error);
}

export { app, auth, db, googleProvider };
