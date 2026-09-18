const mysql = require('mysql2');
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'raj@2004',
    database: 'expense_tracker'
});

db.connect(err => {
    if (err) throw err;
    db.query("UPDATE categories SET icon = 'TrendingUp' WHERE name = 'Investing'", (err, result) => {
        if (err) throw err;
        console.log(`Updated ${result.affectedRows} categories.`);
        db.end();
    });
});
