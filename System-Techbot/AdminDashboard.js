let allLessons = [];
let allDrafts = [];

function loadContent(page) {
    const contentDiv = document.getElementById('content');
    contentDiv.innerHTML = ''; // Clear current content

    if (page === 'dashboard') {
        const now = new Date();
        const options = { 
            month: 'long', 
            day: 'numeric', 
            year: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit' 
        };
        const timestamp = now.toLocaleString('en-US', options);
        
        contentDiv.innerHTML = `
        <div class="summary">
            <h2>Summary of ${timestamp}</h2>
            <div class="stats-card">
                <canvas id="trendChart"></canvas>
            </div>
            <div class="chart-row">
                <div class="chart-container">
                    <canvas id="materialsChart"></canvas>
                </div>
                <div class="chart-container">
                    <canvas id="quizzesChart"></canvas>
                </div>
                <div class="chart-container">
                    <canvas id="studentsChart"></canvas>
                </div>
            </div>
        </div>
    ` // Initialize charts immediately if elements exist
    if (document.getElementById('trendChart')) {
        initCharts();
        }
        
    
    } else if (page === 'learningMaterials') {
        const { collection, getDocs } = window.firestoreFns;

        contentDiv.innerHTML = `
            <div class="search-bar">
                <input type="text" id="searchInput" placeholder="Search for lessons/drafts..." onkeypress="handleSearch(event)">
            </div>
            <div class="create-button">
                <button onclick="loadContent('createLesson')">+ Create</button>
            </div>
            <div class="drafts-section">
                <h2>Drafts</h2>
                <div id="draftsContainer">
                <p>Loading drafts...</p>
            </div>
            <div class="lessons-section">
                <h2>Lessons</h2>
               <div id="lessonsContainer">
                <p>Loading lessons...</p>
            </div>
                </div>
            </div>
            <div id="searchResult" class="no-data-found"></div>
        `;

        const lessonsContainer = document.getElementById('lessonsContainer');

    getDocs(collection(window.db, "lessons")).then((querySnapshot) => {
        let lessonsHtml = '';
        let draftsHtml = '';

        allLessons = [];
        

        querySnapshot.forEach((doc) => {
            const lesson = doc.data();
            allLessons.push(lesson);
            
            if(lesson.status === "draft"){
                draftsHtml += `
                <div class="lesson-button draft" onclick="openLessonPopup(${JSON.stringify(lesson).replace(/"/g, '&quot;')})">
                <h3>${lesson.title}</h3>
                <p>${lesson.description} | Starts: ${lesson.startDate} | Ends: ${lesson.endDate}</p>
                </div>
                `;

            } else{
              lessonsHtml += `
                <div class="lesson-button" onclick="openLessonPopup(${JSON.stringify(lesson).replace(/"/g, '&quot;')})"> 
                    <h3>${lesson.title}</h3>
                    <p>${lesson.description} | Starts: ${lesson.startDate} | Ends: ${lesson.endDate}</p>
                </div>
            `;
            }
        });

        document.getElementById('draftsContainer').innerHTML = draftsHtml || '<p class="no-data-found">No drafts yet.</p>';
        lessonsContainer.innerHTML = lessonsHtml || '<p class="no-data-found">No lessons yet.</p>';
    }).catch((error) => {
        console.error("Error fetching lessons:", error);
        lessonsContainer.innerHTML = '<p class="no-data-found">Failed to load lessons.</p>';
    });

} else if (page === 'createLesson') {
    contentDiv.innerHTML = `
        <div class="create-lesson-form">
            <h2>Create Lesson</h2>
            <form id="lessonForm" enctype="multipart/form-data">

                <div>
                    <label for="title">Add Title </label>
                    <input type="text" id="title" placeholder="Enter title" required>
                    <div class="error-message" id="titleError"></div>
                </div>
                <div>
                    <label for="description">Short Description (max 150 characters) </label>
                    <textarea id="description" placeholder="Enter short description..." maxlength="150" required></textarea>
                    <div id="descriptionCounter" style="text-align: right; font-size: 12px; color: gray;">0/150</div>
                    <div class="error-message" id="descriptionError"></div>
                </div>
                <div>
                     <label>Add the Lesson (max 3000 characters)</label>
                    <div class="toolbar">
                        <button type="button" onclick="format('bold')"><b>B</b></button>
                        <button type="button" onclick="format('italic')"><i>I</i></button>
                        <button type="button" onclick="format('underline')"><u>U</u></button>
                        <input type="color" id="fontColorPicker" onchange="changeColor()">
                    </div>
                    <div id="fullLesson" contenteditable="true" class="editable" style="border: 1px solid gray; padding: 10px; min-height: 150px;" required></div>
                    <div id="fullLessonCounter" style="text-align: right; font-size: 12px; color: gray;">0/3000</div>
                    <div class="error-message" id="fullLessonError"></div>
                </div>

                <div class="date-fields">
                    <div>
                        <label for="startDate">Start Date </label>
                        <input type="date" id="startDate" required>
                        <div class="error-message" id="startDateError"></div>
                    </div>
                    <div>
                        <label for="endDate">End Date </label>
                        <input type="date" id="endDate" required>
                        <div class="error-message" id="endDateError"></div>
                    </div>
                </div>
                    <div class="button-group">
                        <button type="button" class="save-draft">Save as Draft</button>
                        <button type="button" class="cancel">Cancel</button>
                        <button type="submit" class="save">Save</button>
                    </div>
            </form>
        </div>       
    `;

    const descriptionInput = document.getElementById('description');
    const descriptionCounter = document.getElementById('descriptionCounter');

    descriptionInput.addEventListener('input', function() {
    const currentLength = descriptionInput.value.length;
    descriptionCounter.textContent = `${currentLength}/150`;
    });

    const fullLessonInput = document.getElementById('fullLesson');
    const fullLessonCounter = document.getElementById('fullLessonCounter');

    fullLessonInput.addEventListener('input', function() {
    const currentLength = fullLessonInput.innerText.length;
    fullLessonCounter.textContent = `${currentLength}/3000`;
    });

        document.querySelector('.cancel')?.addEventListener('click', () => {
    if (confirm("Discard changes and go back to Learning Materials?")) {
        loadContent('learningMaterials');
    }
});

document.querySelector('.save-draft')?.addEventListener('click', () => {
    const title = document.getElementById('title').value.trim();
    const description = document.getElementById('description').value.trim();
    const fullLesson = document.getElementById('fullLesson').innerHTML.trim();
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;

    if (!title || !description || !fullLesson || !startDate || !endDate) {
        alert("Please complete all fields before saving as draft.");
        return;
    }
    
    const draftData = {
        title,
        description,
        fullLesson,
        startDate,
        endDate,
        status: "draft",
        timestamp: new Date()
    };

    const { collection, addDoc } = window.firestoreFns;

    addDoc(collection(window.db, "lessons"), draftData)
        .then(() => {
            alert("Lesson saved as draft.");
            loadContent('learningMaterials');
        })
        .catch((error) => {
            console.error("Error saving draft:", error);
            alert("Failed to save draft.");
        });
});


contentDiv.addEventListener('click', (e) => {
    if (e.target.classList.contains('save')) {
        e.preventDefault();
        validateForm();
    }
});


        const startDateInput = document.getElementById('startDate');
        const endDateInput = document.getElementById('endDate');

        // Set date range for start and end dates
        const today = new Date().toISOString().split('T')[0];
        const maxDate = '2026-12-31';

        startDateInput.setAttribute('min', today);
        startDateInput.setAttribute('max', maxDate);
        endDateInput.setAttribute('min', today);
        endDateInput.setAttribute('max', maxDate);


    } else if (page === 'quizzes') {
        contentDiv.innerHTML = `
        <div class="search-bar">
            <input type="text" id="quizSearchInput" placeholder="Search for quizzes..." onkeypress="handleQuizSearch(event)">
        </div>
        <div class="create-button">
            <button onclick="showQuizCreation()">+ Create</button>
        </div>
        <div class="quizzes-section">
            <h2>Created Quiz</h2>
            <!-- Space for quizzes (no rectangles yet) -->
        </div>
        <div id="quizSearchResult" class="no-data-found"></div>
    `;
    } else if (page === 'studentProgress') {
        contentDiv.innerHTML = `<h2>Student Progress Content Here</h2>`;
    }
}
function initCharts() {
    // Trend Chart (Students)
    new Chart(document.getElementById('trendChart'), {
        type: 'line',
        data: {
            labels: ['January', 'February', 'March'],
            datasets: [{
                data: [0, 10, 0],
                borderColor: '#0077b6',
                borderWidth: 3,
                pointBackgroundColor: '#48cae4',
                pointRadius: 5,
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false },
                title: {
                    display: true,
                    text: 'Student Registrations',
                    font: {
                        family: 'Poppins',
                        size: 16,
                        weight: 'bold'
                    },
                    color: '#000000'
                }
            },
            scales: {
                y: { beginAtZero: true },
                x: {
                    ticks: { color: '#000000' }
                }
            }
        }
    });

    // Pie Charts with new color palette
    const pieColors = ['#264653', '#2a9d8f', '#e9c46a', '#592e83'];
    
// Learning Materials
    new Chart(document.getElementById('materialsChart'), {
        type: 'pie',
        data: {
            labels: ['Java', 'C++', 'Python', 'VB.Net'],
            datasets: [{
                data: [5, 4, 3, 3],
                backgroundColor: pieColors,
                borderWidth: 0
            }]
        },
        options: getPieOptions('Learning Materials')
    });

// Quizzes
    new Chart(document.getElementById('quizzesChart'), {
        type: 'pie',
        data: {
            labels: ['Java', 'C++'],
            datasets: [{
                data: [2, 3],
                backgroundColor: [pieColors[0], pieColors[1]],
                borderWidth: 0
            }]
        },
        options: getPieOptions('Quizzes')
    });

// Students by Section
    new Chart(document.getElementById('studentsChart'), {
        type: 'pie',
        data: {
            labels: ['Grade 11-A', 'Grade 11-B', 'Grade 12-Y', 'Grade 12-Z'],
            datasets: [{
                data: [2, 3, 1, 4],
                backgroundColor: pieColors,
                borderWidth: 0
            }]
        },
        options: getPieOptions('Students by Section')
    });
}

