// Spørgsmål array
const questions = [
    { question: "Only 9% of all plastic produced is recycled?.", answer: true, explanation:"The reason being is due to the extensive costs it takes to produce recycled plastic." },
    { question: "2 million plastic bags are used every minute worldwide?.", answer: false,explanation: "It's 'only' 1 million plastic bags that are being used every minute" },
    { question: "10 million marine animals die each year from plastic waste alone?.", answer: false,explanation: "It's actually approximately 100 million marine animals that die each year from plastic waste alone." },
    { question: "5 million plastic bottles are bought every minute?.", answer: false, explanation:"It's actually 'only' 1 million plastic bottles that are bought every minute." },
    { question: "Nearly one-quarter of the world's plastic waste is mismanaged or littered?.", answer: true, explanation: "That is around 82 million tonnes mismanaged,and a quarter of that is leaked to the environment." },
    { question: "Plastic bottles slowly dissipates and eventually disappears?", answer: false, explanation: "A plastic bottle can last for 450 years in the marine environment, slowly fragmenting into smaller and smaller pieces which never truly disappear." },
    { question: "There will be more plastic in our oceans than fish by 2080?.", answer: false, explanation:"There will actually be more plastic in the oceans by 2050 than fish, if we don't do anything about it." },
    { question: "Plastic is made primarily from fossil fuel.", answer: true, explanation:"Around 90% of all plastic is made of fossil fuel, and it can be very toxic to you and the world if managed wrong." },
    { question: "It takes 7 gallons of water to make one pound of plastic?.", answer: false, explanation:" It takes approximately 22 gallons of water to make 1 pound of plastic" },
    { question:"If everyone switched to reusable bottles and carton water, we would be able to save enough energy to power New York City for an entire month?", answer: true, explanation:"Now imagine if we started using recycled plastic or reusable things, how much energy we would save. Plus spare the environment"},
];

// Variable til at holde styr på quizzen stadie, altså hvor man er og ens score
let currentQuestionIndex = 0;
let score = 0;

// funktion til at vise det næste spørgsmål + feedback og forklaring
function showQuestion() {
    if (currentQuestionIndex < questions.length) {
        document.getElementById('question').innerText = questions[currentQuestionIndex].question;
        document.getElementById('feedback').innerText = '';
        document.getElementById('explanation').innerText = '';
    } else {
        // Slutningen af quiz
        let finalMessage = score >= 6
        ? "Congratulations! you passed. You are now a certified plastic expert"
        : "Sadly you did not pass the test, there is room for improvement on your journey becoming a plastic expert.";
        document.getElementById('question').innerText = `Quiz over! Your score: ${score}. ${finalMessage}`;
        document.getElementById('score').innerText = '';
        document.getElementById('feedback').innerText = '';
        document.getElementById('explanation').innerText = '';
        document.querySelectorAll('.button').forEach(button => button.style.display = 'none');
    }
}


// Function to handle the user's answer
function answer(isTrue) {
    const currentQuestion = questions[currentQuestionIndex];
    if (isTrue === currentQuestion.answer) {
        score++;
        document.getElementById('feedback').innerText = "Correct!";
    } else {
        document.getElementById('feedback').innerText = "Wrong!";
        document.getElementById('explanation').innerText = `Explanation: ${currentQuestion.explanation}`;
    }
    document.getElementById('score').innerText = `Score: ${score}`;
    currentQuestionIndex++;
    setTimeout(showQuestion, 7000); // Viser feedback i 7 sekunder før den går videre til næste spørgsmål
}

// initiere quizzen
showQuestion();