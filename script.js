let questions = [];
let currentIndex = 0;
let errorCount = 0;
let correctCount = 0;
let wrongQuestions = [];

fetch("domande.json")
  .then(response => response.json())
  .then(data => {
    questions = data.map(question => ({ ...question, attempts: 0 }));
    loadQuestion(currentIndex);
  })
  .catch(error => {
    console.error("Errore durante il caricamento delle domande:", error);
  });

function loadQuestion(index) {
  if (index >= questions.length || index > endQuestion) {
    if (wrongQuestions.length > 0) {
      document.getElementById("retryButton").style.display = "flex";
      return;
    } else {
      alert("Test completato!");
      return;
    }
  }

  const question = questions[index];
  question.attempts++;

  console.log("question:", question); // Verifica il contenuto di question
  
  const options = [question["Opzione 0"], question["Opzione 1"], question["Opzione 2"], question["Opzione 3"]]; // Le opzioni

  console.log("options:", options); // Verifica il contenuto di options

  const questionContainer = document.getElementById('questionContainer');
  questionContainer.innerHTML = `
    <h2>${question["Domanda"]}</h2> 
    <ul class="options">
      ${options.map((opzione, i) => `
        <li>
          <button data-index="${i}">${opzione}</button>
        </li>
      `).join('')}
    </ul>
    <p>Tentativi: ${question.attempts}</p>
  `;

  const buttons = document.querySelectorAll('.options button');
  buttons.forEach(button => {
    button.addEventListener('click', () => {
      checkAnswer(button.dataset.index, question["Risposta corretta"], question);
    });
  });

  document.getElementById("totalCount").innerText = `${currentIndex + 1}`;
}

function checkAnswer(selectedOptionIndex, correctAnswerIndex, question) {
  if (selectedOptionIndex == correctAnswerIndex) {
    alert("Risposta corretta!");
    correctCount++;
  } else {
    alert("Risposta sbagliata!");
    errorCount++;
    if (!wrongQuestions.includes(question)) {
      wrongQuestions.push(question); // Aggiungi la domanda sbagliata all'array se non è già presente
    }
  }

  document.getElementById("correctCount").innerText = `${correctCount}`;
  document.getElementById("wrongCount").innerText = `${errorCount}`;

  currentIndex++;
  loadQuestion(currentIndex);
}

// Funzione per riproporre le domande sbagliate
document.getElementById("retryButton").addEventListener("click", function() {
  if (wrongQuestions.length > 0) {
    questions = wrongQuestions.splice(0); // Ripristina le domande sbagliate per riprovarle
    currentIndex = 0;
    errorCount = 0;
    correctCount = 0;
    document.getElementById("retryButton").style.display = "flex";
    loadQuestion(currentIndex);
  } else {
    alert("Non ci sono domande sbagliate da riprovare.");
  }
});

// Funzione per avviare la simulazione dalla domanda specificata
document.getElementById("searchButton").addEventListener("click", function() {
  const start = document.getElementById("startQuestion").value;
  const end = document.getElementById("endQuestion").value;

  if (start) {
    startQuestion = parseInt(start) - 1; // Convertiamo a indice 0-based
    currentIndex = startQuestion;
  } else {
    alert("Inserisci un numero di domanda valido.");
    return;
  }

  if (end) {
    endQuestion = parseInt(end) - 1; // Convertiamo a indice 0-based
  } else {
    endQuestion = Infinity;
  }

  errorCount = 0;
  correctCount = 0;
  document.getElementById("retryButton").style.display = "flex";
  loadQuestion(currentIndex);
});