// Shared pie chart options
function getPieOptions(title) {
    return {
        responsive: true,
        plugins: {
            legend: {
                labels: {
                    font: {
                        family: 'Poppins',
                        size: 14
                    },
                    color: '#000000'
                }
            },
            title: {
                display: true,
                text: title,
                font: {
                    family: 'Poppins',
                    size: 16,
                    weight: 'bold'
                },
                color: '#000000'
            }
        },
        animation: {
            animateScale: true,
            animateRotate: true
        }
    };
}

// Function to handle learning materials search
let debounceTimer;
function handleSearch(event) {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        if (event.key === 'Enter') {
            event.preventDefault();
            const searchQuery = document.getElementById('searchInput').value.trim().toLowerCase();
            const searchResultDiv = document.getElementById('searchResult');
            const draftsContainer = document.getElementById('draftsContainer');
            const lessonsContainer = document.getElementById('lessonsContainer');

            draftsContainer.innerHTML = '';
            lessonsContainer.innerHTML = '';
            searchResultDiv.innerHTML = '';

            let found = false;

            const filteredDrafts = allLessons.filter(lesson =>
                lesson.status === 'draft' &&
                (lesson.title.toLowerCase().includes(searchQuery) ||
                lesson.description.toLowerCase().includes(searchQuery))
            );

            const filteredLessons = allLessons.filter(lesson =>
                lesson.status !== 'draft' &&
                (lesson.title.toLowerCase().includes(searchQuery) ||
                lesson.description.toLowerCase().includes(searchQuery))
            );

            if (filteredDrafts.length > 0) {
                found = true;
                draftsContainer.innerHTML = filteredDrafts.map(draft => `
                    <div class="lesson-button draft" onclick="openLessonPopup(${JSON.stringify(draft).replace(/"/g, '&quot;')})">
                        <h3>${draft.title}</h3>
                        <p>${draft.description} | Starts: ${draft.startDate} | Ends: ${draft.endDate}</p>
                    </div>
                `).join('');
            } else {
                draftsContainer.innerHTML = '<p class="no-data-found">No drafts found.</p>';
            }

            if (filteredLessons.length > 0) {
                found = true;
                lessonsContainer.innerHTML = filteredLessons.map(lesson => `
                    <div class="lesson-button" onclick="openLessonPopup(${JSON.stringify(lesson).replace(/"/g, '&quot;')})">
                        <h3>${lesson.title}</h3>
                        <p>${lesson.description} | Starts: ${lesson.startDate} | Ends: ${lesson.endDate}</p>
                    </div>
                `).join('');
            } else {
                lessonsContainer.innerHTML = '<p class="no-data-found">No lessons found.</p>';
            }

            if (!found) {
                searchResultDiv.innerHTML = `<p>No results found for "${searchQuery}".</p>`;
            }
        }
    }, 300);
}

