
CREATE DATABASE IF NOT EXISTS expense_tracker;
USE expense_tracker;

-- Users Table (Updated Schema to match user request - Removed 'name')
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user',
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Transactions Table
CREATE TABLE IF NOT EXISTS transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    type ENUM('Income', 'Expense') NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    category VARCHAR(255),
    date DATE NOT NULL,
    description VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Report Requests Table (Admin verification needed)
CREATE TABLE IF NOT EXISTS report_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    type VARCHAR(50), -- PDF, EXCEL
    status VARCHAR(50) DEFAULT 'Pending', -- Pending, Approved
    file_url TEXT,
    requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    message TEXT,
    type VARCHAR(50), -- Report, Account
    read_status BOOLEAN DEFAULT FALSE,
    action_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Categories Table
CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    icon VARCHAR(100) DEFAULT 'ShoppingBag',
    color VARCHAR(100) DEFAULT '#3b82f6',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- INSERT ADMIN USER (Hardcoded)
INSERT IGNORE INTO users (email, password, role, status) 
VALUES ('admin@19', 'raj27', 'admin', 'active');
