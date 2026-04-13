const firebaseConfig = {
  apiKey:            "AIzaSyBH_NH179hLMRwamkmL_VstHUhgbHEqJS8",
  authDomain:        "bilaler-randevu.firebaseapp.com",
  projectId:         "bilaler-randevu",
  storageBucket:     "bilaler-randevu.firebasestorage.app",
  messagingSenderId: "842612101577",
  appId:             "1:842612101577:web:b7ea42c8d049b492ca1818",
  measurementId:     "G-6DNMCK2LMH"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
