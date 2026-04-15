-- ============================================================
-- Auth Webapp Database Schema
-- MySQL 8.0 | Created: 2026-04-14
-- ============================================================

CREATE DATABASE IF NOT EXISTS auth_webapp
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE auth_webapp;

-- ------------------------------------------------------------
-- Table: users
-- Core user accounts
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  id            INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  uuid          CHAR(36)        NOT NULL DEFAULT (UUID()),
  first_name    VARCHAR(50)     NOT NULL,
  last_name     VARCHAR(50)     NOT NULL,
  username      VARCHAR(30)     NOT NULL,
  email         VARCHAR(255)    NOT NULL,
  password_hash VARCHAR(255)    NOT NULL,
  role          ENUM('user','admin') NOT NULL DEFAULT 'user',
  is_active     TINYINT(1)      NOT NULL DEFAULT 1,
  is_verified   TINYINT(1)      NOT NULL DEFAULT 0,
  avatar_url    VARCHAR(500)    NULL,
  created_at    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  UNIQUE KEY uq_users_uuid     (uuid),
  UNIQUE KEY uq_users_email    (email),
  UNIQUE KEY uq_users_username (username),
  INDEX        idx_users_role  (role),
  INDEX        idx_users_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- Table: sessions
-- Refresh token management
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS sessions (
  id                INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  user_id           INT UNSIGNED  NOT NULL,
  refresh_token_hash VARCHAR(255) NOT NULL,
  ip_address        VARCHAR(45)   NULL,
  user_agent        VARCHAR(500)  NULL,
  expires_at        DATETIME      NOT NULL,
  created_at        DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  UNIQUE KEY uq_sessions_token (refresh_token_hash),
  INDEX        idx_sessions_user (user_id),
  INDEX        idx_sessions_expires (expires_at),

  CONSTRAINT fk_sessions_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- Table: login_attempts
-- Rate limiting & security audit trail
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS login_attempts (
  id           INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  email        VARCHAR(255)  NOT NULL,
  ip_address   VARCHAR(45)   NOT NULL,
  success      TINYINT(1)    NOT NULL DEFAULT 0,
  attempted_at DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  failure_reason VARCHAR(100) NULL,

  PRIMARY KEY (id),
  INDEX idx_attempts_email   (email),
  INDEX idx_attempts_ip      (ip_address),
  INDEX idx_attempts_time    (attempted_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- Table: password_resets
-- Secure password reset tokens
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS password_resets (
  id         INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  user_id    INT UNSIGNED  NOT NULL,
  token_hash VARCHAR(255)  NOT NULL,
  expires_at DATETIME      NOT NULL,
  used       TINYINT(1)    NOT NULL DEFAULT 0,
  created_at DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  UNIQUE KEY uq_reset_token (token_hash),
  INDEX       idx_reset_user (user_id),

  CONSTRAINT fk_reset_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- Seed: Default admin account
-- Password: Admin@1234 (change immediately)
-- ------------------------------------------------------------
INSERT IGNORE INTO users (first_name, last_name, username, email, password_hash, role, is_active, is_verified)
VALUES (
  'Super', 'Admin',
  'superadmin',
  'admin@authapp.com',
  '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4tbQKDqUoW',
  'admin',
  1,
  1
);
