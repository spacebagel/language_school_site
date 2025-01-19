const questions = [
    {
        question: "Какое слово обозначает предмет?",
        answers: [
            { text: "Бежать", correct: false },
            { text: "Красиво", correct: false },
            { text: "Машина", correct: true },
            { text: "Читать", correct: false }
        ]
    },
    {
        question: "Какое из слов является глаголом?",
        answers: [
            { text: "Дом", correct: false },
            { text: "Бежать", correct: true },
            { text: "Зелёный", correct: false },
            { text: "Книга", correct: false }
        ]
    },
    {
        question: "Выберите слово с ударением на первом слоге.",
        answers: [
            { text: "Дорого", correct: true },
            { text: "Тетрадь", correct: false },
            { text: "Земля", correct: false },
            { text: "Гармония", correct: false }
        ]
    },
    {
        question: "Какое слово является прилагательным?",
        answers: [
            { text: "Весёлый", correct: true },
            { text: "Играть", correct: false },
            { text: "Река", correct: false },
            { text: "Быстро", correct: false }
        ]
    },
    {
        question: "Какое из предложений правильно?",
        answers: [
            { text: "Я хочет есть.", correct: false },
            { text: "Мы хочет пить.", correct: false },
            { text: "Он хочет спать.", correct: true },
            { text: "Ты хочет гулять.", correct: false }
        ]
    },
    {
        question: "Как переводится слово \"ручка\"?",
        answers: [
            { text: "Pen", correct: true },
            { text: "Table", correct: false },
            { text: "Chair", correct: false },
            { text: "Window", correct: false }
        ]
    },
    {
        question: "Выберите правильное окончание: Она любит _____.",
        answers: [
            { text: "играют", correct: false },
            { text: "играет", correct: false },
            { text: "играть", correct: true },
            { text: "играл", correct: false }
        ]
    },
    {
        question: "Какое из следующих слов обозначает время суток?",
        answers: [
            { text: "Солнце", correct: false },
            { text: "Утро", correct: true },
            { text: "Дерево", correct: false },
            { text: "Река", correct: false }
        ]
    },
    {
        question: "Какой падеж используется в слове: \"стеной\"?",
        answers: [
            { text: "Предложный", correct: false },
            { text: "Родительный", correct: false },
            { text: "Творительный", correct: true },
            { text: "Именительный", correct: false }
        ]
    },
    {
        question: "Какое слово обозначает транспортное средство?",
        answers: [
            { text: "Дерево", correct: false },
            { text: "Ручка", correct: false },
            { text: "Книга", correct: false },
            { text: "Поезд", correct: true }
        ]
    },
    {
        question: "Какое из слов является антонимом к слову \"тёплый\"?",
        answers: [
            { text: "Холодный", correct: true },
            { text: "Жаркий", correct: false },
            { text: "Зелёный", correct: false },
            { text: "Быстрый", correct: false }
        ]
    },
    {
        question: "Какое слово обозначает профессию?",
        answers: [
            { text: "Ручка", correct: false },
            { text: "Светлый", correct: false },
            { text: "Учитель", correct: true },
            { text: "Быстро", correct: false }
        ]
    },
    {
        question: "Какое слово является числительным?",
        answers: [
            { text: "Книга", correct: false },
            { text: "Пять", correct: true },
            { text: "Смеяться", correct: false },
            { text: "Красивый", correct: false }
        ]
    },
    {
        question: "Какое из слов обозначает помещение?",
        answers: [
            { text: "Собака", correct: false },
            { text: "Кухня", correct: true },
            { text: "Часы", correct: false },
            { text: "Море", correct: false }
        ]
    },
    {
        question: "Какое слово является синонимом к слову \"гигантский\"?",
        answers: [
            { text: "Маленький", correct: false },
            { text: "Светлый", correct: false },
            { text: "Огромный", correct: true },
            { text: "Быстрый", correct: false }
        ]
    }
];

const questionText = document.getElementById("question");
const answerButtons = document.getElementById("answer-buttons");
const nextButton = document.getElementById("next-question-button");
const learningButton = document.getElementById("start-learning-button");

let currentQuestionId = 0;
let score = 0;

function startQuiz() {
    currentQuestionId = 0;
    score = 0;
    nextButton.innerHTML = "Next";
    learningButton.style.display = "none";
    showQuestion();
}

function showQuestion() {
    resetState();
    let currentQuestion = questions[currentQuestionId];
    let questionNo = currentQuestionId + 1;
    questionText.innerHTML = questionNo + ". " + currentQuestion.question;

    currentQuestion.answers.forEach(answer => {
        const button = document.createElement("button");
        button.innerHTML = answer.text;
        button.classList.add("answer-button");
        answerButtons.appendChild(button);
        if (answer.correct) {
            button.dataset.correct = answer.correct;
        }
        button.addEventListener("click", selectAnswer);
    });
}

function resetState() {
    nextButton.style.display = "none";
    while (answerButtons.firstChild) {
        answerButtons.removeChild(answerButtons.firstChild);
    }
}

function selectAnswer(e) {
    const selectedButton = e.target;
    const isCorrect = selectedButton.dataset.correct == "true";
    if (isCorrect) {
        selectedButton.classList.add("correct");
        score++;
    } else {
        selectedButton.classList.add("incorrect");
    }
    Array.from(answerButtons.children).forEach(button => {
        button.disabled = true;
    });
    nextButton.style.display = "block";
}

nextButton.addEventListener("click", () => {
    currentQuestionId++;
    if (currentQuestionId < questions.length) {
        showQuestion();
    } else {
        showResults();
    }
});

function showResults() {
    resetState();
    const levels = ['Beginner', 'Intermediate', 'Advanced'];
    let resultPercent = score / (questions.length * 0.01);
    questionText.innerHTML = `You have completed the test! Your result: ${score} из ${questions.length} - ${resultPercent > 33 ? resultPercent > 60 && resultPercent < 80 ? levels[1] : levels[2] : levels[0]}`;
    nextButton.innerHTML = "Start again";
    learningButton.style.display = "block";
    nextButton.style.display = "block";
    nextButton.addEventListener("click", () => {
        location.reload();
    });

    learningButton.addEventListener("click", () => {
        window.location.href = `../index.html#available-courses-section`;
    });
}

startQuiz();