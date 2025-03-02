import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

// Fetch Firebase config from the server
async function initializeFirebase() {
    try {
       const response = await fetch('http://localhost:5000/getFirebaseConfig');

        if (!response.ok) throw new Error("Failed to fetch Firebase config");
        const firebaseConfig = await response.json();

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

// Validate Name
function validateName(name) {
    const namePattern = /^[A-Za-z\s]+$/;
    return namePattern.test(name.trim()) ? null : "Name must contain only letters and spaces.";
}

// Attach event listeners for input validation
document.getElementById("firstname").addEventListener("input", (e) => {
    document.getElementById("firstname-error").textContent = validateName(e.target.value) || "";
});

document.getElementById("lastname").addEventListener("input", (e) => {
    document.getElementById("lastname-error").textContent = validateName(e.target.value) || "";
});

// Validate Password
function validatePassword(password) {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

    if (password.length < minLength) return "Password must be at least 8 characters long.";
    if (!hasUpperCase) return "Password must include at least one uppercase letter.";
    if (!hasLowerCase) return "Password must include at least one lowercase letter.";
    if (!hasNumber) return "Password must include at least one number.";
    if (!hasSpecialChar) return "Password must include at least one special character.";
    return null;
}

// Validate password input
document.getElementById("password").addEventListener("input", (e) => {
    document.getElementById("password-error").textContent = validatePassword(e.target.value) || "";
});

// Password toggle visibility
document.addEventListener("DOMContentLoaded", function () {
    const passwordInput = document.getElementById("password");
    const toggleIcon = document.getElementById("show-hide");

    toggleIcon.style.visibility = "visible";
    toggleIcon.addEventListener("click", function () {
        passwordInput.type = passwordInput.type === "password" ? "text" : "password";
        toggleIcon.textContent = passwordInput.type === "password" ? "👁️" : "🙈";
    });
});

// Sign-up event listener
document.getElementById("signup-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    console.log("Sign-up form submitted!");

    const firstname = document.getElementById("firstname").value.trim();
    const lastname = document.getElementById("lastname").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const confirmPassword = document.getElementById("confirmpassword").value.trim();

    console.log("Form data:", { firstname, lastname, email, password, confirmPassword });

    const firstNameError = validateName(firstname);
    const lastNameError = validateName(lastname);
    const passwordError = validatePassword(password);

    if (firstNameError || lastNameError || passwordError) {
        document.getElementById("firstname-error").textContent = firstNameError || "";
        document.getElementById("lastname-error").textContent = lastNameError || "";
        document.getElementById("password-error").textContent = passwordError || "";
        return;
    }

    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    try {
        if (!auth) {
            console.error("Firebase Auth is not initialized yet.");
            return;
        }

        console.log("Attempting to create user...");
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        console.log("User registered:", userCredential.user);
        alert("Signup successful! You can now log in.");
        window.location.href = "login.html";
    } catch (error) {
        console.error("Error during sign-up:", error);
        alert(error.message);
    }
});
