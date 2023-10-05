const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const saltRounds = 10;

const User = require('../models/Users');
const Question = require('../models/Questions.js');

/* **************************************************  */
/* *******  RAPHAEL MALKA                     *******  */
/* **************************************************  */


/* USERS PAGE WITH PERSONNAL QUESTION  TANGUY VANDERVELDEN*/
router.get('/', (req, res, next) => {
    if (!req.session.is_authenticated) {
        res.redirect('/questions')
    }
    const idMember = req.session.idMember;
    console.log("USERS PERSONNAL QUESTION PAGE id=" + idMember);
    const questionAskedList = User.findQuestionUser(idMember);
    const questionAskedListSolved = User.findQuestionUserSolved(idMember);
    res.render('members/usersMembers', { questionAskedList, questionAskedListSolved, is_admin: req.session.is_admin, is_authenticated: req.session.is_authenticated });
});


/* LOFIN PAGE TO LOG THE USER */
router.get('/login', (req, res, next) => {
    console.log("LOGIN PAGE");
    res.render('members/usersLogin', { is_admin: req.session.is_admin, is_authenticated: req.session.is_authenticated });
});

/* REGISTER PAGE TO REGISTER THE USER */
router.get('/register', (req, res, next) => {
    console.log("LOGIN PAGE");
    req.session.connected
    res.render('members/usersRegister', { is_admin: req.session.is_admin, is_authenticated: req.session.is_authenticated });
});

router.post('/add', (req, res, next) => {

    console.log("USER ADD REGISTER");

    const firstName = req.body.memberFirstName;
    const lastName = req.body.memberLastName;
    const email = req.body.memberLogin;
    const password = req.body.memberPassword;
    const confirmPassword = req.body.memberPasswordConfirmation;

    const mailAllowed = firstName.toLowerCase() + "." + lastName.toLowerCase() + "@vinci.be"
    const mailAllowed2 = firstName.toLowerCase() + "." + lastName.toLowerCase() + "@student.vinci.be"

    //|| email !==mailAllowed2
    tableError = [];
    let counter = 0;

    console.log("JE SUIS ICI")
    console.log(password);
    console.log(confirmPassword);

    if (password !== confirmPassword) {
        console.log("PASSWORD NOT THE SAME")
        counter++;
        tableError.push({ errorMessage: "The password and the confirmation password are not equals, please try again" })
    }


    if (User.find(email)) {
        console.log('email adress is in the database')
        counter++;
        tableError.push({ errorMessage: "Someone is alrady registed with this email adress" })
    }

    if (counter === 0 && email === mailAllowed || email === mailAllowed2) {
        console.log('EMAIL AND PASSWORD OK : NEW MEMEBER ADD');
        const passwordCrypted = bcrypt.hashSync(password, saltRounds);
        User.save(
            {
                firstname: firstName,
                lastname: lastName,
                email: email,
                password: passwordCrypted,
                is_admin: 0
            }
        );

        req.session.memberLogin = email;
        req.session.idMember = User.find(email).member_id;

        res.redirect('/users/logged')

    } else {
        console.log("EMAIL ADRESS NOT ALLOWED");
        counter++;
        if (email !== mailAllowed && email !== mailAllowed2) {
            tableError.push({ errorMessage: "The email you choosed is not allowed, try with your firstname.lastname@vinci.be" })
        }
        res.render('members/usersRegister', { errors: tableError });
    }

});

router.post('/log', (req, res, next) => {

    const email = req.body.memberLogin;
    const dbUser = User.find(email);

    tableError = [];

    if (dbUser === undefined) {
        tableError.push({ errorMessage: "This E-mail doesn't exist in our database" })
        res.render('members/usersLogin', { errors: tableError });
    }

    if (bcrypt.compareSync(req.body.memberPassword, dbUser.password)) {
        console.log("password correct");
        var id_user_logged = User.find(req.body.memberLogin).member_id;

        console.log(id_user_logged);

        console.log(req.sessionID + " IM HERE ID SESSION?")
        req.session.memberLogin = req.body.memberLogin;
        req.session.idMember = User.find(email).member_id;
        console.log(req.session.idMember);
        res.redirect('/users/logged');
    } else {
        console.log("bad password");
        tableError.push({ errorMessage: "The password is not correct" })
        res.render('members/usersLogin', { errors: tableError });
    }
});


router.get('/logged', (req, res, next) => {
    console.log("THE USER IS LOGGED ");
    console.log(req.session.memberLogin)
    const categoriesAffiche = Question.categories();
    // allow to find the user in the database with the email adresse
    const userIsLogged = User.find(req.session.memberLogin);

    console.log(req.session.memberLogin + " LOGINNN");
    console.log(userIsLogged.is_admin + " LOGINNN");

    if (userIsLogged.is_admin === 1) {
        req.session.is_admin = true;
        req.session.is_authenticated = true;
    }
    if (userIsLogged.is_admin === 0) {
        req.session.is_authenticated = true;
        req.session.is_admin = false;
    }

    if (userIsLogged !== undefined) {
        res.render('index', { memberLogged: req.session.memberLogin, categoriesAffiche, questionList: Question.list(), is_admin: req.session.is_admin, is_authenticated: req.session.is_authenticated });
    }
    else {
        console.log("USER NOT LOGGED");
        res.render('members/usersLogin', { questionList: Question.list() });
    }
});


router.get('/logout', (req, res, next) => {
    console.log("LOGOUT");
    req.session.destroy();
    res.redirect('/');
});


/* **************************************************  */
/* *******  TANGUY VANDERVELDEN                *******  */
/* **************************************************  */

router.get('/getQuestion', (req, res, next) => {
    const idQuestionToShow = req.query.id;
    console.log(" GET QUESTION USER UNSOLVED id=" + idQuestionToShow);
    res.redirect('/questions/display?id=' + idQuestionToShow);
});

router.get('/getQuestionSolved', (req, res, next) => {
    const idQuestionToShow = req.query.id;
    console.log("GET QUETION USER SOLVED id=" + idQuestionToShow);
    res.redirect('/questions/display?id=' + idQuestionToShow);
})

module.exports = router;