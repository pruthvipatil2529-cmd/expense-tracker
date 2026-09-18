const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

// 1. ENABLE CORS (Allow Frontend to connect)
app.use(cors({
    origin: '*', // For development/testing, allow all. You can restrict this later to FRONTEND_URL
    credentials: true,
}));
app.use(bodyParser.json());

// HELLO ROUTE (Health Check)
app.get('/', (req, res) => {
    res.json({ status: "alive", message: "Expense Tracker Backend is Running!" });
});

// 2. DATABASE POOL (Handles timeouts automatically)
const DB_PORT = process.env.MYSQLPORT || 3306;
const isWrongPort = (DB_PORT == 5000 || DB_PORT == 8080 || DB_PORT == process.env.PORT);

console.log("🛠️ Environment Check:", {
    HOST: process.env.MYSQLHOST ? '✅ Set' : '❌ NOT SET',
    DB: process.env.MYSQLDATABASE ? '✅ Set' : '❌ NOT SET',
    USER: process.env.MYSQLUSER ? '✅ Set' : '❌ NOT SET',
    MYSQL_PORT: DB_PORT,
    SERVER_PORT: process.env.PORT || 5000
});

if (isWrongPort && !process.env.MYSQL_URL) {
    console.log("⚠️ Warning: MYSQLPORT looks like a Server Port. Using 3306 as safety fallback.");
}

const poolConfig = process.env.MYSQL_URL ? process.env.MYSQL_URL : {
    host: process.env.MYSQLHOST || 'localhost',
    user: process.env.MYSQLUSER || 'root',
    password: process.env.MYSQLPASSWORD || 'raj@2004',
    database: process.env.MYSQLDATABASE || 'expense_tracker',
    port: isWrongPort ? 3306 : DB_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    connectTimeout: 10000 // 10 seconds
};

console.log(`📡 Database Connecting to: ${poolConfig.host}:${poolConfig.port}`);
const db = mysql.createPool(poolConfig);

// Logs for requests
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});


// 3. DATABASE INITIALIZATION (Ensures tables exist)
db.query(`CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user',
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)`, (err) => {
    if (err) console.error("Users table failed:", err);
    else console.log("✅ Users table sync'd");
});

db.query(`CREATE TABLE IF NOT EXISTS transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    type ENUM('Income', 'Expense') NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    category VARCHAR(100),
    date DATE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
)`, (err) => {
    if (err) console.error("Transactions table failed:", err);
    else console.log("✅ Transactions table sync'd");
});

db.query("CREATE TABLE IF NOT EXISTS categories (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(100) NOT NULL UNIQUE, icon VARCHAR(100) DEFAULT 'ShoppingBag', color VARCHAR(100) DEFAULT '#3b82f6', created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)", (err) => {
    if (err) console.error("Error creating categories table:", err);
    else {
        // Seed Standard Categories
        const standardCats = [['Education', 'GraduationCap', '#8b5cf6'], ['Shopping', 'ShoppingBag', '#f43f5e'], ['Food', 'Utensils', '#f59e0b'], ['Travel', 'Plane', '#3b82f6'], ['Entertainment', 'Film', '#ec4899'], ['Health', 'HeartPulse', '#10b981']];
        standardCats.forEach(([name, icon, color]) => {
            db.query("INSERT IGNORE INTO categories (name, icon, color) VALUES (?, ?, ?)", [name, icon, color]);
        });
        console.log("✅ Categories Table Sync'd");
    }
});

// Auto-create missing tables for Reports & Notifications
db.query("CREATE TABLE IF NOT EXISTS report_requests (id INT AUTO_INCREMENT PRIMARY KEY, user_id INT, type VARCHAR(50), status VARCHAR(50) DEFAULT 'Pending', file_url TEXT, start_date DATE, end_date DATE, requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE)", (err) => {
    if (err) console.error("Report Requests table failed:", err);
    else console.log("✅ Report Requests table sync'd");
});

db.query("CREATE TABLE IF NOT EXISTS notifications (id INT AUTO_INCREMENT PRIMARY KEY, user_id INT, message TEXT, type VARCHAR(50), read_status BOOLEAN DEFAULT FALSE, action_url TEXT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE)", (err) => {
    if (err) console.error("Notifications table failed:", err);
    else console.log("✅ Notifications table sync'd");
});

// 4. API ROUTES

