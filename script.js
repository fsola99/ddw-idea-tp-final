let allQuestions = [];
let selectedQuestions = [];
let currentQuestion = 0;
let score = 0;
let incorrectAnswers = [];
let userAnswers = [];

$(document).ready(function() {
    loadQuestions();

    $('#start-button').on('click', function() {
        startQuiz();
    });

    $('#retry-button').on('click', function() {
        startQuiz();
    });

    $('#prev-button').on('click', function() {
        prevQuestion();
    });

    $('#exit-button').on('click', function() {
        exitQuiz();
    });

    $('#exit-button-result').on('click', function() {
        exitQuiz();
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
    userAnswers = new Array(selectedQuestions.length).fill(null);
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
    if (currentQuestion >= 0 && currentQuestion < selectedQuestions.length) {
        const questionData = selectedQuestions[currentQuestion];
        console.log('Showing question:', questionData); // Debugging
        $('#question').text(questionData.question);
        $('#question-image').attr('src', questionData.image);
        const optionsDiv = $('#options');
        optionsDiv.empty();
        questionData.options.forEach(option => {
            const button = $('<button></button>').text(option);
            button.on('click', () => selectAnswer(option));
            optionsDiv.append(button);
        });

        // Habilitar o deshabilitar el botón "Volver"
        if (currentQuestion === 0) {
            $('#prev-button').hide();
        } else {
            $('#prev-button').show();
        }
    } else if (currentQuestion === selectedQuestions.length) {
        showResults();
    }
}

function selectAnswer(option) {
    userAnswers[currentQuestion] = option;
    currentQuestion++;
    showQuestion();
}

function prevQuestion() {
    if (currentQuestion > 0) {
        currentQuestion--;
        showQuestion();
    }
}

function exitQuiz() {
    $('#question-screen').hide();
    $('#result-screen').hide();
    $('#start-screen').show();
}

function showResults() {
    score = 0;
    incorrectAnswers = [];
    userAnswers.forEach((answer, index) => {
        if (answer === selectedQuestions[index].answer) {
            score++;
        } else {
            incorrectAnswers.push({
                question: selectedQuestions[index].question,
                selectedOption: answer,
                correctAnswer: selectedQuestions[index].answer,
                info: selectedQuestions[index].info
            });
        }
    });

    $('#question-screen').hide();
    $('#result').text(`Tu puntuación: ${score} de ${selectedQuestions.length}`);
    const errorListDiv = $('#error-list');
    errorListDiv.empty();
    incorrectAnswers.forEach(error => {
        const errorItem = $('<div></div>');
        errorItem.html(`<strong>Pregunta:</strong> ${error.question}<br><strong>Tu respuesta:</strong> ${error.selectedOption}<br><strong>Respuesta correcta:</strong> ${error.correctAnswer}<br><strong>Info:</strong> ${error.info}<br><br>`);
        errorListDiv.append(errorItem);
    });

    if (score === selectedQuestions.length) {
        $('#celebration').show();
        errorListDiv.append(`<p>🎉 ¡Felicidades! Has aprobado con una puntuación perfecta. 🎉</p>`);
    } else {
        $('#celebration').hide();
        errorListDiv.append(`<p>Mejor suerte para la próxima. ¡Vuelve a intentarlo para recibir un premio!</p>`);
    }

    $('#result-screen').show();
}
