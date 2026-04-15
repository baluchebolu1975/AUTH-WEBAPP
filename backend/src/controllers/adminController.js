import * as userService from '../services/userService.js';
import { success, error } from '../utils/response.js';

export const listUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, search = '' } = req.query;
    const data = await userService.getAllUsers({ page: +page, limit: +limit, search });
    return success(res, data);
  } catch (err) {
    console.error('[admin:listUsers]', err);
    return error(res, 'Failed to fetch users', 500);
  }
};

export const getUser = async (req, res) => {
  try {
    const user = await userService.findUserById(req.params.id);
    if (!user) return error(res, 'User not found', 404);
    return success(res, { user });
  } catch (err) {
    return error(res, 'Failed to fetch user', 500);
  }
};

export const updateUser = async (req, res) => {
  try {
    const { first_name, last_name, username, email, role, is_active, is_verified } = req.body;
    await userService.updateUser(req.params.id, { first_name, last_name, username, email, role, is_active, is_verified });
    const updated = await userService.findUserById(req.params.id);
    return success(res, { user: updated }, 'User updated');
  } catch (err) {
    console.error('[admin:updateUser]', err);
    return error(res, 'Failed to update user', 500);
  }
};

export const deleteUser = async (req, res) => {
  try {
    if (+req.params.id === req.user.id)
      return error(res, 'Cannot delete your own account', 400);
    await userService.deleteUser(req.params.id);
    return success(res, {}, 'User deleted');
  } catch (err) {
    return error(res, 'Failed to delete user', 500);
  }
};
