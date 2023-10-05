

//const db = require('better-sqlite3')('U:/Projet_Web/test.db', { verbose: console.log });
//const config = require('../config');
//const dbPath = config.dbPath;
//const db = require('better-sqlite3')(dbPath, { verbose: console.log });
//const config = require('../config');

//const db = require('better-sqlite3')(dbPath, { verbose: console.log });

// TODO export your database object & create your models   ICI J AI RETIRER CETTE LIGNE !!!!!!! 

// personal computer macos
const db = require('better-sqlite3')('/Users/raph/Desktop/final.db', { verbose: console.log });


module.exports = db;