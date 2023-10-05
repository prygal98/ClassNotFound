const db = require('../models/db_conf');

module.exports.list = () => db.prepare("SELECT qu.*, ca.name FROM questions qu, categories ca wHERE qu.category = ca.category_id AND qu.solved = 0 ORDER BY creation_date DESC LIMIT 20").all();

module.exports.list2 = () => db.prepare("SELECT * FROM answers").all();

module.exports.find = (id) => db.prepare('SELECT q.*, ca.name FROM questions q, categories ca WHERE ca.category_id = q.category AND q.question_id = ?').get(id);

module.exports.getid = (id) => db.prepare('SELECT question_id FROM questions  WHERE question_id = ?').get(id);

module.exports.findAnwers = (id) => db.prepare('SELECT an.* FROM answers an, questions qu  WHERE an.question = qu.question_id AND an.correct = 0 AND qu.question_id = ? ORDER BY creation_date DESC').all(id);

module.exports.displayRightAnswer = (id) => db.prepare('SELECT an.* FROM answers an, questions qu  WHERE an.question = qu.question_id AND an.correct = 1 AND qu.question_id = ?').get(id);

module.exports.isQuestionSolved = (id) => db.prepare('SELECT solved FROM questions WHERE question_id = ?').get(id);


module.exports.saveAnswer = (data) => {
  console.log(data);
  const stmt = db.prepare('INSERT INTO answers(creation_date, subject , reported , question , author, correct ) VALUES (?, ?, ?, ?,?, ?)');
  const info = stmt.run(data.creation_date, data.subject, data.reported, data.question, data.author, data.correct);
  console.log("ANSWER TO QUESTION " + info.changes);
}

module.exports.search = (title) => {
  return db.prepare('SELECT qu.*, ca.name FROM questions qu, categories ca WHERE qu.category = ca.category_id AND title LIKE ?ORDER BY creation_date DESC LIMIT 20').all('%' + title + '%');
};

module.exports.saveQuestion = (data) => {
  const stmt = db.prepare('INSERT INTO QUESTIONS (title, subject, solved, reported, owner, category) VALUES (?, ?, ?, ?, ?, ?) RETURNING question_id');
  const info = stmt.run(data.title, data.subject, data.solved, data.reported, data.owner, data.category);
  console.log("questions save" + info.changes);
  return info.lastInsertRowid;
};

module.exports.searchCategory = (category) => {
  return db.prepare(' SELECT qu.*, ca.name FROM questions qu, categories ca WHERE qu.category = ca.category_id AND category LIKE ? ORDER BY creation_date DESC LIMIT 20').all(category);
};

module.exports.categories = () => {
  return db.prepare("SELECT * FROM categories ").all();
};

module.exports.reportQuestion = (id) => {
  return db.prepare('UPDATE questions SET reported = 1 WHERE question_id = ?').run(id);
}

module.exports.reportAnswer = (id) => {
  return db.prepare('UPDATE answers SET reported = 1 WHERE answers_id = ?').run(id);
}

module.exports.approveAnswer = (id) => {
  return db.prepare('UPDATE answers SET correct = 1 WHERE answers_id = ?').run(id);
}


module.exports.approveQuestion = (id) => {
  return db.prepare('UPDATE questions SET solved = 1 WHERE question_id = ?').run(id);
}

module.exports.searchIdQuestion = (id) => {
  return db.prepare('SELECT question FROM answers WHERE answers_id = ?').get(id);
}


module.exports.findOwnerOfQuestion = (id) => {
  return db.prepare('SELECT qu.* FROM questions qu, members me WHERE qu.owner = me.member_id AND question_id = ? ').get(id);
}

module.exports.nameCategory = (id) => {
  return db.prepare('SELECT ca.name FROM categories ca, questions qu WHERE qu.category = ca.category_id AND question_id = ?').get(id);
}






