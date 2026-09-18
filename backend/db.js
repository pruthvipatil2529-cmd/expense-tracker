const mysql = require('mysql2');

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'raj@2004',
    database: 'expense_tracker',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

console.log('✅ MySQL Pool Created (db.js)');

module.exports = db;