// CREATE  QUIZ FUNCTIONALITY
function showQuizCreation() {
    const contentDiv = document.getElementById('content');
    contentDiv.innerHTML = `
        <div class="quiz-creation-form">
            <div class="quiz-header">
                <h2>Create Quiz</h2>
            </div>
            <form id="quizForm">
                <div class="form-group">
                    <label for="quizTitle">Title of Quiz</label>
                    <input type="text" id="quizTitle" placeholder="Enter quiz title" required>
                    <div class="error-message" id="titleError"></div>
                </div>
                
                <div class="question-section">
                    <h3>Question 1</h3>
                    
                    <div class="form-group">
                        <label>Question Description</label>
                        <textarea id="questionDesc" placeholder="Type questions here" maxlength="3000" required></textarea>
                        <div class="char-counter">0/3000</div>
                        <div class="error-message" id="descError"></div>
                    </div>
                    
                    
                        <div class="option-group">
                            ${Array(4).fill().map((_, i) => `
                                <div class="option-box" data-index="${i}">
                                    <div class="correct-indicator o-icon">O</div>
                                    <div class="wrong-indicator x-icon">X</div>
                                    <textarea placeholder="Type answer here" class="option-input" required></textarea>
                                </div>
                            `).join('')}
                        </div>
                        <div class="error-message" id="optionsError"></div>
                    </div>
                    
                    <div class="timer-section">
                        <label>Time per question:</label>
                        <select id="questionTimer" required>
                            <option value="" disabled selected>Select time</option>
                            <option value="10">10 Seconds</option>
                            <option value="30">30 Seconds</option>
                            <option value="60">1 Minute</option>
                            <option value="180">3 Minutes</option>
                        </select>
                        <div class="error-message" id="timerError"></div>
                    </div>
                </div>
                
                <div class="form-actions">
                    <button type="button" class="back-btn">Back</button>
                    <button type="submit" class="next-btn">Next</button>
                </div>
            </form>
        </div>
    `;

    // Character counter for question description
    const descTextarea = document.getElementById('questionDesc');
    const charCounter = document.querySelector('.char-counter');
    descTextarea.addEventListener('input', () => {
        charCounter.textContent = `${descTextarea.value.length}/3000`;
    });

    // Option box selection logic
    document.querySelectorAll('.option-box').forEach(box => {
        box.addEventListener('click', (e) => {
            if (e.target.classList.contains('option-input')) return;
            
            const index = box.dataset.index;
            const isCorrect = box.querySelector('.o-icon').style.display === 'block';
            
            // Toggle correctness
            if (isCorrect) {
                box.querySelector('.o-icon').style.display = 'none';
                box.querySelector('.x-icon').style.display = 'block';
            } else {
                // Only one correct answer allowed
                document.querySelectorAll('.o-icon').forEach(icon => {
                    icon.style.display = 'none';
                });
                document.querySelectorAll('.x-icon').forEach(icon => {
                    icon.style.display = 'block';
                });
                
                box.querySelector('.o-icon').style.display = 'block';
                box.querySelector('.x-icon').style.display = 'none';
            }
        });
    });

    // Back button confirmation
    document.querySelector('.back-btn').addEventListener('click', () => {
        if (confirm('Do you want to lose progress?')) {
            loadContent('quizzes');
        }
    });

    // Form validation
    document.getElementById('quizForm').addEventListener('submit', (e) => {
        e.preventDefault();
        validateQuizForm();
    });
}

