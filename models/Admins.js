const db = require('../models/db_conf');

module.exports.questionsReported = () => db.prepare("SELECT * FROM questions WHERE reported = 1 ORDER BY creation_date DESC").all();

module.exports.answersReported = () => db.prepare("SELECT * FROM answers WHERE reported = 1 ORDER BY creation_date DESC").all();

module.exports.deleteQuestion = (id) => {
    db.prepare("DELETE FROM answers WHERE question = ?").run(id);
    const info = db.prepare('DELETE FROM questions WHERE question_id = ?').run(id);
    console.log("question deleted" + info.changes);
};

module.exports.deleteAnswer = (id) => {
    const info = db.prepare('DELETE FROM answers WHERE answers_id = ?').run(id);
    console.log("answer deleted" + info.changes);
};

module.exports.acceptQuestion = (id) => {
    return db.prepare('UPDATE questions SET reported = 0 WHERE question_id = ?').run(id);
};

module.exports.acceptAnswer = (id) => {
    return db.prepare('UPDATE answers SET reported = 0 WHERE answers_id = ?').run(id);
};

module.exports.setUnSolved = (id) => {
    const info = db.prepare('UPDATE questions SET solved = 0 WHERE question_id = ?').run(id);
    console.log("answer deleted" + info.changes);
}

module.exports.getAnswer = (id) => {
    return db.prepare("SELECT * FROM answers WHERE answers_id = ?").get(id);
}

