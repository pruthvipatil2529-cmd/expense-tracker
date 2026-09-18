const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'raj@2004',
    database: 'expense_tracker',
    multipleStatements: true
});

db.connect(err => {
    if (err) {
        console.error('Connection failed:', err.message);
        process.exit(1);
    }

    db.query('SHOW TABLES', (err, tables) => {
        if (err) {
            console.error('Error showing tables:', err.message);
            db.end();
            return;
        }
        console.log('--- TABLES IN expense_tracker ---');
        console.table(tables);

        const tableNames = tables.map(row => Object.values(row)[0]);

        let query = '';
        if (tableNames.includes('users')) query += 'SELECT * FROM users;';
        if (tableNames.includes('transactions')) query += 'SELECT * FROM transactions;';

        if (!query) {
            console.log('No relevant tables found.');
            db.end();
            return;
        }

        db.query(query, (err, results) => {
            if (err) {
                console.error('Error fetching data:', err.message);
            } else {
                if (Array.isArray(results[0])) {
                    // When multipleStatements is true and multiple queries are sent
                    if (tableNames.includes('users')) {
                        console.log('\n--- USERS ---');
                        console.table(results[0]);
                    }
                    if (tableNames.includes('transactions')) {
                        console.log('\n--- TRANSACTIONS ---');
                        console.table(results[results.length > 1 ? 1 : 0]);
                    }
                } else {
                    // Single query result
                    console.table(results);
                }
            }
            db.end();
        });
    });
});
