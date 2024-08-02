function doGet() {
  return HtmlService.createHtmlOutputFromFile('index')
    .setTitle('Create Weekly Quiz')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function createWeeklyQuiz(title, questions) {
  try {
    console.log("Starting quiz creation with title: " + title);
    console.log("Received questions: " + questions);

    // Create a new form and set the title
    var form = FormApp.create(title);
    console.log("Form created with ID: " + form.getId());

    // Make the form a quiz and collect email
    form.setIsQuiz(true).setCollectEmail(true);

    // Limit to one response per user
    form.setLimitOneResponsePerUser(true);

    // Add description with rules and additional information
    var description = "Welcome to the Gardi Vidyapith Weekly Quiz!\n\n" +
                      "This quiz is provided by Gardi Vidyapith on a weekly basis to enhance students' knowledge, " +
                      "improve their learning, and boost their placement prospects.\n\n" +
                      "Please read the following rules and information carefully:\n\n" +
                      "• This form can only be filled out once.\n" +
                      "• Once submitted, you cannot change your answers.\n" +
                      "• Points are awarded based on the difficulty of the questions.\n" +
                      "• The point value for each question is displayed next to its number.\n" +
                      "• You will be asked between 5 to 10 questions.\n" +
                      "• There is no time limit for this quiz.\n" +
                      "• PLEASE GIVE THIS TEST HONESTLY WITHOUT USING GOOGLE OR AI TOOLS.\n" +
                      "• Your scores will be manually reviewed and released. You will receive your results in your verified email account.\n" +
                      "• The quiz covers various topics relevant to your field of study and potential job requirements.\n" +
                      "• Regular participation in these quizzes can significantly improve your knowledge and skills.\n" +
                      "• If you encounter any technical issues, please contact the IT support team.\n" +
                      "• Feel free to provide feedback on the quiz to help us improve future editions.\n\n" +
                      "Remember, the goal is to learn and improve. Good luck and enjoy the quiz!";
    
    form.setDescription(description);
    console.log("Description added to form");

    // Parse the questions JSON
    var questionsArray = JSON.parse(questions);
    console.log("Parsed " + questionsArray.length + " questions");

    // Shuffle the questions
    questionsArray = shuffleArray(questionsArray);

    // Limit to maximum 10 questions
    questionsArray = questionsArray.slice(0, 10);

    // Ensure at least 5 questions
    if (questionsArray.length < 5) {
      throw new Error("Not enough questions. Please provide at least 5 questions.");
    }

    // Add questions to the form
    questionsArray.forEach(function(question, index) {
      var points = question.points || 1;
      var item = form.addMultipleChoiceItem();
      var title = `Question ${index + 1} (${points} point${points > 1 ? 's' : ''}):\n\t${question.title}`;
      
      item.setTitle(title);
      
      var shuffledChoices = shuffleArray(question.choices);
      
      item.setChoices(shuffledChoices.map(function(choice) {
        return item.createChoice(choice, choice === question.correctAnswer);
      }));
      
      item.setPoints(points);
      item.setFeedbackForCorrect(FormApp.createFeedback().setText('Correct! ' + question.explanation).build());
      item.setFeedbackForIncorrect(FormApp.createFeedback().setText('Incorrect. ' + question.explanation).build());
      
      console.log("Added question " + (index + 1));
    });

    // Set up confirmation message without score release
    form.setConfirmationMessage('Thank you for submitting the quiz! Your responses have been recorded.\n\n' + 
                                'Your scores will be manually reviewed and sent to your verified email account. Please check your email later for your results.\n\n' + 
                                'Keep participating in these weekly quizzes to enhance your knowledge and skills!');

    // Set to not release score immediately
    form.setPublishingSummary(false);
    form.setShowLinkToRespondAgain(false);

    console.log("Quiz creation completed");
    return form.getPublishedUrl();
  } catch (error) {
    console.error("Error in createWeeklyQuiz: " + error.toString());
    throw error;
  }
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