function validateQuizForm() {
    const title = document.getElementById('quizTitle').value.trim();
    const description = document.getElementById('questionDesc').value.trim();
    const timer = document.getElementById('questionTimer').value;
    const options = document.querySelectorAll('.option-input');
    
    let isValid = true;

    // Validate title
    if (!title) {
        document.getElementById('titleError').textContent = 'Quiz title is required';
        isValid = false;
    } else {
        document.getElementById('titleError').textContent = '';
    }

    // Validate description
    if (!description) {
        document.getElementById('descError').textContent = 'Question description is required';
        isValid = false;
    } else {
        document.getElementById('descError').textContent = '';
    }

    // Validate at least one correct answer
    const hasCorrectAnswer = Array.from(document.querySelectorAll('.o-icon'))
        .some(icon => icon.style.display === 'block');
    
    if (!hasCorrectAnswer) {
        document.getElementById('optionsError').textContent = 'Please mark at least one correct answer';
        isValid = false;
    } else {
        document.getElementById('optionsError').textContent = '';
    }

    // Validate all options have text
    let optionsValid = true;
    options.forEach((opt, i) => {
        if (!opt.value.trim()) {
            optionsValid = false;
        }
    });
    
    if (!optionsValid) {
        document.getElementById('optionsError').textContent = 'All answer options must be filled';
        isValid = false;
    }

    // Validate timer
    if (!timer) {
        document.getElementById('timerError').textContent = 'Please select a time limit';
        isValid = false;
    } else {
        document.getElementById('timerError').textContent = '';
    }

    if (isValid) {
        // Save quiz data and proceed
        alert('Quiz question saved!');
        // Here you would typically save to Firestore
    }
}



