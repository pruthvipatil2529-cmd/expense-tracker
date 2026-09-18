const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'raj@2004',
    database: 'expense_tracker'
});

db.connect(err => {
    if (err) {
        console.error('Connection failed:', err.message);
        process.exit(1);
    }

    db.query('SHOW TABLES', (err, tables) => {
        console.log('Tables:', JSON.stringify(tables));

        db.query('SELECT * FROM users', (err, users) => {
            console.log('Users:', JSON.stringify(users));
            db.end();
        });
    });
});
