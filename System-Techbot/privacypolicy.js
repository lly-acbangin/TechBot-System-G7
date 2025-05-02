document.addEventListener("DOMContentLoaded", function() {
    document.body.style.visibility = "visible";
});

document.querySelector("#yourRedirectButton").addEventListener("click", function() {
    document.body.style.opacity = 0;
    setTimeout(() => {
        window.location.href = "signup.html";
    }, 300); // Wait 300ms before redirecting
});