// Function to handle quiz search
function handleQuizSearch(event) {
    if (event.key === 'Enter') {
        const searchQuery = document.getElementById('quizSearchInput').value;
        const searchResultDiv = document.getElementById('quizSearchResult');
        if (searchQuery.trim() === '') {
            searchResultDiv.textContent = 'Please enter a search term.';
        } else {
            searchResultDiv.textContent = 'No data found.';
        }
    }
}


// Function to validate the form
async function validateForm() {
    const titleInput = document.getElementById('title');
    const descriptionInput = document.getElementById('description');
    const fullLessonInput = document.getElementById('fullLesson');
    const startDateInput = document.getElementById('startDate');
    const endDateInput = document.getElementById('endDate');

    let isValid = true;

    if (!titleInput.value.trim()) {
        document.getElementById('titleError').textContent = 'This field is required.';
        titleInput.classList.add('error-field');
        isValid = false;
    } else {
        document.getElementById('titleError').textContent = '';
        titleInput.classList.remove('error-field');
    }

    if (!descriptionInput.value.trim()) {
        document.getElementById('descriptionError').textContent = 'This field is required.';
        descriptionInput.classList.add('error-field');
        isValid = false;
    } else {
        document.getElementById('descriptionError').textContent = '';
        descriptionInput.classList.remove('error-field');
    }

    if (!fullLessonInput.innerHTML.trim()) {
        document.getElementById('fullLessonError').textContent = 'This field is required.';
        fullLessonInput.classList.add('error-field');
        isValid = false;
    } else {
        document.getElementById('fullLessonError').textContent = '';
        fullLessonInput.classList.remove('error-field');
    }

    if (!startDateInput.value) {
        document.getElementById('startDateError').textContent = 'This field is required.';
        startDateInput.classList.add('error-field');
        isValid = false;
    } else {
        document.getElementById('startDateError').textContent = '';
        startDateInput.classList.remove('error-field');
    }

    if (!endDateInput.value) {
        document.getElementById('endDateError').textContent = 'This field is required.';
        endDateInput.classList.add('error-field');
        isValid = false;
    } else {
        document.getElementById('endDateError').textContent = '';
        endDateInput.classList.remove('error-field');
    }

    if (isValid) {

        const lessonData = {
            title: titleInput.value,
            description: descriptionInput.value,
            fullLesson: fullLessonInput.innerHTML,
            startDate: startDateInput.value,
            endDate: endDateInput.value,
            timestamp: new Date()
                     
        
        };
    
        const { collection, addDoc } = window.firestoreFns;
    
        addDoc(collection(window.db, "lessons"), lessonData)
            .then(() => {
                alert("Lesson saved to database!");
                loadContent('learningMaterials'); // Redirect back to view
            })
            .catch((error) => {
                console.error("Error adding lesson:", error);
                alert("Failed to save lesson.");
            });
    }
    
}

