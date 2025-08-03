const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', 
    password: '',
    database: 'library_db'
});


db.connect(err => {
    if (err) {
        console.error('Erreur de connexion à MySQL :', err);
        return;
    }
    console.log('Connecté à MySQL');
});

module.exports = db;