document.addEventListener("DOMContentLoaded", function () {
    // Lesson Modal Elements
    const lessonModal = document.getElementById("lessonModal");
    const closeLesson = document.getElementById("closeLesson");

    // Start Quiz Modal Elements
    const quizModal = document.getElementById("quizModal");
    const openQuizModal = document.getElementById("openQuizModal");
    const cancelQuiz = document.getElementById("cancelQuiz");

    // Close Lesson Modal
    closeLesson.addEventListener("click", function () {
        window.location.href = "homepageicon.html";
    });

    // Open Quiz Modal
    openQuizModal.addEventListener("click", function () {
        quizModal.style.display = "flex";
    });

    // Close Quiz Modal
    cancelQuiz.addEventListener("click", function () {
        quizModal.style.display = "none";
    });

    // Close quiz modal when clicking outside of it
    window.addEventListener("click", function (event) {
        if (event.target === quizModal) {
            quizModal.style.display = "none";
        }
    });
});