function openLessonPopup(lesson) {
    const existingPopup = document.getElementById('lessonPopup');
    if (existingPopup) existingPopup.remove();

    const popup = document.createElement('div');
    popup.id = 'lessonPopup';
    popup.classList.add('popup-overlay');
    popup.innerHTML = `
        <div class="lesson-popup-container">
            <div class="lesson-popup-header">
                <h2>${lesson.title}</h2>
                <button class="popup-close" onclick="closeLessonPopup()">×</button>
            </div>
            <div class="lesson-popup-body">
                ${lesson.fullLesson ? lesson.fullLesson.replace(/\n/g, '<br>') : '<i>No lesson content available.</i>'}
            </div>
        </div>
    `;
    document.body.appendChild(popup);
}


function closeLessonPopup() {
    const popup = document.getElementById('lessonPopup');
    if (popup) popup.remove();
}


function format(command) {
    document.execCommand(command, false, null);
}

function changeColor() {
    const color = document.getElementById('fontColorPicker').value;
    document.execCommand('foreColor', false, color);
}

function initCreateLessonEvents() {
    const descriptionInput = document.getElementById('description');
    const descriptionCounter = document.getElementById('descriptionCounter');

    descriptionInput.addEventListener('input', function() {
        descriptionCounter.textContent = `${this.value.length}/150`;
    });

    const today = new Date().toISOString().split('T')[0];
    const maxDate = '2026-12-31';
    const startDateInput = document.getElementById('startDate');
    const endDateInput = document.getElementById('endDate');
    startDateInput.setAttribute('min', today);
    endDateInput.setAttribute('min', today);
    startDateInput.setAttribute('max', maxDate);
    endDateInput.setAttribute('max', maxDate);

    document.querySelector('.cancel')?.addEventListener('click', () => {
        if (confirm("Discard changes and go back to Learning Materials?")) {
            loadContent('learningMaterials');
        }
    });
}
  



// Load default content
loadContent('dashboard');