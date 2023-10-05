const express = require('express');
const router = express.Router();
const Admin = require('../models/Admins.js');

/* ADMIN PAGE */
router.get('/', (req, res, next) => {
  if (!req.session.is_admin || !req.session.is_authenticated) {
    res.redirect('/questions')
  }
  console.log("ADMIN INDEX");
  const listReportedQuestions = Admin.questionsReported();
  const listReportedAnswers = Admin.answersReported();
  res.render('members/adminPage', { is_admin: req.session.is_admin, is_authenticated: req.session.is_authenticated, listReportedQuestions, listReportedAnswers });
});

router.post('/deleteQuestion', (req, res, next) => {
  const questionDecline = req.body.id;
  console.log(" QUESTION DELETED " + questionDecline);
  Admin.deleteQuestion(questionDecline);
  res.redirect('/admin');
});

router.post('/approveQuestion', (req, res, next) => {
  const questionAccept = req.body.id;
  console.log(" QUESTION ACCEPTED " + questionAccept);
  console.log(questionAccept);
  Admin.acceptQuestion(questionAccept);
  res.redirect('/admin');
})

router.post('/deleteAnswer', (req, res, next) => {
  const answerDeclineID = req.body.id;
  const answerDecline = Admin.getAnswer(answerDeclineID);
  if (answerDecline.correct==1) {
    Admin.setUnSolved(answerDecline.question);
    Admin.deleteAnswer(answerDeclineID);
  }else{
    Admin.deleteAnswer(answerDeclineID);
  }
  console.log("QUETION DELETED " + answerDeclineID);
  res.redirect('/admin');
});

router.post('/approveAnswer', (req, res, next) => {
  const answerAccept = req.body.id;
  console.log("QUESTION ACCEPTED " + answerAccept);
  Admin.acceptAnswer(answerAccept);
  res.redirect('/admin');
})

module.exports = router;