const express = require('express');
const router = express.Router();

const Question = require('../models/Questions.js');
const User = require('../models/Users');



/* **************************************************  */
/* *******          RAPHAEL MALKA             *******  */
/* **************************************************  */

/* GET QUESTION LIST. */
router.get('/', (req, res, next) => {
    console.log("LIST OF THE QUESTIONS");
    const categoriesAffiche = Question.categories();
    const questionList = Question.list();
    res.render('index', { questionList, categoriesAffiche, is_admin: req.session.is_admin, is_authenticated: req.session.is_authenticated });
});


/* DISPLAY QUESTION PAGE */
router.get('/display', (req, res, next) => {
    const question = Question.find(req.query.id);
    console.log(JSON.stringify(question) + 'IS THE OWNER OF THE QUESTION')
    const answers = Question.findAnwers(req.query.id);
    const id_question = Question.getid(req.query.id);
    const errorlenght = req.query.errorlenght;
    console.log(errorlenght + 'ERROR LENGHT ')
    const isSolved = Question.isQuestionSolved(req.query.id);
    const id_owner = question.owner;
    let owner_admin = false;

    const ownerOfTheQuestion = User.findID(id_owner);
    const firstName = ownerOfTheQuestion.firstname;
    const lastname = ownerOfTheQuestion.lastname;

    if (req.session.idMember === id_owner || req.session.is_admin) {
        console.log("I M THE OWNER OF THE QUESTION ==> display owner ")
        owner_admin = true;
    }

    const findRightanswer = Question.displayRightAnswer(req.query.id);
    if (findRightanswer !== undefined) {
        const rightAnswer = Question.displayRightAnswer(req.query.id);
        console.log(JSON.stringify(rightAnswer) + " rigjht anwer");
        res.render('questionPage', { question: question, answers: answers, id_question: id_question, is_admin: req.session.is_admin, is_authenticated: req.session.is_authenticated, answer: rightAnswer, questionSolved: true, owner_admin: owner_admin, lastname: lastname, firstname: firstName, errorlenght });

    } else {
        console.log(JSON.stringify(isSolved) + " THE QUESTION IS SOLVED ");
        if (isSolved === 1) {
            res.render('questionPage', { question: question, answers: answers, id_question: id_question, is_admin: req.session.is_admin, is_authenticated: req.session.is_authenticated, questionNotSolved: false, owner_admin: owner_admin, lastname: lastname, firstname: firstName, errorlenght });
        }
        console.log("THE QUESTION IS NOT SOLVED ")
        res.render('questionPage', { question: question, answers: answers, id_question: id_question, is_admin: req.session.is_admin, is_authenticated: req.session.is_authenticated, questionNotSolved: true, owner_admin: owner_admin, lastname: lastname, firstname: firstName, errorlenght });
    }

});


/* REPORT QUESTION  */
router.post('/report', (req, res, next) => {
    console.log("REPORT QUESTION");
    id_question = req.body.id;
    Question.reportQuestion(id_question);
    question = Question.find(id_question);
    answers = Question.findAnwers(id_question);
    res.redirect('/questions/display?id=' + id_question);
});


/* REPORT ANSWERS  */
router.post('/reportAnswer', (req, res, next) => {
    console.log("REPORT ANSWER");
    const id_answers = req.body.id_answers;

    console.log(id_answers + "ID DE LA QUESTION QUZND REPORT");
    Question.reportAnswer(id_answers);
    console.log(Question.searchIdQuestion(id_answers));
    console.log(req.body.id_question + " ID DE LA QUESTION")
    res.redirect('/questions/display?id=' + req.body.id_question);
});

/* APPROVE ANSWERS  */
router.post('/approveAnswer', (req, res, next) => {
    console.log("APPROVE ANSWERS");
    id_question = req.body.id;
    id_answers = req.body.id_answers;
    const id = Question.searchIdQuestion(id_answers).question;
    console.log(id);
    id_answers = req.body.id_answers;
    Question.approveAnswer(id_answers);
    Question.approveQuestion(id);
    res.redirect('/questions/display?id=' + id);
});


router.get('/showCreateQuestionPage', (req, res, next) => {
    if (!req.session.is_authenticated) {
        res.redirect('/questions');
    }
    const errorlenght = req.query.errorlenght;
    const categoriesAffiche = Question.categories();
    res.render('createQuestionPage', { categoriesAffiche, is_admin: req.session.is_admin, is_authenticated: req.session.is_authenticated, errorlenght });
});

router.post('/addQuestion', (req, res, next) => {
    const title = req.body.title;
    const subject = req.body.subject;
    if (title.length <= 0 || subject.length <= 0 || subject == ' ' || title == ' ') {
        if ((title.length <= 0 || title == ' ') && (subject.length <= 0 || subject == ' ')) {
            res.redirect('/questions/showCreateQuestionPage' + '?errorlenght=' + 'You have to write a correct Title and Subject');
        }
        if (title.length <= 0 || title == ' ') {
            res.redirect('/questions/showCreateQuestionPage' + '?errorlenght=' + 'You have to write a correct Title');
        }
        if (subject.length <= 0 || subject == ' ') {
            res.redirect('/questions/showCreateQuestionPage' + '?errorlenght=' + 'You have to write a correct Subject');
        }

    } else {
        console.log("POST ADD QUESTION");
        const question = Question.saveQuestion({
            title,
            subject,
            solved: 0,
            reported: 0,
            owner: req.session.idMember,
            category: req.body.category
        });
        res.redirect('/questions/display?id=' + question);
    }
});

router.get('/search', (req, res, next) => {
    const titleQuestionSearch = req.query.titleQuestion;
    const questionList = Question.search(titleQuestionSearch);
    const categoriesAffiche = Question.categories();
    console.log("SEARCHING FOR " + titleQuestionSearch);
    res.render('index', { questionList, categoriesAffiche, is_admin: req.session.is_admin, is_authenticated: req.session.is_authenticated });
});

router.get('/searchCategory', (req, res, next) => {
    const categorySearch = req.query.categoryQuestion;
    const categoriesAffiche = Question.categories();
    const questionList = Question.searchCategory(categorySearch);
    console.log("SEARCHING CATEGORY " + categorySearch);
    res.render('index', { questionList, is_admin: req.session.is_admin, is_authenticated: req.session.is_authenticated, categoriesAffiche })
});

/* USER ADD ANSWER  */
router.post('/addAnswer', (req, res, next) => {
    console.log("ADD ANSWERS");
    const currentDate = new Date().toISOString().slice(0, 19).replace('T', ' ');;
    console.log(req.session.memberLogin);
    const user = User.find(req.session.memberLogin)


    console.log("HERE IS THE USER ID " + user.member_id)
    const id_question = req.body.id_question;

    const subject = req.body.subject;

    if (user !== undefined) {
        if (subject === " " || subject.length === 0) {
            res.redirect('/questions/display?id=' + id_question + '&errorlenght=' + 'You must at least insert 1 or more character');
        } else {
            Question.saveAnswer(
                {
                    creation_date: currentDate,
                    subject: req.body.subject,
                    reported: 0,
                    question: req.body.id_question,
                    author: user.member_id,
                    correct: 0
                }
            );
        }
    }
    question = Question.find(id_question);
    answers = Question.findAnwers(id_question);
    res.redirect('/questions/display?id=' + id_question);
});

module.exports = router;