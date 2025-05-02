document.addEventListener('DOMContentLoaded', function() {
    const searchButton = document.querySelector('.search-button');
    const searchInput = document.querySelector('.search-input');
    const authLinks = document.querySelectorAll('.auth-link');
    const searchMessage = document.getElementById('searchMessage');
    const chatbotIcon = document.querySelector(".chatbot-icon img");
    
    // Clear search input and message when clicked
    searchInput.addEventListener('click', function() {
        this.value = '';
        this.classList.remove('highlight');
        searchMessage.textContent = '';
    });
    
    // Search functionality
    searchButton.addEventListener('click', function() {
        performSearch();
    });
    
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
    
    function performSearch() {
        const searchTerm = searchInput.value.trim();
        if (searchTerm) {
            // Highlight the input
            searchInput.classList.add('highlight');
            
            // Show message with the searched term
            searchMessage.innerHTML = `To access <span class="highlight-term">"${searchTerm}"</span> you'll need to Log in first`;
        } else {
            searchMessage.textContent = 'Please enter a search term';
        }
    }
    
    // Auth links functionality (placeholder)
    authLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            console.log(`${e.target.textContent} link clicked`);
       // Navigate to the login page
       window.location.href = '/login'; // Replace '/login' with your actual login page URL
    });
    });
});
    

   
    chatbotIcon.addEventListener("click", () => {
        alert("TechBot is currently under development!");
    });
