CREATE DATABASE calendify;
USE calendify;

CREATE TABLE users(
    id INT NOT NULL AUTO_INCREMENT,
    username VARCHAR(256),
    fullname VARCHAR(256),
    email VARCHAR(256),
    password VARCHAR(256),
    address VARCHAR(256),
    phone_number VARCHAR(10),
    last_login DATETIME,
    isAdmin BOOLEAN,
    PRIMARY KEY (id)
);

INSERT INTO users (username, fullname, email, phone_number, password, isAdmin) VALUES ("admin", "admin", "admin@admin.com","1111111111", "password123", true);

CREATE TABLE Events (
    id int AUTO_INCREMENT,
    name varchar(64),
    description varchar(512),
    time TIME,
    date DATE,
    fee int,
    host int,
    location varchar(256),
    custom_link varchar(64),
    UNIQUE (custom_link),
    PRIMARY KEY (id),
    FOREIGN KEY (host) REFERENCES users(id)
);

CREATE TABLE EventList (
    id int AUTO_INCREMENT,
    availability BOOLEAN,
    message varchar(512),
    suggestedDate DATE,
    suggestedTime TIME,
    event int,
    user int,
    PRIMARY KEY (id),
    FOREIGN KEY(user) REFERENCES users(id),
    FOREIGN KEY(event) REFERENCES Events(id)
);