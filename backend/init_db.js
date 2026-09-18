const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'raj@2004',
    multipleStatements: true
});

const sqlPath = path.join(__dirname, 'database.sql');
let sql = fs.readFileSync(sqlPath, 'utf8');

// Prepend DROP TABLE statements to ensure fresh start
const dropTables = `
USE expense_tracker;
DROP TABLE IF EXISTS transactions;
DROP TABLE IF EXISTS users;
`;

sql = dropTables + sql;

db.connect(err => {
    if (err) {
        console.error('Connection failed:', err.message);
        process.exit(1);
    }

    console.log('Connected to MySQL. Re-initializing database...');
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Initialization failed:', err.message);
        } else {
            console.log('Database initialized successfully.');
        }
        db.end();
    });
});