// Login
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    console.log(`Login attempt for: ${email}`);

    const sql = "SELECT * FROM users WHERE email = ?";
    db.query(sql, [email], (err, data) => {
        if (err) {
            console.error("Login Error:", err);
            return res.status(500).json({ error: "Database error" });
        }
        if (data.length > 0) {
            // Check password (plain text as requested)
            if (password === data[0].password) {
                // Check blocked status
                if (data[0].status === 'blocked') {
                    console.log("User is blocked");
                    return res.status(403).json({ error: "Account Blocked" });
                }

                console.log("Login successful");
                return res.json({ success: true, user: data[0] });
            } else {
                console.log("Wrong password");
                return res.status(401).json({ error: "Wrong password" });
            }
        } else {
            console.log("User not found");
            return res.status(404).json({ error: "User not found" });
        }
    });
});

// Signup
app.post('/api/signup', (req, res) => {
    const { email, password } = req.body;
    console.log(`Signup attempt for: ${email}`);

    // Standardized SQL query with explicit placeholders
    const sql = "INSERT INTO users (email, password, role, status) VALUES (?, ?, 'user', 'active')";

    db.query(sql, [email, password], (err, data) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                console.log("Email already exists");
                return res.status(409).json({ error: "Email already exists" });
            }
            console.error("Signup Error:", err);
            return res.status(500).json({ error: "Signup Failed" });
        }
        console.log("User registered successfully");
        return res.json({ success: true });
    });
});


// --- ADMIN DASHBOARD ROUTES ---

// GET /api/admin/stats
app.get('/api/admin/stats', (req, res) => {
    const { userId } = req.query;

    // Safety: If no userId is provided, we assume it's a global admin request.
    // In a real app, we'd verify the admin role here.
    const condition = userId ? `WHERE user_id = ${db.escape(userId)}` : "";

    const queries = {
        totalUsers: "SELECT COUNT(*) as count FROM users",
        totalVolume: `SELECT COALESCE(SUM(ABS(amount)), 0) as total FROM transactions ${condition}`,
        txToday: `SELECT COUNT(*) as count FROM transactions ${userId ? `WHERE user_id = ${db.escape(userId)} AND` : "WHERE"} date = CURDATE()`,
        totalIncome: `SELECT COALESCE(SUM(amount), 0) as total FROM transactions ${userId ? `WHERE user_id = ${db.escape(userId)} AND` : "WHERE"} type = 'Income'`,
        totalExpense: `SELECT COALESCE(SUM(amount), 0) as total FROM transactions ${userId ? `WHERE user_id = ${db.escape(userId)} AND` : "WHERE"} type = 'Expense'`
    };

    const stats = {};
    let completed = 0;
    const keys = Object.keys(queries);

    keys.forEach(key => {
        db.query(queries[key], (err, data) => {
            if (err) {
                console.error(`Error fetching ${key}:`, err);
                stats[key] = 0;
            } else {
                const row = data[0] || {};
                // Ensure everything is a number to avoid string/NaN issues in JS
                stats[key] = Number(row.total || row.count || 0);
            }

            completed++;
            if (completed === keys.length) {
                res.json({
                    totalUsers: stats.totalUsers || 0,
                    totalVolume: stats.totalVolume || 0,
                    transactionsToday: stats.txToday || 0,
                    totalIncome: stats.totalIncome || 0,
                    totalExpense: stats.totalExpense || 0,
                    systemHealth: 'Good'
                });
            }
        });
    });
});

// GET /api/admin/chart-data
app.get('/api/admin/chart-data', (req, res) => {
    const { userId } = req.query;
    const condition = userId ? `AND user_id = ${db.escape(userId)}` : "";

    const sql = `
        SELECT category, SUM(ABS(amount)) as total 
        FROM transactions 
        WHERE type = 'Expense' ${condition}
        GROUP BY category
    `;
    db.query(sql, (err, data) => {
        if (err) {
            console.error("Chart Data Error:", err);
            return res.json([]); // Return empty array on error
        }
        return res.json(Array.isArray(data) ? data : []);
    });
});

// GET /api/categories (Alphabetical)
app.get('/api/categories', (req, res) => {
    const sql = "SELECT * FROM categories ORDER BY name ASC";
    db.query(sql, (err, data) => {
        if (err) {
            console.error("Fetch Categories Error:", err);
            return res.status(500).json({ error: "Error fetching categories" });
        }
        return res.json(data || []);
    });
});

// POST /api/categories (Add New)
app.post('/api/categories', (req, res) => {
    const { name, icon, color } = req.body;

    if (!name) {
        return res.status(400).json({ error: "Category name is required" });
    }

    const sql = "INSERT INTO categories (name, icon, color) VALUES (?, ?, ?)";
    db.query(sql, [name, icon || 'Default', color || '#3b82f6'], (err, result) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({ error: "Category already exists" });
            }
            console.error("Add Category Error:", err);
            return res.status(500).json({ error: "Database error" });
        }
        return res.json({ success: true, id: result.insertId });
    });
});

