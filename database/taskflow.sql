CREATE DATABASE IF NOT EXISTS taskflow
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE taskflow;

CREATE TABLE IF NOT EXISTS tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    priority ENUM('low', 'normal', 'high') NOT NULL DEFAULT 'normal',
    due_date DATE NULL,
    is_done TINYINT(1) NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
