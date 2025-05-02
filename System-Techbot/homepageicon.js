document.addEventListener('DOMContentLoaded', function() {
    auth.onAuthStateChanged(async (user) => {
        if (user) {
          // Get user ID
          const uid = user.uid;
          try {
            // load user data 
            const docRef = db.collection('users').doc(uid);
            const doc = await docRef.get();

            // NEW!
            if (doc.exists) {
              const userData = doc.data();
              const userNameElement = document.querySelector('.user-name');
              if (userNameElement) {
                  userNameElement.innerHTML = `<strong>${userData.lastName}, ${userData.firstName}</strong>`;
              }
          } else {
              console.log("No user document found!");
          }
          // END!

          // NEW!
          const lessonsList = document.getElementById('lessons-list');
                if (!lessonsList) {
                    console.error("Lessons list element not found!");
                    return;
                }
          // END!

          // NEW!
          const unsubscribe = db.collection('lessons')
                    .orderBy('createdAt', 'desc')
                    .onSnapshot(
                        (snapshot) => {
                            lessonsList.innerHTML = '';
                            
                            if (snapshot.empty) {
                                lessonsList.innerHTML = '<p>No lessons available yet.</p>';
                                return;
                            }
                            
                            snapshot.forEach((doc) => {
                                const lesson = doc.data();
                                const lessonElement = document.createElement('div');
                                lessonElement.className = 'lesson-card';
                                lessonElement.innerHTML = `
                                    <h3>${lesson.title || 'Untitled Lesson'}</h3>
                                    <p>${lesson.content || 'No content available'}</p>
                                    ${lesson.imageUrl ? `<img src="${lesson.imageUrl}" alt="Lesson image">` : ''}
                                    <small>Posted: ${
                                        lesson.createdAt?.toDate()?.toLocaleString() || 'Unknown date'
                                    }</small>
                                `;
                                lessonsList.appendChild(lessonElement);
                            });
                        },
                        (error) => {
                            console.error("Error loading lessons:", error);
                            if (lessonsList) {
                                lessonsList.innerHTML = '<p>Error loading lessons. Please try again.</p>';
                            }
                        }
                    );

          // END!
          
          // NEW! Cleanup listener when needed
          window.addEventListener('beforeunload', () => {
            unsubscribe();
        });
          // END!

          } catch (error) {
            console.error("Error getting document:", error);
            
          }
        } else {
          // No user is signed in, redirect to login
          window.location.href = "login.html";
        }
      });
   
    const searchButton = document.querySelector('.search-button');
    const searchInput = document.querySelector('.search-input');
    const authLinks = document.querySelectorAll('.auth-link');
    const searchMessage = document.getElementById('searchMessage');
    
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
    
    
    const chatbotIcon = document.querySelector(".chatbot-icon img");
    chatbotIcon.addEventListener("click", () => {
        alert("TechBot is currently under development!");
    });

});

function toggleDropdown() {
    const menu = document.getElementById("dropdownMenu");
    menu.style.display = menu.style.display === "block" ? "none" : "block";
}


document.addEventListener("click", function (event) {
    const profile = document.querySelector(".profile");
    const menu = document.getElementById("dropdownMenu");

    if (!profile.contains(event.target) && !menu.contains(event.target)) {
        menu.style.display = "none";
    }
});

document.getElementById("achievementbtn").addEventListener("click", function () {
    window.location.href = "AchievementPage.html"; 
});


const signOutBtn = document.getElementById("signOutBtn");
const signOutModal = document.getElementById("signOutModal");
const cancelSignOut = document.getElementById("cancelSignOut");
const confirmSignOut = document.getElementById("confirmSignOut");


signOutBtn.addEventListener("click", (e) => {
    e.preventDefault(); 
    signOutModal.style.display = "flex";
});


cancelSignOut.addEventListener("click", () => {
    signOutModal.style.display = "none";
});

confirmSignOut.addEventListener("click", () => {
    auth.signOut().then(() => {
      window.location.href = "login.html";
    }).catch((error) => {
      console.error("Sign out error", error);
    });
  });
  


