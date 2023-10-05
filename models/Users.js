const db = require('../models/db_conf');

module.exports.save = (data) => {
    console.log(data);
    const stmt = db.prepare('INSERT INTO members(firstname, lastname, email, password, is_admin) VALUES (?, ?, ?, ?,?)');
    const info = stmt.run(data.firstname, data.lastname, data.email, data.password, data.is_admin);
    console.log("user model save member" + info.changes);
}

module.exports.find = (data) => {

    console.log(data);
    return db.prepare('SELECT * FROM members WHERE email = ?').get(data);
}

module.exports.getidMember = (email) => {
    console.log(email);
    db.prepare('SELECT member_id FROM members  WHERE email = ?').all(email);
}

module.exports.findID = (id) => {

    console.log(id);
    return db.prepare('SELECT * FROM members WHERE member_id = ?').get(id);
}

module.exports.findQuestionUser = (owner) => {
    console.log(owner);
    return db.prepare('SELECT qu.*, ca.name FROM questions qu, categories ca WHERE qu.category = ca.category_id AND qu.owner = ? AND qu.solved = 0 ORDER BY creation_date DESC').all(owner);
}

module.exports.findQuestionUserSolved = (owner) => {
    console.log(owner);
    return db.prepare('SELECT qu.*, ca.name FROM questions qu, categories ca WHERE qu.category = ca.category_id AND qu.owner = ? AND qu.solved = 1 ORDER BY creation_date DESC').all(owner);
}
