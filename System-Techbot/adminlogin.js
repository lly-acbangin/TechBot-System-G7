const firebaseConfig = {
  apiKey: "AIzaSyAfyXlKY-x2Fgrz20wYYXw7AAaK1kc3SVQ",
  authDomain: "techbot-56772.firebaseapp.com",
  projectId: "techbot-56772",
  storageBucket: "techbot-56772.appspot.com",
  messagingSenderId: "1008993231244",
  appId: "1:1008993231244:web:992aae95be7e56130776a9"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();


document.addEventListener("DOMContentLoaded", () => {
    document.body.style.visibility = "visible";
});
const forgotPasswordLink = document.getElementById("forgotPasswordLink");
const loginForm = document.getElementById("loginForm");
const forgotPasswordSection = document.getElementById("forgotPasswordSection");
const usernameForm = document.getElementById("usernameForm");
const securityQuestionForm = document.getElementById("securityQuestionForm");
const newPasswordForm = document.getElementById("newPasswordForm");
const successMessage = document.getElementById("successMessage");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  
  console.log("Attempting login with", username); // Add this

  try {
    const adminRef = db.collection("admins");
    const snapshot = await adminRef.where("username", "==", username).limit(1).get();
    
    if (snapshot.empty) {
      console.log("No admin found with that username");
      alert("Invalid username or password!");
      return;
    }
    
    const adminData = snapshot.docs[0].data();
    console.log("Admin data found:", adminData); // Add this

    if (adminData.password === password) {
      alert("Login successful!");
      window.location.href = "AdminDashboard.html";
    } else {
      alert("Invalid username or password!");
    }
  } catch (error) {
    console.error("Login error:", error);
    alert("An error occurred. Please try again.");
  }
});

// When clicking "Forgot Password"
forgotPasswordLink.addEventListener("click", (e) => {
    e.preventDefault();
    loginForm.classList.add("hidden"); // Hide login form
    forgotPasswordSection.classList.remove("hidden"); // Show forgot password section
  });
  
  // Step 1: Get the username
usernameForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = document.getElementById("resetUsername").value.trim();

  try {
      const snapshot = await db.collection("admins").where("username", "==", username).limit(1).get();

      if (snapshot.empty) {
          alert("Username not found!");
          return;
      }

      // Proceed to step 2
      securityQuestionForm.classList.remove("hidden");
      usernameForm.classList.add("hidden");
  } catch (error) {
      console.error("Error fetching user by username:", error);
      alert("An error occurred. Please try again.");
  }
});

// Step 2: Verify the security question answer
securityQuestionForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const answer = document.getElementById("securityAnswer").value.trim();

  // Check if the answer is correct (we know it's "techbot")
  if (answer.toLowerCase() === "techbot") {
      newPasswordForm.classList.remove("hidden");
      securityQuestionForm.classList.add("hidden");
  } else {
      alert("Incorrect answer. Please try again.");
  }
});

// Step 3: Reset the password
newPasswordForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const newPwd = document.getElementById("newPwd").value.trim();
  const confirmPwd = document.getElementById("confirmPwd").value.trim();

  if (newPwd !== confirmPwd) {
      alert("Passwords do not match!");
      return;
  }

  try {
      const username = document.getElementById("resetUsername").value.trim();
      const userRef = await db.collection("admins").where("username", "==", username).limit(1).get();

      if (!userRef.empty) {
          const userDoc = userRef.docs[0];
          await userDoc.ref.update({ password: newPwd });
          successMessage.classList.remove("hidden");
          newPasswordForm.classList.add("hidden");

          // Redirect back to login page after success
          setTimeout(() => {
              window.location.href = "/adminlogin.html";  // Replace with your actual login page URL
          }, 2000); // Wait 2 seconds before redirecting
      } else {
          alert("User not found!");
      }
  } catch (error) {
      console.error("Error resetting password:", error);
      alert("An error occurred. Please try again.");
  }
});

function togglePassword(inputId, icon) {
    const input = document.getElementById(inputId);
    const isPassword = input.type === "password";

    input.type = isPassword ? "text" : "password";
    icon.src = isPassword ? "./images/eyeview.png" : "./images/eyehidden.png";
}