CREATE DATABASE IF NOT EXISTS crc_cards;
USE crc_cards;

CREATE TABLE users (
  id CHAR(36) PRIMARY KEY,
  forename TEXT NOT NULL,
  surname TEXT NOT NULL,
  display_name TEXT,
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE projects (
  id CHAR(36) PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  owner_id CHAR(36),
  base32_id VARCHAR(10) UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE cards (
  id CHAR(36) PRIMARY KEY,
  project_id CHAR(36) NOT NULL,
  name TEXT NOT NULL,
  style JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

CREATE TABLE collaborators (
  id CHAR(36) PRIMARY KEY,
  card_id CHAR(36) NOT NULL,
  project_id CHAR(36) NOT NULL,
  name TEXT NOT NULL,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (card_id) REFERENCES cards(id) ON DELETE CASCADE,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

CREATE TABLE responsibilities (
  id CHAR(36) PRIMARY KEY,
  card_id CHAR(36) NOT NULL,
  project_id CHAR(36) NOT NULL,
  name TEXT NOT NULL,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (card_id) REFERENCES cards(id) ON DELETE CASCADE,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);
