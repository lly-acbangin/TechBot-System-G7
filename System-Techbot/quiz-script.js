
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

const questions = [
    { question: "What does HTML stand for?", options: ["HyperText Markup Language", "High Tech Modern Language", "HyperText Modern Logic", "Home Tool Markup Language"], answer: "HyperText Markup Language" },
    { question: "What is the primary purpose of CSS?", options: ["To create web content", "To style and layout web pages", "To connect databases", "To manage web servers"], answer: "To style and layout web pages" },
    { question: "Which symbol is used for comments in JavaScript?", options: ["#", "//", "/* */", "--"], answer: "//" },
    { question: "What keyword is used to declare a variable in JavaScript?", options: ["var", "declare", "int", "def"], answer: "var" },
    { question: "Which function is used to display text in the console in JavaScript?", options: ["print()", "echo()", "console.log()", "display()"], answer: "console.log()" },
    { question: "Which function is used to display text in the console in JavaScript?", options: ["print()", "echo()", "console.log()", "display()"], answer: "console.log()" },
    { question: "Which function is used to display text in the console in JavaScript?", options: ["print()", "echo()", "console.log()", "display()"], answer: "console.log()" },
    { question: "Which function is used to display text in the console in JavaScript?", options: ["print()", "echo()", "console.log()", "display()"], answer: "console.log()" },
    { question: "Which function is used to display text in the console in JavaScript?", options: ["print()", "echo()", "console.log()", "display()"], answer: "console.log()" },
    { question: "Which function is used to display text in the console in JavaScript?", options: ["print()", "echo()", "console.log()", "display()"], answer: "console.log()" },

];


shuffleArray(questions);
questions.forEach(question => shuffleArray(question.options));

let currentQuestion = 0;
let score = 0;

const questionBox = document.getElementById("question-box");
const optionsContainer = document.getElementById("answer-options");
const scoreDisplay = document.getElementById("score-display");
const quizNumberDisplay = document.getElementById("quiz-number");
const progressBar = document.getElementById("progress-bar");
const resultContainer = document.getElementById("result-container"); 
const robotImage = document.getElementById("robot-image");
const resultMessage = document.getElementById("result-message");


function initializeProgressBar() {
    progressBar.innerHTML = "";
    for (let i = 0; i < questions.length; i++) {
        const step = document.createElement("div");
        step.classList.add("progress-step");
        progressBar.appendChild(step);
    }
}


function updateQuizNumber() {
    quizNumberDisplay.textContent = `${currentQuestion + 1}/${questions.length}`;
}


function loadQuestion() {
    const current = questions[currentQuestion];
    questionBox.textContent = current.question;
    optionsContainer.innerHTML = "";
    current.options.forEach(option => {
        const btn = document.createElement("button");
        btn.classList.add("option");
        btn.textContent = option;
        btn.addEventListener("click", () => checkAnswer(option, btn));
        optionsContainer.appendChild(btn);
    });
    updateQuizNumber(); 
}


function checkAnswer(selectedOption, selectedButton) {
    const correctAnswer = questions[currentQuestion].answer;
    const progressSteps = document.querySelectorAll(".progress-step");


    const optionButtons = document.querySelectorAll(".option");
    optionButtons.forEach(button => {
        if (button.textContent === correctAnswer) {
            button.classList.add("correct"); 
        }
    });

 
    if (selectedOption === correctAnswer) {
        score++;
        progressSteps[currentQuestion].classList.add("correct");
    } else {
        selectedButton.classList.add("incorrect"); 
        progressSteps[currentQuestion].classList.add("incorrect");
    }

    optionButtons.forEach(button => {
        button.disabled = true;
    });

    scoreDisplay.textContent = `${score}/${questions.length}`;
    setTimeout(moveToNextQuestion, 1000);
}

// Move to Next Question
function moveToNextQuestion() {
    if (currentQuestion < questions.length - 1) {
        currentQuestion++;
        loadQuestion();
    } else {
        displayResults(); 
    }
}


function displayResults() {
  
    document.getElementById("quiz-container").style.display = "none";

    
    resultContainer.style.display = "block";

  
    const scoreDisplay = document.getElementById("score");
    if (scoreDisplay) {
        scoreDisplay.textContent = `${score} / ${questions.length}`;
    }

  
    if (score === questions.length) {
        // Perfect score
        robotImage.src = "happybot.png"; 
        resultMessage.textContent = "Great job! You've unlocked success and are now ready to take on the next lesson.";
        document.getElementById("nextLesson").style.display = "inline-block"; 
    } else {
        // Poor performance
        robotImage.src = "sadbot.png"; 
        resultMessage.textContent = "Mistakes are proof that you're learning! Review the lesson and try again to unlock the next lesson.";
        document.getElementById("nextLesson").style.display = "none"; 
    }
}


document.getElementById("backLesson").addEventListener("click", function () {
    window.location.href = "lesson-page.html"; 
});

document.getElementById("retryQuiz").addEventListener("click", function () {
   
    currentQuestion = 0;
    score = 0;
    document.getElementById("quiz-container").style.display = "block";
    resultContainer.style.display = "none";
    initializeProgressBar();
    loadQuestion();
});


initializeProgressBar();
loadQuestion();

const chatbotIcon = document.querySelector(".chatbot-icon");
chatbotIcon.addEventListener("click", () => {
    alert("TechBot is currently under development!");
});
