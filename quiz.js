// Array of questions
const questions = [
    { question: "Only 9% of all plastic produced is recycled?", answer: true, explanation: "The main reason is due to the extensive costs it takes to produce recycled plastic." },
    { question: "500.000 plastic bags are used every minute worldwide?", answer: false, explanation: "It's actually 1 million plastic bags that are being used every minute" },
    { question: "10 million marine animals die each year from plastic waste alone?", answer: false, explanation: "It's approximately 100 million marine animals that die each year from plastic waste alone." },
    { question: "670.000 plastic bottles are bought every minute?", answer: false, explanation: "It's actually 1 million plastic bottles that are bought every minute." },
    { question: "Nearly one-quarter of the world's plastic waste is mismanaged or littered?", answer: true, explanation: "Which is around 82 million tonnes mismanaged in total, and a quarter of that is leaked to the environment." },
    { question: "Plastic bottles slowly dissipate and eventually disappear?", answer: false, explanation: "A plastic bottle can last for 450 years in the marine environment, slowly fragmenting into smaller and smaller pieces which never truly disappear." },
    { question: "There will be more plastic in our oceans than fish by 2040?", answer: false, explanation: "There will be more plastic in the oceans by 2050 than fish, if we don't do anything about it." },
    { question: "Plastic is made primarily from fossil fuel?", answer: true, explanation: "Around 90% of all plastic is made of fossil fuel, and it can be very toxic to the world if managed wrong." },
    { question: "It takes 7 gallons of water to make one pound of plastic?", answer: false, explanation: "It takes approximately 22 gallons of water to make 1 pound of plastic" },
    { question: "If everyone switched to reusable bottles and carton water, we would be able to save enough energy to power New York City for an entire month?", answer: true, explanation: "Now imagine if everything became recycled/reusable instead of 1 time uses, how much energy would we save in the long term?" },
];

// Variables to keep track of the quiz state
let currentQuestionIndex = 0;
let score = 0;
let answerGiven = false; // New flag to track if an answer has been given

// Function to display the next question
function showQuestion() {
    if (currentQuestionIndex < questions.length) {
        document.getElementById('question').innerText = questions[currentQuestionIndex].question;
        document.getElementById('feedback').innerText = '';
        document.getElementById('explanation').innerText = '';
        document.getElementById('nextButton').style.display = 'none';
        enableAnswerButtons(); // Enable the answer buttons for the new question
        answerGiven = false; // Reset the flag for the new question
    } else {
        // End of quiz
        let finalMessage = score >= 6
            ? "Congratulations! You passed. You are now a certified plastic expert."
            : "Sadly you did not pass the test. There is room for improvement on your journey to becoming a plastic expert.";
        document.getElementById('question').innerText = `Quiz over! Your score: ${score}. ${finalMessage}`;
        document.getElementById('score').innerText = '';
        document.getElementById('feedback').innerText = '';
        document.getElementById('explanation').innerText = '';
        document.querySelectorAll('.quizbutton').forEach(button => button.style.display = 'none');
        document.getElementById('nextButton').style.display = 'none';
    }
}

// Function to handle the user's answer
function answer(isTrue) {
    if (answerGiven) return; // Ignore if an answer has already been given

    disableAnswerButtons(); // Disable the answer buttons after an answer is submitted
    const currentQuestion = questions[currentQuestionIndex];
    const feedbackElement = document.getElementById('feedback');

    if (isTrue === currentQuestion.answer) {
        score++;
        feedbackElement.innerText = "Correct!";
        feedbackElement.classList.add('correct');
        feedbackElement.classList.remove('wrong');
    } else {
        feedbackElement.innerText = "Wrong!";
        feedbackElement.classList.add('wrong');
        feedbackElement.classList.remove('correct');
    }

    document.getElementById('explanation').innerText = `Explanation: ${currentQuestion.explanation}`;
    document.getElementById('score').innerText = `Score: ${score}`;
    document.getElementById('nextButton').style.display = 'block';
    answerGiven = true; // Set the flag to indicate that an answer has been given
}

// Function to move to the next question
function nextQuestion() {
    currentQuestionIndex++;
    showQuestion();
}

// Function to disable the answer buttons
function disableAnswerButtons() {
    document.querySelectorAll('.quizbutton').forEach(button => button.disabled = true);
}

// Function to enable the answer buttons
function enableAnswerButtons() {
    document.querySelectorAll('.quizbutton').forEach(button => button.disabled = false);
}

// Initialize the quiz
showQuestion();
