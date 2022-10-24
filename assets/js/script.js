const startButtonEl = document.getElementById("startButton");
const quizEl = document.getElementById("quiz");
const introEl = document.getElementById("intro");
const scoreEl = document.getElementById("user-score-container");
const saveButtonEl = document.getElementById("saveButton");
const highscoreEl = document.getElementById("highscore");
const backButtonEl = document.getElementById("backButton");
const highscoreButtonEl = document.getElementById("highscoreButton");
const resultEl = document.getElementById("result");

// Global Variable Initializations
let currentQuestionIndex = 0;
let userScore = 0;
let storedScores = JSON.parse(localStorage.getItem("highscores")); // Get locally stored highscores, if any

//If no locally stored scores found, initialize the storedScores object to store them in the future
if (!storedScores) {
  storedScores = {
    scores: [],
  };
  localStorage.setItem("highscores", JSON.stringify(storedScores));
}

// Event Listeners
startButtonEl.addEventListener("click", startQuiz);
highscoreButtonEl.addEventListener("click", displayHighscore);

// Saves the players userScore and initials to local storage and displays the highscore on click of the save button
saveButtonEl.addEventListener("click", function (event) {
  event.preventDefault();

  let highscores = JSON.parse(localStorage.getItem("highscores")); // Get the most recent highscores

  let player = {
    // Define a player object with the initials and userScore
    initials: document.getElementById("initials").value,
    userScore: userScore,
  };

  highscores.scores.push(player); // Add the player object to the list of highscores
  highscores.scores.sort(function (a, b) {
    // Sort the list of highscores by userScore
    return b.userScore - a.userScore;
  });

  if (highscores.scores.length >= 6) highscores.scores.pop(); // If there are more than 5 highscores, remove the lowest
  localStorage.setItem("highscores", JSON.stringify(highscores)); // Sets the new highscores to local storage
  displayHighscore(); // Display the highscores page
});

backButtonEl.addEventListener("click", function (event) {
  // Return from the highscores page to the intro page
  event.preventDefault();
  resetDisplays();
  introEl.setAttribute("style", "display: block");
});

// Starts the quiz
function startQuiz() {
  resetDisplays(); // Sets the display of all main elements to 'none'
  quizEl.setAttribute("style", "display: block"); // Display the quiz elements
  resultEl.textContent = ""; // Clear any previous results for new attempt
  userScore = 0; // Reset the players userScore
  quizTimer(); // Start the timer
  displayQuestion(); // Populate the quiz element with data from the quiz array
}

// Starts the timer and calls the quizResults function on completion
function quizTimer() {
  timeRemaining = 60; // (Re)set the time to 60 seconds
  const timer = setInterval(function () {
    const timerEl = document.getElementById("timer");
    timeRemaining--; // Reduce time by 1 second
    if (timeRemaining <= 0) {
      clearInterval(timer); // End the timer
      timeRemaining = 0; // Set the time to 0 incase it has been reduced to a negative number
      quizResults();
    }
    timerEl.textContent = timeRemaining;
  }, 1000);
}

// Displays each question and queries user for their answer
function displayQuestion() {
  const questionEl = document.getElementById("question");

   // If there are still questions in the quiz to display
  if (currentQuestionIndex < questionsArray.length) {
    const choicesEl = document.getElementById("choices"); // Select and clear previous question's multiple choice
    choicesEl.innerHTML = "";

    let currentQuestion = questionsArray[currentQuestionIndex]; // Gets the question object from questionsArray 
    questionEl.textContent = `Question # ${(currentQuestionIndex+1)} :  ${currentQuestion.question}`; // Format and display the question (arrays start at zero)


    // Create new list of multiple choice answers from the current question's choice array
    for (let i = 0; i < currentQuestion.choices.length; i++) {
      let answerEl = document.createElement("li");
      answerEl.textContent = currentQuestion.choices[i];

      // Add an event listener to each choice element to store which was selected and move user to next question
      answerEl.addEventListener("click", () => {
        userChoice(currentQuestion.choices[i], currentQuestionIndex);
        currentQuestionIndex++;
        //determine new userScore/time after the user makes a selection
        displayQuestion();
      });
      choicesEl.appendChild(answerEl);
    }
  } else {
    timeRemaining = 0; // Stop the clock in order to end the quiz
    currentQuestionIndex = 0; // Reset the current question in case the player wants to take the quiz again
  }
}

// Checks adn displays result of user's selection
function userChoice(answer, questionIndex) {
  if (questionsArray[questionIndex].correctAnswer === answer) {
    resultEl.textContent = `${answer} is Correct!`;
    userScore++; //Increment user's userScore
  } else {
    resultEl.textContent = `${answer} is Incorrect: The correct answer was: ${questionsArray[questionIndex].correctAnswer}!`; 
    timeRemaining -= 10; // Remove 10 seconds from the time remaining
  }
}

// Set and display the score acheived along with the previous highscores
function quizResults() {
  const userScoreEl = document.getElementById("userScore"); // Get the element where we will displaying the players userScore
  resetDisplays();
  scoreEl.setAttribute("style", "display: block"); // display the userScore section
  userScoreEl.textContent = userScore; // Display the userScore value
}

// Helper function to turn off the displays for all elements in order to selectively choose which ones to display at any time after calling this function
function resetDisplays() {
  introEl.setAttribute("style", "display: none");
  scoreEl.setAttribute("style", "display: none");
  quizEl.setAttribute("style", "display: none");
  highscoreEl.setAttribute("style", "display: none");
}

// display the highscore page
function displayHighscore() {
  const highscoreListEl = document.getElementById("highscoreList"); // Get the highscores list
  let highscores = JSON.parse(localStorage.getItem("highscores")); // Get the most recent highscores
  resetDisplays();
  highscoreEl.setAttribute("style", "display: block");
  highscoreListEl.innerHTML = ""; // Reset the highscores list

  // Append each of the highscores in the JSON object to the highscores list as an <li> element
  for (let i = 0; i < highscores.scores.length; i++) {
    let highscoreListItem = document.createElement("li");
    highscoreListItem.textContent = `${highscores.scores[i].initials} - ${highscores.scores[i].userScore}`; // Format the highscores
    highscoreListEl.appendChild(highscoreListItem); // Append the highscore to the list
  }
}

//Questions array
const questionsArray = [
    {
        question: "Which choice is not a common JavaScript Data Type?",
        choices: ["Strings", "Booleans", "Alerts", "Numbers"],
        correctAnswer: "Alerts"
    },
    {
        question: "The condition in an if / else statement is enclosed within ____.",
        choices: ["Quotation Marks: ''", "Curly Brackets: {}", "Parentheses: ()", "Square Brackets: []"],
        correctAnswer: "Parentheses: ()"
    },
    {
        question: "JavaScript is a _______side scripting language.",
        choices: ["Server", "ISP", "Browser", "None of the above"],
        correctAnswer: "Browser"
    },
    {
        question: "String values must be enclosed within ______ when being assigned to variables.",
        choices: ["Commas: ,", "Curly Brackets: {}", "Quotation Marks: ''", "Parentheses: ()"],
        correctAnswer: "Quotation Marks: ''"
    },
    {
        question: "Which of the following is an advantage of using JavaScript?",
        choices: ["Increased interactivity", "Less server interaction", "Immediate feedback from users", "All of the above"],
        correctAnswer: "All of the above"
    },
    {
        question: "Which of the following is a very useful tool used during development and debugging?",
        choices: ["JavaScript", "Terminal/Bash", "For loops", "Console.log"],
        correctAnswer: "Console.log"
    },
];
