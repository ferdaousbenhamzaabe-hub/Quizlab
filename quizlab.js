// ========================================
// 1. QUESTIONS PAR DÉFAUT
// ========================================

const defaultQuestions = [
  {
    question: "Que signifie HTML ?",
    answers: [
      "HyperText Markup Language",
      "HighText Machine Language",
      "HyperTool Multi Language",
      "Home Tool Markup Language"
    ],
    correct: 0,
    explanation: "HTML permet de structurer le contenu d'une page web."
  },
  {
    question: "Quel langage sert à styliser une page web ?",
    answers: ["Java", "CSS", "SQL", "C++"],
    correct: 1,
    explanation: "CSS gère les couleurs, les espacements et la mise en page."
  },
  {
    question: "Quelle instruction déclare une variable réassignable en JavaScript ?",
    answers: ["const", "fixed", "let", "define"],
    correct: 2,
    explanation: "let déclare une variable dont la valeur peut changer."
  },
  {
    question: "Quel attribut HTML fournit un texte alternatif à une image ?",
    answers: ["title", "src", "href", "alt"],
    correct: 3,
    explanation: "alt décrit l'image pour l'accessibilité et lorsque l'image ne se charge pas."
  },
  {
    question: "Quelle méthode ajoute un élément à la fin d'un tableau ?",
    answers: ["push()", "pop()", "shift()", "join()"],
    correct: 0,
    explanation: "push() ajoute un ou plusieurs éléments à la fin d'un tableau."
  },
  {
    question: "Quel symbole sélectionne un ID en CSS ?",
    answers: [".", "*", "#", "&"],
    correct: 2,
    explanation: "Le symbole # permet de cibler un élément avec son identifiant."
  },
  {
    question: "À quoi sert principalement Git ?",
    answers: [
      "Créer des maquettes",
      "Gérer les versions du code",
      "Héberger une base de données",
      "Styliser les pages"
    ],
    correct: 1,
    explanation: "Git suit l'historique des modifications du code."
  },
  {
    question: "Quelle méthode sélectionne un élément par son ID en JavaScript ?",
    answers: [
      "document.findId()",
      "document.queryId()",
      "document.getElementById()",
      "window.getElement()"
    ],
    correct: 2,
    explanation: "getElementById() récupère l'élément qui correspond à l'ID donné."
  }
];


// ========================================
// 2. GESTION DU THÈME CLAIR / SOMBRE
// ========================================

// Récupérer les éléments du bouton de thème
const themeToggle = document.querySelector("#theme-toggle");
const themeIcon = document.querySelector("#theme-icon");
const themeLabel = document.querySelector("#theme-label");

// Récupérer le thème sauvegardé
// Si aucun thème n'est sauvegardé, utiliser le mode clair
let currentTheme = localStorage.getItem("quizlab_theme") || "light";

// Appliquer le thème sélectionné
function applyTheme(theme) {
  currentTheme = theme;

  // Modifier l'attribut du document HTML
  document.documentElement.setAttribute("data-theme", theme);

  // Modifier le texte et l'icône du bouton
  if (theme === "dark") {
    themeIcon.textContent = "☀️";
    themeLabel.textContent = "Mode clair";

    themeToggle.setAttribute(
      "aria-label",
      "Activer le mode clair"
    );

    themeToggle.setAttribute("aria-pressed", "true");
  } else {
    themeIcon.textContent = "🌙";
    themeLabel.textContent = "Mode sombre";

    themeToggle.setAttribute(
      "aria-label",
      "Activer le mode sombre"
    );

    themeToggle.setAttribute("aria-pressed", "false");
  }
}

// Initialiser le thème au chargement de la page
applyTheme(currentTheme);

// Changer le thème au clic
themeToggle.addEventListener("click", () => {
  const newTheme = currentTheme === "light" ? "dark" : "light";

  applyTheme(newTheme);

  // Mémoriser le choix de l'utilisateur
  localStorage.setItem("quizlab_theme", newTheme);
});


// ========================================
// 3. GESTION DES QUESTIONS ET LOCALSTORAGE
// ========================================

let questions = JSON.parse(localStorage.getItem("quizlab_custom"))
  || defaultQuestions;


// ========================================
// 4. RÉCUPÉRATION DES ÉLÉMENTS DU DOM
// ========================================

const intro = document.querySelector("#intro");
const quiz = document.querySelector("#quiz");
const result = document.querySelector("#result");
const builder = document.querySelector("#builder");

const startBtn = document.querySelector("#start-btn");
const nextBtn = document.querySelector("#next-btn");
const restartBtn = document.querySelector("#restart-btn");

const modePlayBtn = document.querySelector("#mode-play-btn");
const modeEditBtn = document.querySelector("#mode-edit-btn");

const questionForm = document.querySelector("#question-form");
const customList = document.querySelector("#custom-questions-list");
const resetDefaultBtn = document.querySelector("#reset-default-btn");
const totalQuestionsCount = document.querySelector("#total-questions-count");

