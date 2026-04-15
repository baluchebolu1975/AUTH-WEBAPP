import pool from '../config/db.js';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

const SALT_ROUNDS = 12;

export const findUserByEmail = async (email) => {
  const [rows] = await pool.query(
    'SELECT * FROM users WHERE email = ? LIMIT 1', [email]
  );
  return rows[0] || null;
};

export const findUserByUsername = async (username) => {
  const [rows] = await pool.query(
    'SELECT * FROM users WHERE username = ? LIMIT 1', [username]
  );
  return rows[0] || null;
};

export const findUserById = async (id) => {
  const [rows] = await pool.query(
    'SELECT id, uuid, first_name, last_name, username, email, role, is_active, is_verified, avatar_url, created_at, updated_at FROM users WHERE id = ? LIMIT 1',
    [id]
  );
  return rows[0] || null;
};

export const createUser = async ({ firstName, lastName, username, email, password }) => {
  const password_hash = await bcrypt.hash(password, SALT_ROUNDS);
  const uuid = uuidv4();
  const [result] = await pool.query(
    `INSERT INTO users (uuid, first_name, last_name, username, email, password_hash)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [uuid, firstName, lastName, username, email, password_hash]
  );
  return result.insertId;
};

export const verifyPassword = async (plaintext, hash) =>
  bcrypt.compare(plaintext, hash);

export const getAllUsers = async ({ page = 1, limit = 20, search = '' }) => {
  const offset = (page - 1) * limit;
  const like = `%${search}%`;
  const [rows] = await pool.query(
    `SELECT id, uuid, first_name, last_name, username, email, role, is_active, is_verified, created_at, updated_at
     FROM users
     WHERE (first_name LIKE ? OR last_name LIKE ? OR email LIKE ? OR username LIKE ?)
     ORDER BY created_at DESC
     LIMIT ? OFFSET ?`,
    [like, like, like, like, limit, offset]
  );
  const [[{ total }]] = await pool.query(
    `SELECT COUNT(*) AS total FROM users
     WHERE (first_name LIKE ? OR last_name LIKE ? OR email LIKE ? OR username LIKE ?)`,
    [like, like, like, like]
  );
  return { users: rows, total, page, limit, pages: Math.ceil(total / limit) };
};

export const updateUser = async (id, fields) => {
  const allowed = ['first_name', 'last_name', 'username', 'email', 'role', 'is_active', 'is_verified'];
  const updates = Object.entries(fields)
    .filter(([k]) => allowed.includes(k))
    .map(([k, v]) => [k, v]);

  if (!updates.length) return false;
  const setClauses = updates.map(([k]) => `${k} = ?`).join(', ');
  const values = [...updates.map(([, v]) => v), id];
  await pool.query(`UPDATE users SET ${setClauses} WHERE id = ?`, values);
  return true;
};

export const deleteUser = async (id) => {
  await pool.query('DELETE FROM users WHERE id = ?', [id]);
};

export const logLoginAttempt = async ({ email, ip, success, reason = null }) => {
  await pool.query(
    `INSERT INTO login_attempts (email, ip_address, success, failure_reason) VALUES (?, ?, ?, ?)`,
    [email, ip, success ? 1 : 0, reason]
  );
};

export const countRecentFailedAttempts = async (email, ip, windowMinutes = 15) => {
  const [[{ count }]] = await pool.query(
    `SELECT COUNT(*) AS count FROM login_attempts
     WHERE (email = ? OR ip_address = ?) AND success = 0
       AND attempted_at > DATE_SUB(NOW(), INTERVAL ? MINUTE)`,
    [email, ip, windowMinutes]
  );
  return count;
};
