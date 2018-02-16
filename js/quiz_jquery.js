/*
 * Simple quiz generator in jQuery.
 *
 * @author Robert C. Duvall
 */

$(function() {
    // possible quiz questions will be loaded dynamically using JSON
    var questions = null;
    var quiz = $('#quiz');
    var questionsCompleted = 0;


    // returns a random element from a given list
    function randomElement(list) {
        return list[Math.floor(Math.random() * list.length)];
    }

    // return question data user is working on now
    function currentQuestion() {
        return questions[questionsCompleted];
    }

    // returns user's selected answer
    function getChoice() {
        var element = $('input[name="answer"]:checked');
        if (element === null) {
            return -1;
        } else {
            return parseInt(element.val(), 10);
        }
    }

    // returns list of the answer choices as radio inputs
    function createRadios(questionData) {
        var radioList = $('<ul>');
        $.each(questionData.choices, function (index, text) {
            $('<li>').html('<input type="radio" name="answer" value=' + index + ' />' + text)
                     .appendTo(radioList);
        });
        return radioList;
    }

    // create div that contains question and the possible answers
    function createQuestionElement(questionData) {
        return $('<div>').append($('<p>').html(questionData.question))
                         .append(createRadios(questionData))
                         .attr('id', 'question');
    }

    // displays current question
    function displayQuestion() {
        createQuestionElement(currentQuestion()).appendTo(quiz);
    }

    // check if user's response is correct or not
    function checkResponse() {
        var choice = getChoice();
        if (choice < 0) {
            alert('Please make a selection!');
        } else if (choice === currentQuestion().correctAnswer) {
            alert('Correct!');
        } else {
            alert('Sorry, try again!');
        }
        return false;
    }

    // moves to next question by removing the current one
    function nextQuestion() {
        questionsCompleted += 1;
        quiz.empty();
        if (questionsCompleted === questions.length) {
            quiz.html('<h2>You completed the quiz!<h2>');
            $('#submit').hide();
            $('#next').hide();
            $('#start').show();
        } else {
            displayQuestion();
        }
    }

    // start quiz by displaying standard quiz buttons and loading data
    function startQuiz(url) {
        $('#submit').show();
        $('#next').show();
        $('#start').hide();
        quiz.empty();
        questionsCompleted = 0;
        loadQuestions(url);
    }

    // load the questions data structure from a JSON file
    function loadQuestions(url) {
        $.getJSON(url, function (data) {
            questions = data;
            displayQuestion();
        });
    }

    // add interactivity to HTML elements once
    $('#submit').on('click', checkResponse);
    $('#next').on('click', nextQuestion);
    $('#start').on('click', function () {
        startQuiz('data/duke_questions.json');
    });

    // display initial question
    startQuiz('data/math_questions.json');
});
