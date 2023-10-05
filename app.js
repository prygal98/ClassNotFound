const express = require('express');
const createError = require('http-errors');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session')
const logger = require('morgan');

// TODO Rename config.example.js to config.js and change your secret
// Then uncomment the following line 
//const config = require('./config');


const indexRouteur = require('./routes/index');
const questionsRouteur = require('./routes/questions');
const membersRouteur = require('./routes/admin');
const usersRouteur = require('./routes/users');
const adminrouter = require('./routes/admin');


const app = express();
const port = 3000;

// register partials views 
// important to do that before set engine 
// BEFORE app.set('view engine', 'hbs');
var hbs = require('hbs');
hbs.registerPartials(__dirname + '/views/partials');

// Setup views folder and handlebar engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev')); // Log each request
app.use(express.urlencoded({ extended: false })); 
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public'))); 



app.use(session({ secret: "Your secret key", resave: false, saveUninitialized: false }))


// TODO Call your controllers here

app.use('/', indexRouteur);
app.use('/questions', questionsRouteur);
app.use('/members', membersRouteur);
app.use('/users', usersRouteur);
app.use('/admin',adminrouter);


// Create error on page not found
app.use((req, res, next) => next(createError(404)) ); 



// Show error hbs page
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.render('error', { error });
});

// Launch server
app.listen(port, () => console.log('App listening on port ' + port) );
