// This function serves the HTML form
function doGet() {
  return HtmlService.createHtmlOutputFromFile('index');
}

// This function creates the Google Form based on input
function createWeeklyQuiz(title, questions) {
  // Create a new form and set the title
  var form = FormApp.create(title);

  // Make the form a quiz and collect email
  form.setIsQuiz(true).setCollectEmail(true);

  // Limit to one response per user
  form.setLimitOneResponsePerUser(true);

  // Parse the questions JSON
  var questionsArray = JSON.parse(questions);

  // Shuffle the questions
  questionsArray = shuffleArray(questionsArray);

  // Add questions to the form
  questionsArray.forEach(function(question) {
    var item = form.addMultipleChoiceItem();
    item.setTitle(question.title);
    
    // Shuffle the choices
    var shuffledChoices = shuffleArray(question.choices);
    
    item.setChoices(shuffledChoices.map(function(choice) {
      return item.createChoice(choice, choice === question.correctAnswer);
    }));
    
    item.setPoints(question.points);
    item.setFeedbackForCorrect(FormApp.createFeedback().setText('Correct! ' + question.explanation).build());
    item.setFeedbackForIncorrect(FormApp.createFeedback().setText('Incorrect. ' + question.explanation).build());
  });

  // Set up confirmation message with score
  form.setCustomClosedFormMessage('Thanks for submitting the quiz! Your responses have been recorded. You\'ll see your score on the next page.');

  // Release score immediately
  form.setPublishingSummary(true);
  form.setShowLinkToRespondAgain(false);

  return form.getPublishedUrl();
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
