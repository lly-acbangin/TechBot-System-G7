function togglePassword(inputId, eyeIcon) {
    let passwordInput = document.getElementById(inputId);

    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        eyeIcon.src = "./images/eyeview.png"; 
    } else {
        passwordInput.type = "password";
        eyeIcon.src = "./images/eyehidden.png"; 
    }
}

function validateStudentNumber() {
    let StudentNumberInput = document.getElementById("StudentNumber");
    let StudentNumberMessage = document.getElementById("StudentNumberError");
    let StudentNumberPattern = /^\d{6}$/;

    if (StudentNumberInput.value.trim() === "") {
        StudentNumberMessage.textContent = "";
    } else if (!StudentNumberPattern.test(StudentNumberInput.value)) {
        StudentNumberMessage.textContent = "Student Number must be exactly 6 digits!";
    } else {
        StudentNumberMessage.textContent = ""; 
    }
}

function validateEmail() {
    let emailInput = document.getElementById("email");
    let emailMessage = document.getElementById("emailError");
    let emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (emailInput.value.trim() === "") {
        emailMessage.textContent = "";
    } else if (!emailPattern.test(emailInput.value)) {
        emailMessage.textContent = "Please enter a valid email address!";
    } else {
        emailMessage.textContent = ""; 
    }
}

document.getElementById("StudentNumber").addEventListener("input", validateStudentNumber);
document.getElementById("StudentNumber").addEventListener("blur", validateStudentNumber); 

document.getElementById("email").addEventListener("input", validateEmail);
document.getElementById("email").addEventListener("blur", validateEmail);

document.addEventListener("DOMContentLoaded", function() {
    document.body.style.visibility = "visible";
});

const forgotPasswordLink = document.getElementById("forgotPasswordLink");
const loginForm = document.getElementById("loginForm");
const forgotPasswordSection = document.getElementById("forgotPasswordSection");
const emailForm = document.getElementById("emailForm");
const otpForm = document.getElementById("otpForm");
const passwordForm = document.getElementById("passwordForm");
const successMessage = document.getElementById("successMessage");

// Show Forgot Password Section
forgotPasswordLink.addEventListener("click", (e) => {
    e.preventDefault();
    loginForm.classList.add("hidden");
    forgotPasswordSection.classList.remove("hidden");
});

// Step 1: Send OTP
emailForm.addEventListener("submit", (e) => {
    e.preventDefault();
    alert("OTP sent to your email!");
    emailForm.classList.add("hidden");
    otpForm.classList.remove("hidden");
});

// Step 2: Verify OTP
otpForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const otp = document.getElementById("otp").value;
    if (otp === "123456") { // Simulated OTP
        otpForm.classList.add("hidden");
        passwordForm.classList.remove("hidden");
    } else {
        alert("Invalid OTP. Please try again.");
    }
});

// Step 3: Change Password
passwordForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const newPassword = document.getElementById("newPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (newPassword !== confirmPassword) {
        alert("Passwords do not match!");
    } else {
        passwordForm.classList.add("hidden");
        successMessage.classList.remove("hidden");

        setTimeout(() => {
            successMessage.classList.add("hidden");
            forgotPasswordSection.classList.add("hidden");
            loginForm.classList.remove("hidden");
        }, 2000);
    }
});

auth.signInWithEmailAndPassword(email, password)
  .then((userCredential) => {
    // Redirect to homepage
    window.location.href = "MainHomepage.html";
  })
  .catch((error) => {
    console.error(error.message);
  });


// Toggle Password Visibility
function togglePassword(inputId, icon) {
    const input = document.getElementById(inputId);
    const isPassword = input.type === "password";

    input.type = isPassword ? "text" : "password";
    icon.src = isPassword ? "./images/eyeview.png" : "./images/eyehidden.png";
}
