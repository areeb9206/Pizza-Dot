/**
 * REPLACE the placeholders with Firebase console > Project settings > Your apps > Web app.
 * IMPORTANT: Firebase API keys identify the project; they are not admin secrets.
 * Your REAL security comes from Realtime Database security rules + Firebase Auth.
 * Never put private service-account keys or admin SDK credentials here.
 */
export const firebaseConfig = {
  apiKey: "AIzaSyD7xDIFn5hUrBQaZQCYM0cak63-kC3Kne0",
  authDomain: "pizzadot-8cab8.firebaseapp.com",
  databaseURL: "https://pizzadot-8cab8-default-rtdb.firebaseio.com",
  projectId: "pizzadot-8cab8",
  storageBucket: "pizzadot-8cab8.firebasestorage.app",
  messagingSenderId: "341087099794",
  appId: "1:341087099794:web:619d6b84776c57273a7f4b",
  measurementId: "G-ZVG6DFKENJ"
};

export const businessConfig = {
  restaurantName: 'Pizza Dot',
  easypaisaNumber: '12345678910',
  // Change this to the EXACT name shown by Easypaisa after verifying ownership.
  easypaisaHolder: 'CONFIRM ACCOUNT HOLDER',
  notificationEmail: 'areebahmed200801@gmail.com',
  deliveryFee: 0,
  supportPhone: '03313001104',
  serviceAreas: ['Nazimabad', 'Liaquatabad', 'FC Area'],
  maxScreenshotBytes: 5 * 1024 * 1024
};
