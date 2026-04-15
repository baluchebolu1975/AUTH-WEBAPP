import pool from '../config/db.js';
import bcrypt from 'bcryptjs';

export const createSession = async ({ userId, refreshToken, ip, userAgent }) => {
  const hash = await bcrypt.hash(refreshToken, 10);
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  await pool.query(
    `INSERT INTO sessions (user_id, refresh_token_hash, ip_address, user_agent, expires_at)
     VALUES (?, ?, ?, ?, ?)`,
    [userId, hash, ip, userAgent, expires]
  );
};

export const findSession = async (refreshToken) => {
  const [rows] = await pool.query(
    `SELECT s.*, u.id as user_id, u.role, u.is_active FROM sessions s
     JOIN users u ON s.user_id = u.id
     WHERE s.expires_at > NOW()`,
  );
  for (const row of rows) {
    const match = await bcrypt.compare(refreshToken, row.refresh_token_hash);
    if (match) return row;
  }
  return null;
};

export const deleteSessionByToken = async (refreshToken) => {
  const [rows] = await pool.query(`SELECT id, refresh_token_hash FROM sessions WHERE expires_at > NOW()`);
  for (const row of rows) {
    const match = await bcrypt.compare(refreshToken, row.refresh_token_hash);
    if (match) {
      await pool.query('DELETE FROM sessions WHERE id = ?', [row.id]);
      return true;
    }
  }
  return false;
};

export const deleteUserSessions = async (userId) => {
  await pool.query('DELETE FROM sessions WHERE user_id = ?', [userId]);
};
