// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDN-D2ppaXbjT_rT74d2dXaOtWqib3zBQ0",
    authDomain: "stock-material-28674.firebaseapp.com",
    databaseURL: "https://stock-material-28674-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "stock-material-28674",
    storageBucket: "stock-material-28674.firebasestorage.app",
    messagingSenderId: "994809951058",
    appId: "1:994809951058:web:31d0cd19f4dcf49b84408b"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);

// Referencias a Firebase
const database = firebase.database();
console.log('Firebase inicializado correctamente:', database);