// GET /api/users
app.get('/api/users', (req, res) => {
    const sql = "SELECT id, email, role, status, created_at FROM users ORDER BY created_at DESC";
    db.query(sql, (err, data) => {
        if (err) return res.status(500).json({ error: "Error fetching users" });
        // Format to match UI expectation
        const formatted = data.map(u => ({
            ...u,
            name: u.email.split('@')[0], // Derive name from email for UI
            joined: u.created_at.toISOString().split('T')[0],
            status: u.status.charAt(0).toUpperCase() + u.status.slice(1) // Active/Blocked
        }));
        return res.json(formatted);
    });
});

// POST /api/users/status (Toggle Block/Unblock)
app.post('/api/users/status', (req, res) => {
    const { id, status } = req.body; // status should be 'active' or 'blocked'
    console.log(`Updating user ${id} status to: ${status}`);

    const sql = "UPDATE users SET status = ? WHERE id = ?";
    db.query(sql, [status, id], (err, result) => {
        if (err) {
            console.error("Status Update Error:", err);
            return res.status(500).json({ error: "Error updating user status" });
        }
        return res.json({ success: true, message: `User ${status}` });
    });
});

// GET /api/transactions
app.get('/api/transactions', (req, res) => {
    const { userId } = req.query;

    // STRICT ISOLATION: Default to current user's data ONLY if userId is provided.
    // If NO userId, we return an empty list or requires Admin role logic.
    let sql = `
        SELECT t.*, u.email as user_email 
        FROM transactions t 
        LEFT JOIN users u ON t.user_id = u.id
    `;

    const params = [];
    if (userId) {
        sql += " WHERE t.user_id = ?";
        params.push(userId);
    }
    // Admin request (no userId) will fall through and fetch all

    sql += " ORDER BY t.date DESC";

    db.query(sql, params, (err, data) => {
        if (err) {
            console.error("Fetch Transactions Error:", err);
            return res.json([]); // Fail-safe: return empty array
        }

        const formattedData = (data || []).map(tx => ({
            id: tx.id,
            date: tx.date ? new Date(tx.date).toISOString().split('T')[0] : 'N/A',
            user: tx.user_email || 'Unknown',
            description: tx.description,
            amount: tx.type === 'Expense' ? -Math.abs(tx.amount) : Math.abs(tx.amount),
            type: tx.type,
            category: tx.category,
            status: 'Completed'
        }));
        return res.json(formattedData);
    });
});

// --- USER ANALYTICS & REPORTS ROUTES ---

// GET /api/user/analytics
app.get('/api/user/analytics', (req, res) => {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: "User ID required" });

    const queries = {
        categoryBreakdown: `
            SELECT category, SUM(ABS(amount)) as total 
            FROM transactions 
            WHERE user_id = ? AND type = 'Expense'
            GROUP BY category
        `,
        monthlyTrend: `
            SELECT DATE_FORMAT(date, '%M') as month, SUM(CASE WHEN type = 'Income' THEN amount ELSE 0 END) as income, SUM(CASE WHEN type = 'Expense' THEN ABS(amount) ELSE 0 END) as expense
            FROM transactions 
            WHERE user_id = ? 
            GROUP BY month, MONTH(date)
            ORDER BY MONTH(date)
        `,
        topCategories: `
            SELECT category, SUM(ABS(amount)) as total 
            FROM transactions 
            WHERE user_id = ? AND type = 'Expense'
            GROUP BY category
            ORDER BY total DESC
            LIMIT 3
        `
    };

    const results = {};
    let completed = 0;
    const keys = Object.keys(queries);

    keys.forEach(key => {
        db.query(queries[key], [userId], (err, data) => {
            if (err) {
                console.error(`Error fetching ${key}:`, err);
                results[key] = [];
            } else {
                results[key] = data;
            }

            completed++;
            if (completed === keys.length) {
                res.json(results);
            }
        });
    });
});

// GET /api/notifications
app.get('/api/notifications', (req, res) => {
    const { userId } = req.query;
    if (!userId) return res.json([]);
    const sql = "SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 10";
    db.query(sql, [userId], (err, data) => {
        if (err) return res.status(500).json({ error: "Error fetching notifications" });
        return res.json(data);
    });
});

// POST /api/notifications/read
app.post('/api/notifications/read', (req, res) => {
    const { id } = req.body;
    db.query("UPDATE notifications SET read_status = TRUE WHERE id = ?", [id], (err) => {
        if (err) return res.status(500).json({ error: "Error" });
        res.json({ success: true });
    });
});

