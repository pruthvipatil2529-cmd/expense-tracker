CREATE DATABASE IF NOT EXISTS restaurant_db;
USE restaurant_db;

-- 1. Staff & Admin Users
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'staff') DEFAULT 'staff',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Menu Items
CREATE TABLE menu (
    id INT AUTO_INCREMENT PRIMARY KEY,
    item_name VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    category VARCHAR(50) -- e.g., 'Starter', 'Main Course', 'Drinks'
);

-- 3. Order History (For Reports)
CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    table_number INT NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    tax_amount DECIMAL(10, 2) NOT NULL,
    payment_method ENUM('Cash', 'Online') NOT NULL,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);