const questionCounter = document.querySelector("#question-counter");
const questionTitle = document.querySelector("#question-title");
const answersContainer = document.querySelector("#answers");
const feedback = document.querySelector("#feedback");
const liveScore = document.querySelector("#live-score");
const answeredCount = document.querySelector("#answered-count");
const progressTrack = document.querySelector("#progress-track");
const progressFill = document.querySelector("#progress-fill");
const finalScore = document.querySelector("#final-score");
const resultMessage = document.querySelector("#result-message");


// ========================================
// 5. VARIABLES DU QUIZ
// ========================================

let currentIndex = 0;
let score = 0;
let hasAnswered = false;


// ========================================
// 6. MISE À JOUR DU NOMBRE DE QUESTIONS
// ========================================

function updateCounts() {
  totalQuestionsCount.textContent = questions.length;
}

updateCounts();


// ========================================
// 7. BASCULEMENT ENTRE JOUER ET ÉDITEUR
// ========================================

modeEditBtn.addEventListener("click", () => {
  intro.classList.add("hidden");
  quiz.classList.add("hidden");
  result.classList.add("hidden");
  builder.classList.remove("hidden");

  modeEditBtn.classList.add("active");
  modePlayBtn.classList.remove("active");

  renderCustomList();
});

modePlayBtn.addEventListener("click", () => {
  builder.classList.add("hidden");
  quiz.classList.add("hidden");
  result.classList.add("hidden");
  intro.classList.remove("hidden");

  modePlayBtn.classList.add("active");
  modeEditBtn.classList.remove("active");

  updateCounts();
});


// ========================================
// 8. DÉMARRER LE QUIZ
// ========================================

function startQuiz() {
  currentIndex = 0;
  score = 0;
  hasAnswered = false;

  intro.classList.add("hidden");
  result.classList.add("hidden");
  builder.classList.add("hidden");
  quiz.classList.remove("hidden");

  // Activer le mode Jouer dans la navigation
  modePlayBtn.classList.add("active");
  modeEditBtn.classList.remove("active");

  renderQuestion();
}


// ========================================
// 9. AFFICHER UNE QUESTION
// ========================================

function renderQuestion() {
  const current = questions[currentIndex];

  hasAnswered = false;

  questionCounter.textContent =
    `QUESTION ${String(currentIndex + 1).padStart(2, "0")} / ${String(questions.length).padStart(2, "0")}`;

  questionTitle.textContent = current.question;
  liveScore.textContent = score;

  answeredCount.textContent =
    `Question ${currentIndex + 1} sur ${questions.length}`;

  progressTrack.setAttribute("aria-valuemax", questions.length);
  progressTrack.setAttribute("aria-valuenow", currentIndex);

  progressFill.style.width =
    `${(currentIndex / questions.length) * 100}%`;

  feedback.textContent = "";
  feedback.className = "feedback";

  nextBtn.disabled = true;

  nextBtn.textContent =
    currentIndex === questions.length - 1
      ? "Voir mon résultat →"
      : "Question suivante →";

  // Supprimer les anciennes réponses
  answersContainer.replaceChildren();

  // Créer les boutons des réponses
  current.answers.forEach((answer, index) => {
    const button = document.createElement("button");

    button.type = "button";
    button.className = "answer-btn";

    const letter = document.createElement("span");

    letter.className = "answer-letter";
    letter.textContent = String.fromCharCode(65 + index);

    const text = document.createElement("span");

    text.textContent = answer;

    button.append(letter, text);

    button.addEventListener("click", () => {
      selectAnswer(index);
    });

    answersContainer.appendChild(button);
  });
}


// ========================================
// 10. SÉLECTIONNER UNE RÉPONSE
// ========================================

function selectAnswer(selectedIndex) {
  // Empêcher plusieurs réponses à la même question
  if (hasAnswered) return;

  hasAnswered = true;

  const current = questions[currentIndex];

  const buttons = [
    ...answersContainer.querySelectorAll("button")
  ];

  const isCorrect = selectedIndex === current.correct;

  // Incrémenter le score si la réponse est correcte
  if (isCorrect) {
    score++;
  }

  // Désactiver les réponses et afficher le résultat
  buttons.forEach((button, index) => {
    button.disabled = true;

    if (index === current.correct) {
      button.classList.add("correct");
    }

    if (index === selectedIndex && !isCorrect) {
      button.classList.add("incorrect");
    }
  });

  // Afficher le retour et l'explication
  feedback.textContent =
    `${isCorrect ? "Bonne réponse !" : "Mauvaise réponse."} ${current.explanation}`;

  feedback.classList.add(isCorrect ? "good" : "bad");

  // Actualiser le score et la progression
  liveScore.textContent = score;

  answeredCount.textContent =
    `Question ${currentIndex + 1} sur ${questions.length}`;

  progressTrack.setAttribute("aria-valuenow", currentIndex + 1);

  progressFill.style.width =
    `${((currentIndex + 1) / questions.length) * 100}%`;

  // Autoriser le passage à la question suivante
  nextBtn.disabled = false;
}


