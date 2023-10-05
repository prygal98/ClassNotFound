const express = require('express');
const router = express.Router();

const Question = require('../models/Questions.js');

/* GET home page. */
router.get('/', (req, res, next) => {
  res.redirect('/questions');
});

module.exports = router;