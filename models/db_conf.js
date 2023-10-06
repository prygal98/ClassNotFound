

//const db = require('better-sqlite3')('U:/Projet_Web/test.db', { verbose: console.log });
//const config = require('../config');
//const dbPath = config.dbPath;
//const db = require('better-sqlite3')(dbPath, { verbose: console.log });
//const config = require('../config');

//const db = require('better-sqlite3')(dbPath, { verbose: console.log });

// TODO export your database object & create your models   ICI J AI RETIRER CETTE LIGNE !!!!!!! 

// personal computer macos".txt"
const db = require('better-sqlite3')('C:/Cours_bac_2/db_1_year/final.db', { verbose: console.log });


module.exports = db;