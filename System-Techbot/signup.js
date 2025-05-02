import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js"
import { getFirestore, setDoc, doc, serverTimestamp  } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js"

    const firebaseConfig = {
    apiKey: "AIzaSyAfyXlKY-x2Fgrz20wYYXw7AAaK1kc3SVQ",
    authDomain: "techbot-56772.firebaseapp.com",
    projectId: "techbot-56772",
    storageBucket: "techbot-56772.appspot.com",
    messagingSenderId: "1008993231244",
    appId: "1:1008993231244:web:992aae95be7e56130776a9"
  };

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);

  window.db = db;
  window.firestoreFns = { setDoc, doc };
  


const passwordInput = document.getElementById("password");

document.addEventListener("DOMContentLoaded", function () {
    document.body.style.visibility = "visible";


    const termsCheckbox = document.getElementById("terms");
    const privacyCheckbox = document.getElementById("privacy");
    const inputFields = document.querySelectorAll("input, select, textarea");

    const emailInput = document.getElementById("email");
    const studentNumberInput = document.getElementById("StudentNumber");

    const generalError = document.getElementById("general-error");

    // Initialize checkbox states from localStorage
    ["terms", "privacy"].forEach(id => {
        const checkbox = document.getElementById(id);
        checkbox.checked = localStorage.getItem(`${id}Checked`) === "true";
        checkbox.addEventListener("change", () => {
            localStorage.setItem(`${id}Checked`, checkbox.checked);
        });
    });

    // URL param pre-check
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("agree") === "terms") termsCheckbox.checked = true;
    if (urlParams.get("agree") === "privacy") privacyCheckbox.checked = true;

    // Restore saved form values
    inputFields.forEach(input => {
        const saved = localStorage.getItem(input.id);
        if (saved) input.value = saved;

        input.addEventListener("input", function () {
            localStorage.setItem(input.id, this.value);
            this.style.borderColor = "#ccc";
        });
    });

    document.getElementById("section").addEventListener("change", function () {
        this.style.borderColor = "#ccc";
    });

    // Keyboard navigation
    document.addEventListener("keydown", function (event) {
        const inputs = Array.from(document.querySelectorAll('input, select, button'));
        const currentIndex = inputs.indexOf(document.activeElement);
        if (currentIndex === -1) return;

        if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
            event.preventDefault();
            if (currentIndex > 0) inputs[currentIndex - 1].focus();
        }
        if (event.key === "ArrowDown" || event.key === "ArrowRight") {
            event.preventDefault();
            if (currentIndex < inputs.length - 1) inputs[currentIndex + 1].focus();
        }
    });

    function showMessage(message, divId){
        var messageDiv=document.getElementById(divId);
        messageDiv.style.display="block";
        messageDiv.innerHTML=message;
        messageDiv.style.opacity=1;
        setTimeout(function(){
          messageDiv.style.opacity=0;
        }, 5000);
      }

    const signupButton = document.querySelector(".signup-btn");
    signupButton.addEventListener("click", (event)=>{
        event.preventDefault();
    
        const requiredInputs = [
            { id: "first-name" },
            { id: "last-name" },
            { id: "section" },
            { id: "StudentNumber", pattern: /^\d{6}$/ },
            { id: "email", pattern: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/ },
            { id: "password", pattern: /^.{8,}$/ }
        ];
    
        let allFilled = true;
        let firstInvalidField = null;
    
        requiredInputs.forEach(({ id, pattern }) => {
            const field = document.getElementById(id);
            const value = field.value.trim();
            if (!value || (pattern && !pattern.test(value))) {
                field.style.borderColor = "red";
                allFilled = false;
                if (!firstInvalidField) firstInvalidField = field;
            } else {
                field.style.borderColor = "#ccc";
            }
        });
    
        const passwordInput = document.getElementById("password");
        const confirmPasswordInput = document.getElementById("confirm-password");
    
        const password = passwordInput.value.trim();
        const confirmPassword = confirmPasswordInput.value.trim();
    
        if (confirmPassword === "" || confirmPassword !== password) {
            confirmPasswordInput.style.borderColor = "red";
            generalError.textContent = confirmPassword === ""
                ? "Confirm Password is required!"
                : "Passwords do not match!";
            generalError.style.color = "#a10000";
            generalError.style.display = "block";
            allFilled = false;
            if (!firstInvalidField) firstInvalidField = confirmPasswordInput;
        } else {
            confirmPasswordInput.style.borderColor = "#ccc";
        }
    
        if (!termsCheckbox.checked || !privacyCheckbox.checked) {
            generalError.textContent = !termsCheckbox.checked && !privacyCheckbox.checked
                ? "You must agree to Terms and Conditions and Privacy Policy."
                : !termsCheckbox.checked
                    ? "You must agree to Terms and Conditions."
                    : "You must agree to Privacy Policy.";
            generalError.style.display = "block";
            allFilled = false;
        }
    
        if (!allFilled) {
            if (!generalError.textContent) generalError.textContent = "You need to fill in all required fields correctly.";
            if (firstInvalidField) firstInvalidField.focus();
            return;
        }
    
        generalError.style.display = "none";
        document.getElementById("redirectModal").style.display = "block";

        const email = document.getElementById('email').value.trim(); 
        
        createUserWithEmailAndPassword(auth, email, password)
        .then(async (userCredential)=>{
        const user=userCredential.user;
        console.log("Created User ID:", user.uid);

        // Read input fields FRESH after successful signup
        const firstName = document.getElementById('first-name').value.trim();
        const lastName = document.getElementById('last-name').value.trim();
        const middleName = document.getElementById('middle-name').value.trim();
        const section = document.getElementById('section').value.trim();
        const StudentNumber = document.getElementById('StudentNumber').value.trim();
        


        const userData={
              email: email,
              firstName: firstName,
              lastName: lastName,
              middleName: middleName,
              section: section,
              StudentNumber: StudentNumber,
              createdAt: serverTimestamp()
            };

            console.log("Attempting to write user data", user.uid, userData);

           try {
        await setDoc(doc(db, "users", user.uid), userData);
        console.log("Success writing to Firestore");
        console.log("Data written:", userData);

   // 🔥 Add this: Show success message
   showMessage("Sign up successful! Redirecting to login...", "signUpMessage");

   // ✅ Now show the redirect modal after small delay (optional)
   setTimeout(() => {
       document.getElementById("redirectModal").style.display = "block";
   }, 1000);

} catch (firestoreError) {
   console.error("Failed to write to Firestore:", firestoreError);
   showMessage("Failed to save user data. Please try again.", "signUpMessage");
    }
    })

    .catch((error) => {
        console.error("Signup error:", error.code, error.message); // ADD THIS
        const errorCode = error.code;
        if (errorCode == 'auth/email-already-in-use') {
            showMessage('Email Address Already Exists!', 'signUpMessage');
        } else if (errorCode == 'auth/invalid-email') {
            showMessage('Invalid Email Address!', 'signUpMessage');
        } else if (errorCode == 'auth/weak-password') {
            showMessage('Password should be at least 6 characters!', 'signUpMessage');
        } else {
            showMessage('Unable to create User: ' + error.message, 'signUpMessage');
        }
    });    
    });

    function togglePassword(inputId, iconElement) {
        const passwordField = document.getElementById(inputId);
        const type = passwordField.type === "password" ? "text" : "password";
        passwordField.type = type;
    
        // Optionally toggle the eye icon
        iconElement.src = type === "password" ? "./images/eyehidden.png" : "./images/eyeshow.png";
    }
    

    // Email validation
    function validateEmail() {
        const message = document.getElementById("emailError");
        const value = emailInput.value.trim();
        const pattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        message.textContent = "";
        emailInput.style.borderColor = "#ccc";

        if (value === "") {
            emailInput.style.borderColor = "red";
            return false;
        } else if (!pattern.test(value)) {
            message.textContent = "Please enter a valid email address!";
            message.style.color = "#a10000";
            message.style.display = "block";
            emailInput.style.borderColor = "red";
            return false;
        }
        return true;
    }

    emailInput.addEventListener("input", validateEmail);

    // Student number validation
    function validateStudentNumber() {
        const message = document.getElementById("StudentNumberError");
        const value = studentNumberInput.value.trim();
        const pattern = /^\d{6}$/;

        if (value === "") {
            studentNumberInput.style.borderColor = "red";
            message.textContent = "";
            return false;
        } else if (!pattern.test(value)) {
            message.textContent = "Student Number must be exactly 6 digits!";
            message.style.color = "#a10000";
            studentNumberInput.style.borderColor = "red";
            return false;
        } else {
            message.textContent = "";
            studentNumberInput.style.borderColor = "#ccc";
            return true;
        }
    }

    studentNumberInput.addEventListener("input", validateStudentNumber);

    // Password requirements checker
    const passwordRequirements = document.querySelector('.password-requirements');
    const rules = {
        length: document.getElementById("length").querySelector("img"),
        uppercase: document.getElementById("uppercase").querySelector("img"),
        lowercase: document.getElementById("lowercase").querySelector("img"),
        number: document.getElementById("number").querySelector("img"),
        special: document.getElementById("special").querySelector("img"),
        noSpace: document.getElementById("no-space").querySelector("img"),
    };

    passwordInput.addEventListener("focus", () => {
        passwordRequirements.style.display = "block";
    });

    passwordInput.addEventListener("blur", () => {
        passwordRequirements.style.display = "none";
    });

    function validatePassword() {
        const value = passwordInput.value;
        const validations = {
            length: value.length >= 8,
            uppercase: /[A-Z]/.test(value),
            lowercase: /[a-z]/.test(value),
            number: /\d/.test(value),
            special: /[!@#$%^&*(),.?":{}|<>]/.test(value),
            noSpace: !/\s/.test(value),
        };

        for (let key in validations) {
            rules[key].src = validations[key]
                ? "https://cdn-icons-png.flaticon.com/512/14034/14034688.png"
                : "https://cdn-icons-png.flaticon.com/512/2217/2217292.png";
        }

        return Object.values(validations).every(v => v);
    }

    passwordInput.addEventListener("input", validatePassword);

    document.getElementById("confirm-password").addEventListener("input", function () {
        this.style.borderColor = this.value !== passwordInput.value ? "red" : "#ccc";
    });

    // Modal controls
    document.getElementById("cancelRedirect").addEventListener("click", function () {
        document.getElementById("redirectModal").style.display = "none";
    });
    document.getElementById("confirmRedirect").addEventListener("click", function () {
        localStorage.clear();
        window.location.href = "login.html";
    });
});
