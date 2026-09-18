const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'raj@2004'
});

db.connect(err => {
    if (err) {
        console.error('Connection failed:', err.message);
        process.exit(1);
    }

    db.query('SHOW DATABASES', (err, rows) => {
        if (err) console.error(err.message);
        else console.table(rows);
        db.end();
    });
});
