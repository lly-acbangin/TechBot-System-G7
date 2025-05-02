const newPassword = document.getElementById('new-password');
newPassword.addEventListener('input', () => {
  const value = newPassword.value;
  const check = 'https://cdn-icons-png.flaticon.com/512/1904/1904116.png';
  const cross = 'https://cdn-icons-png.flaticon.com/512/1828/1828778.png';

  document.querySelector('#length img').src = value.length >= 8 ? check : cross;
  document.querySelector('#case img').src = /[a-z]/.test(value) && /[A-Z]/.test(value) ? check : cross;
  document.querySelector('#number img').src = /\d/.test(value) ? check : cross;
  document.querySelector('#special img').src = /[!@#$%^&*(),.?":{}|<>]/.test(value) ? check : cross;
  document.querySelector('#space img').src = /\s/.test(value) ? cross : check;
});


    const requirements = document.querySelector('.password-requirements');
  
    newPassword.addEventListener('focus', () => {
      requirements.style.display = 'block';
    });
  
    newPassword.addEventListener('blur', () => {
      requirements.style.display = 'none';
    });
    
    newPassword.addEventListener('input', () => {
  const value = newPassword.value;
  const check = 'https://cdn-icons-png.flaticon.com/512/14034/14034688.png';
  const cross = 'https://cdn-icons-png.flaticon.com/512/2217/2217292.png';

  document.querySelector('#length img').src = value.length >= 8 ? check : cross;
  document.querySelector('#case img').src = /[a-z]/.test(value) && /[A-Z]/.test(value) ? check : cross;
  document.querySelector('#number img').src = /\d/.test(value) ? check : cross;
  document.querySelector('#special img').src = /[!@#$%^&*(),.?":{}|<>]/.test(value) ? check : cross;
  document.querySelector('#space img').src = /\s/.test(value) ? cross : check;
});

function togglePassword(fieldId, icon) {
  const input = document.getElementById(fieldId);
  const showIcon = 'https://cdn-icons-png.flaticon.com/512/4298/4298899.png';
  const hideIcon = 'https://cdn-icons-png.flaticon.com/512/565/565655.png';

  if (input.type === 'password') {
    input.type = 'text';
    icon.src = showIcon;
  } else {
    input.type = 'password';
    icon.src = hideIcon;
  }
}

function showRequirements() {
  document.getElementById('requirements').style.display = 'block';
}

const inputs = document.querySelectorAll('.otp-inputs input');

inputs.forEach((input, index) => {
  input.addEventListener('input', () => {
    if (input.value.length === 1 && index < inputs.length - 1) {
      inputs[index + 1].focus();
    }
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Backspace' && input.value === '' && index > 0) {
      inputs[index - 1].focus();
    }
  });
});


document.querySelector('.cancel-btn').addEventListener('click', () => {
  window.location.href = 'MainHomepage.html';
});


document.querySelector('.verify-btn').addEventListener('click', () => {
  const otpCode = Array.from(inputs).map(input => input.value).join('');
  if (otpCode.length === 6) {
    alert('OTP Verified: ' + otpCode);
  } else {
    alert('Please enter all 6 digits');
  }
});


document.addEventListener("DOMContentLoaded", function () {
  const modal = document.getElementById("saveChangesModal");
  if (modal) {
    modal.style.display = "none"; 
  }
});

function openModal() {
  document.getElementById("saveChangesModal").style.display = "flex";
}

function closeModal() {
  document.getElementById("saveChangesModal").style.display = "none";
}

document.addEventListener("DOMContentLoaded", function () {
  const saveBtn = document.querySelector(".save-btn");
  if (saveBtn) {
    saveBtn.addEventListener("click", openModal);
  }
});



function showConfirmationModal() {
  document.getElementById("confirmationModal").style.display = "flex";
}


function closeConfirmationModal() {
  document.getElementById("saveChangesModal").style.display = "none";
}

document.querySelector(".confirm-btn").addEventListener("click", function () {
  document.getElementById("saveChangesModal").style.display = "none";
});

