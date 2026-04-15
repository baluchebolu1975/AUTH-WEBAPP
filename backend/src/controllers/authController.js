import { v4 as uuidv4 } from 'uuid';
import * as userService from '../services/userService.js';
import * as sessionService from '../services/sessionService.js';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt.js';
import { success, error } from '../utils/response.js';

const safeUser = (u) => ({
  id: u.id, uuid: u.uuid, firstName: u.first_name, lastName: u.last_name,
  username: u.username, email: u.email, role: u.role,
  isVerified: u.is_verified, avatarUrl: u.avatar_url, createdAt: u.created_at,
});

export const signup = async (req, res) => {
  try {
    const { firstName, lastName, username, email, password } = req.body;

    const [existingEmail, existingUsername] = await Promise.all([
      userService.findUserByEmail(email),
      userService.findUserByUsername(username),
    ]);
    if (existingEmail) return error(res, 'Email already registered', 409);
    if (existingUsername) return error(res, 'Username already taken', 409);

    const userId = await userService.createUser({ firstName, lastName, username, email, password });
    const user = await userService.findUserById(userId);

    const accessToken  = signAccessToken({ id: user.id, role: user.role });
    const refreshToken = signRefreshToken({ id: user.id });

    await sessionService.createSession({
      userId: user.id,
      refreshToken,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
    });

    return success(res, { user: safeUser(user), accessToken, refreshToken }, 'Account created successfully', 201);
  } catch (err) {
    console.error('[signup]', err);
    return error(res, 'Registration failed', 500);
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const ip = req.ip;

    const recentFails = await userService.countRecentFailedAttempts(email, ip);
    if (recentFails >= 5)
      return error(res, 'Too many failed attempts. Try again in 15 minutes.', 429);

    const user = await userService.findUserByEmail(email);
    if (!user) {
      await userService.logLoginAttempt({ email, ip, success: false, reason: 'user_not_found' });
      return error(res, 'Invalid email or password', 401);
    }

    if (!user.is_active) {
      await userService.logLoginAttempt({ email, ip, success: false, reason: 'account_inactive' });
      return error(res, 'Account is deactivated', 403);
    }

    const valid = await userService.verifyPassword(password, user.password_hash);
    if (!valid) {
      await userService.logLoginAttempt({ email, ip, success: false, reason: 'wrong_password' });
      return error(res, 'Invalid email or password', 401);
    }

    await userService.logLoginAttempt({ email, ip, success: true });

    const accessToken  = signAccessToken({ id: user.id, role: user.role });
    const refreshToken = signRefreshToken({ id: user.id });

    await sessionService.createSession({
      userId: user.id,
      refreshToken,
      ip,
      userAgent: req.get('User-Agent'),
    });

    return success(res, { user: safeUser(user), accessToken, refreshToken }, 'Login successful');
  } catch (err) {
    console.error('[login]', err);
    return error(res, 'Login failed', 500);
  }
};

export const refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return error(res, 'Refresh token required', 401);

    let decoded;
    try { decoded = verifyRefreshToken(refreshToken); }
    catch { return error(res, 'Invalid or expired refresh token', 401); }

    const session = await sessionService.findSession(refreshToken);
    if (!session) return error(res, 'Session not found', 401);

    const newAccess  = signAccessToken({ id: decoded.id, role: session.role });
    const newRefresh = signRefreshToken({ id: decoded.id });

    await sessionService.deleteSessionByToken(refreshToken);
    await sessionService.createSession({
      userId: decoded.id,
      refreshToken: newRefresh,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
    });

    return success(res, { accessToken: newAccess, refreshToken: newRefresh }, 'Token refreshed');
  } catch (err) {
    console.error('[refresh]', err);
    return error(res, 'Token refresh failed', 500);
  }
};

export const logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (refreshToken) await sessionService.deleteSessionByToken(refreshToken);
    return success(res, {}, 'Logged out successfully');
  } catch (err) {
    console.error('[logout]', err);
    return error(res, 'Logout failed', 500);
  }
};

export const me = async (req, res) => {
  try {
    const user = await userService.findUserById(req.user.id);
    if (!user) return error(res, 'User not found', 404);
    return success(res, { user: safeUser(user) });
  } catch (err) {
    return error(res, 'Failed to fetch profile', 500);
  }
};