// ========================================
// 11. QUESTION SUIVANTE
// ========================================

function goToNextQuestion() {
  if (!hasAnswered) return;

  if (currentIndex < questions.length - 1) {
    currentIndex++;

    renderQuestion();
  } else {
    showResult();
  }
}


// ========================================
// 12. AFFICHER LE RÉSULTAT FINAL
// ========================================

function showResult() {
  quiz.classList.add("hidden");
  result.classList.remove("hidden");

  finalScore.textContent = score;

  // Actualiser le nombre total de questions
  document.querySelector(".result-total").textContent =
    `/ ${questions.length}`;

  const percentage = (score / questions.length) * 100;

  if (percentage === 100) {
    resultMessage.textContent =
      "Excellent ! Tu as répondu correctement à toutes les questions.";
  } else if (percentage >= 70) {
    resultMessage.textContent =
      "Très bon résultat ! Continue à pratiquer.";
  } else if (percentage >= 40) {
    resultMessage.textContent =
      "Bon début. Relis les explications et réessaie.";
  } else {
    resultMessage.textContent =
      "Continue à apprendre : chaque essai te fait progresser.";
  }
}


// ========================================
// 13. AJOUTER UNE QUESTION PERSONNALISÉE
// ========================================

questionForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const newQ = {
    question: document.querySelector("#input-question").value,

    answers: [
      document.querySelector("#opt-0").value,
      document.querySelector("#opt-1").value,
      document.querySelector("#opt-2").value,
      document.querySelector("#opt-3").value
    ],

    correct: parseInt(
      document.querySelector("#select-correct").value,
      10
    ),

    explanation:
      document.querySelector("#input-explanation").value
      || "Bonne réponse !"
  };

  // Ajouter la question
  questions.push(newQ);

  // Sauvegarder les questions
  localStorage.setItem(
    "quizlab_custom",
    JSON.stringify(questions)
  );

  // Réinitialiser le formulaire
  questionForm.reset();

  // Actualiser la liste et le nombre de questions
  renderCustomList();
  updateCounts();

  alert("Question ajoutée avec succès !");
});


// ========================================
// 14. AFFICHER LES QUESTIONS PERSONNALISÉES
// ========================================

function renderCustomList() {
  customList.replaceChildren();

  document.querySelector("#custom-count").textContent =
    questions.length;

  questions.forEach((q, index) => {
    const card = document.createElement("div");

    card.className = "custom-item";

    // Informations sur la question
    const info = document.createElement("div");

    const title = document.createElement("strong");

    title.textContent = `${index + 1}. ${q.question}`;

    const answerInfo = document.createElement("p");

    answerInfo.className = "muted";
    answerInfo.style.margin = "4px 0 0";

    answerInfo.textContent =
      `Réponse correcte : Option ${String.fromCharCode(65 + q.correct)}`;

    info.append(title, answerInfo);

    // Bouton de suppression
    const deleteBtn = document.createElement("button");

    deleteBtn.className = "btn-delete";
    deleteBtn.type = "button";
    deleteBtn.title = "Supprimer";

    deleteBtn.setAttribute(
      "aria-label",
      `Supprimer la question ${index + 1}`
    );

    deleteBtn.textContent = "🗑️";

    deleteBtn.addEventListener("click", () => {
      deleteQuestion(index);
    });

    card.append(info, deleteBtn);

    customList.appendChild(card);
  });
}


// ========================================
// 15. SUPPRIMER UNE QUESTION
// ========================================

function deleteQuestion(index) {
  if (questions.length <= 1) {
    alert("Le quiz doit contenir au moins une question !");
    return;
  }

  if (confirm("Voulez-vous vraiment supprimer cette question ?")) {
    questions.splice(index, 1);

    // Sauvegarder les modifications
    localStorage.setItem(
      "quizlab_custom",
      JSON.stringify(questions)
    );

    renderCustomList();
    updateCounts();
  }
}

// Conserver la fonction accessible globalement
window.deleteQuestion = deleteQuestion;


// ========================================
// 16. RÉINITIALISER LES QUESTIONS PAR DÉFAUT
// ========================================

resetDefaultBtn.addEventListener("click", () => {
  if (confirm("Voulez-vous réinitialiser les questions par défaut ?")) {
    questions = [...defaultQuestions];

    localStorage.setItem(
      "quizlab_custom",
      JSON.stringify(questions)
    );

    renderCustomList();
    updateCounts();

    alert("Questions réinitialisées !");
  }
});


// ========================================
// 17. ÉCOUTEURS DES BOUTONS PRINCIPAUX
// ========================================

startBtn.addEventListener("click", startQuiz);

restartBtn.addEventListener("click", startQuiz);

nextBtn.addEventListener("click", goToNextQuestion);