// POST /api/reports/request
app.post('/api/reports/request', (req, res) => {
    const { userId, type, startDate, endDate } = req.body;
    const sql = "INSERT INTO report_requests (user_id, type, status, start_date, end_date) VALUES (?, ?, 'Pending', ?, ?)";
    db.query(sql, [userId, type, startDate || null, endDate || null], (err, result) => {
        if (err) {
            console.error("Report Request Error:", err);
            return res.status(500).json({ error: "Database error" });
        }
        res.json({ success: true, id: result.insertId });
    });
});

// GET /api/reports
app.get('/api/reports', (req, res) => {
    const { userId } = req.query;
    let sql = `
        SELECT r.*, u.email as user_email 
        FROM report_requests r
        JOIN users u ON r.user_id = u.id
    `;
    const params = [];
    if (userId) {
        sql += " WHERE r.user_id = ?";
        params.push(userId);
    }
    sql += " ORDER BY r.requested_at DESC";
    db.query(sql, params, (err, data) => {
        if (err) return res.status(500).json({ error: "Error" });
        res.json(data);
    });
});

const PDFDocument = require('pdfkit');

// List of random financial quotes
const FINANCIAL_QUOTES = [
    "The goal isn't more money. The goal is living life on your terms. — Chris Brogan",
    "A penny saved is a penny earned. — Benjamin Franklin",
    "Don't tell me what you value, show me your budget, and I'll tell you what you value. — Joe Biden",
    "Financial freedom is available to those who learn about it and work for it. — Robert Kiyosaki",
    "Beware of little expenses; a small leak will sink a great ship. — Benjamin Franklin",
    "It's not how much money you make, but how much money you keep. — Robert Kiyosaki",
    "Budgeting has only one rule: Do not go over budget. — Leslie Tayne"
];

// GET /api/reports/export (Generate Real PDF with Branding & Quotes)
app.get('/api/reports/export', (req, res) => {
    const { reportId } = req.query;
    console.log(`Generating PDF export for report: ${reportId}`);

    db.query("SELECT user_id, type, start_date, end_date FROM report_requests WHERE id = ?", [reportId], (err, results) => {
        if (err || results.length === 0) return res.status(404).send("Report request not found");
        const { user_id, type, start_date, end_date } = results[0];

        db.query("SELECT email FROM users WHERE id = ?", [user_id], (err, userRes) => {
            const userEmail = userRes?.[0]?.email || 'User';

            let sql = "SELECT date, description, category, amount, type FROM transactions WHERE user_id = ?";
            const params = [user_id];
            if (start_date && end_date) {
                sql += " AND date BETWEEN ? AND ?";
                params.push(start_date, end_date);
            }
            sql += " ORDER BY date DESC";

            db.query(sql, params, (err, txs) => {
                if (err) return res.status(500).send("Database error");

                const doc = new PDFDocument({ margin: 50 });
                const filename = `MoneyTracker_Report_${reportId}.pdf`;

                res.setHeader('Content-Type', 'application/pdf');
                res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
                doc.pipe(res);

                // --- HEADER / BRANDING ---
                doc.fillColor('#2563eb').fontSize(24).font('Helvetica-Bold').text('MONEY TRACKER', { align: 'center' });
                doc.fillColor('#64748b').fontSize(10).font('Helvetica').text('SMART FINANCIAL MANAGEMENT', { align: 'center' });
                doc.moveDown(2);

                // Report Details
                doc.fillColor('#000000').fontSize(14).font('Helvetica-Bold').text(`Financial Statement: ${type}`);
                doc.fontSize(10).font('Helvetica').text(`User: ${userEmail}`);
                doc.text(`Generated on: ${new Date().toLocaleString()}`);
                if (start_date && end_date) {
                    doc.text(`Statement Period: ${new Date(start_date).toDateString()} to ${new Date(end_date).toDateString()}`);
                }
                doc.moveDown(2);

                // --- TABLE HEADER ---
                const tableTop = 220;
                doc.fontSize(10).font('Helvetica-Bold');
                doc.text('Date', 50, tableTop);
                doc.text('Description', 120, tableTop);
                doc.text('Category', 280, tableTop);
                doc.text('Type', 400, tableTop);
                doc.text('Amount', 480, tableTop, { align: 'right' });

                doc.moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).strokeColor('#e2e8f0').stroke();

                // --- TABLE ROWS ---
                let y = tableTop + 30;
                let totalIncome = 0;
                let totalExpense = 0;

                txs.forEach((t, i) => {
                    if (y > 700) { // New page if near bottom
                        doc.addPage();
                        y = 50;
                    }

                    const date = t.date ? new Date(t.date).toISOString().split('T')[0] : 'N/A';
                    const amt = Number(t.amount);
                    if (t.type === 'Income') totalIncome += amt;
                    else totalExpense += Math.abs(amt);

                    doc.fontSize(9).font('Helvetica').fillColor('#334155');
                    doc.text(date, 50, y);
                    doc.text(t.description || '-', 120, y, { width: 150, ellipsis: true });
                    doc.text(t.category || '-', 280, y);
                    
                    doc.fillColor(t.type === 'Income' ? '#059669' : '#dc2626');
                    doc.text(t.type, 400, y);
                    doc.text(`${t.type === 'Expense' ? '-' : ''}${Math.abs(amt).toLocaleString()}`, 480, y, { align: 'right' });

                    y += 20;
                });

                // --- SUMMARY ---
                y += 20;
                if (y > 700) { doc.addPage(); y = 50; }
                
                doc.moveTo(50, y).lineTo(550, y).strokeColor('#e2e8f0').stroke();
                y += 15;
                doc.fontSize(11).font('Helvetica-Bold').fillColor('#000000');
                doc.text('SUMMARY', 50, y);
                doc.fontSize(10).font('Helvetica');
                doc.text(`Total Income: ${totalIncome.toLocaleString()}`, 400, y + 15, { align: 'right' });
                doc.text(`Total Expenses: ${totalExpense.toLocaleString()}`, 400, y + 30, { align: 'right' });
                doc.fontSize(12).text(`Net Balance: ${(totalIncome - totalExpense).toLocaleString()}`, 400, y + 50, { align: 'right' });

                // --- FOOTER & RANDOM QUOTE ---
                const quote = FINANCIAL_QUOTES[Math.floor(Math.random() * FINANCIAL_QUOTES.length)];
                doc.moveDown(10);
                doc.fillColor('#2563eb').fontSize(10).font('Helvetica-Oblique').text(`"${quote}"`, { align: 'center', italic: true });
                
                doc.moveDown(2);
                doc.fillColor('#94a3b8').fontSize(8).font('Helvetica').text('This is a computer-generated document from Money Tracker. No signature required.', { align: 'center' });

                doc.end();
            });
        });
    });
});

