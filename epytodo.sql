DROP DATABASE IF EXISTS epytodo;
create database epytodo;
USE epytodo;

CREATE TABLE user (
    id INT AUTO_INCREMENT primary key NOT NULL,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(100) NOT NULL,
    name VARCHAR(100) NOT NULL,
    firstname VARCHAR(100) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE todo (
    id INT AUTO_INCREMENT primary key NOT NULL,
    title VARCHAR(100) NOT NULL,
    description VARCHAR(100) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    due_time DATE,
    status VARCHAR(100) NOT NULL,
    user_id INT
);
