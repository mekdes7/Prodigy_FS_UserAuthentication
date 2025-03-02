
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
async function initializeFirebase() {
    try {
        const response = await fetch('http://localhost:5000/getFirebaseConfig');
        if (!response.ok) throw new Error("Failed to fetch Firebase config");

        const firebaseConfig = await response.json();
        console.log("Firebase Config:", firebaseConfig); // ✅ Debugging

        // Initialize Firebase
        const app = initializeApp(firebaseConfig);
        const auth = getAuth(app);
        console.log("Firebase initialized successfully!");
        return auth;
    } catch (error) {
        console.error("Error initializing Firebase:", error);
    }
}

// Call initializeFirebase and store auth globally
let auth;
initializeFirebase().then((firebaseAuth) => {
    auth = firebaseAuth;
});


document.getElementById("login-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        console.log("Attempting to log in...");
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log("User logged in:", userCredential.user);
        alert("Login successful!");

     
        window.location.href = "/Food Ordering System/fOS/Food_Ordering.html";
    } catch (error) {
        console.error("Login failed:", error);
        alert("Login failed: " + error.message);
    }
});