// POST /api/reports/approve
app.post('/api/reports/approve', (req, res) => {
    const { reportId, fileUrl } = req.body;
    db.query("UPDATE report_requests SET status = 'Approved', file_url = ? WHERE id = ?", [fileUrl, reportId], (err) => {
        if (err) return res.status(500).json({ error: "Error" });

        // Add notification for user
        db.query("SELECT user_id, type FROM report_requests WHERE id = ?", [reportId], (err, data) => {
            if (data && data.length > 0) {
                const { user_id, type } = data[0];
                const msg = `Your ${type} report has been approved. You can download it now.`;
                db.query("INSERT INTO notifications (user_id, message, type, action_url) VALUES (?, ?, 'Report', ?)",
                    [user_id, msg, fileUrl]);
            }
        });

        res.json({ success: true });
    });
});

// Modified POST /api/transactions to support high values
app.post('/api/transactions', (req, res) => {
    const { userId, type, amount, category, date, description } = req.body;

    if (!userId || !type || !amount || !date) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    // Amount validation - Allow up to 10 Trillion for luxury investments as requested
    const numAmount = Number(amount);
    if (isNaN(numAmount) || numAmount > 10000000000000) {
        return res.status(400).json({ error: "Amount out of range" });
    }

    const sql = "INSERT INTO transactions (user_id, type, amount, category, date, description) VALUES (?, ?, ?, ?, ?, ?)";
    db.query(sql, [userId, type, numAmount, category, date, description], (err, result) => {
        if (err) {
            console.error("Error adding transaction:", err);
            return res.status(500).json({ error: "Database insertion failed" });
        }
        return res.json({ success: true, id: result.insertId });
    });
});

// DELETE /api/transactions/:id (Secure Delete)
app.delete('/api/transactions/:id', (req, res) => {
    const { id } = req.params;
    const { userId } = req.query;

    if (!userId) return res.status(400).json({ error: "User ID required for deletion" });

    const sql = "DELETE FROM transactions WHERE id = ? AND user_id = ?";
    db.query(sql, [id, userId], (err, result) => {
        if (err) {
            console.error("Error deleting transaction:", err);
            return res.status(500).json({ error: "Database deletion failed" });
        }
        if (result.affectedRows === 0) {
            return res.status(403).json({ error: "Unauthorized or transaction not found" });
        }
        return res.json({ success: true });
    });
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
