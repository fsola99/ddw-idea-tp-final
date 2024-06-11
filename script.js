let allQuestions = [];
let selectedQuestions = [];
let currentQuestion = 0;
let score = 0;
let incorrectAnswers = [];

$(document).ready(function() {
    loadQuestions();

    $('#start-button').on('click', function() {
        startQuiz();
    });

    $('#retry-button').on('click', function() {
        startQuiz();
    });
});

async function loadQuestions() {
    try {
        const response = await fetch('questions.json');
        const data = await response.json();
        allQuestions = data;
        console.log('Questions loaded:', allQuestions); // Debugging
    } catch (error) {
        console.error('Error loading questions:', error);
    }
}

function startQuiz() {
    selectedQuestions = getRandomQuestions(allQuestions, 5);
    currentQuestion = 0;
    score = 0;
    incorrectAnswers = [];
    $('#start-screen').hide();
    $('#result-screen').hide();
    $('#question-screen').show();
    showQuestion();
}

function getRandomQuestions(questions, num) {
    const shuffled = questions.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, num);
}

function showQuestion() {
    if (currentQuestion < selectedQuestions.length) {
        const questionData = selectedQuestions[currentQuestion];
        console.log('Showing question:', questionData); // Debugging
        $('#question').text(questionData.question);
        $('#question-image').attr('src', questionData.image);
        const optionsDiv = $('#options');
        optionsDiv.empty();
        questionData.options.forEach(option => {
            const button = $('<button></button>').text(option);
            button.on('click', () => checkAnswer(option));
            optionsDiv.append(button);
        });
    } else {
        showResults();
    }
}

function checkAnswer(selectedOption) {
    if (selectedOption === selectedQuestions[currentQuestion].answer) {
        score++;
    } else {
        incorrectAnswers.push({
            question: selectedQuestions[currentQuestion].question,
            selectedOption: selectedOption,
            correctAnswer: selectedQuestions[currentQuestion].answer,
            info: selectedQuestions[currentQuestion].info
        });
    }
    currentQuestion++;
    showQuestion();
}

function showResults() {
    $('#question-screen').hide();
    $('#result').text(`Tu puntuación: ${score} de ${selectedQuestions.length}`);
    const errorListDiv = $('#error-list');
    errorListDiv.empty();
    incorrectAnswers.forEach(error => {
        const errorItem = $('<div></div>');
        errorItem.html(`<strong>Pregunta:</strong> ${error.question}<br><strong>Tu respuesta:</strong> ${error.selectedOption}<br><strong>Respuesta correcta:</strong> ${error.correctAnswer}<br><strong>Info:</strong> ${error.info}<br><br>`);
        errorListDiv.append(errorItem);
    });
    if (score / selectedQuestions.length >= 0.8) {
        $('#celebration').show();
        errorListDiv.append(`<p>🎉 ¡Felicidades! Has aprobado. 🎉</p>`);
    } else {
        $('#celebration').hide();
        errorListDiv.append(`<p>Mejor suerte para la próxima. Aquí tienes algunos consejos para mejorar:</p>`);
    }
    $('#result-screen').show();
}
