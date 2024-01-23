const { Router } = require('express');

const router = Router();

const {
  getUsers,
  getUserById,
  updateProfile,
  updateAvatar,
  getAuthenticatedUser,
} = require('../controllers/users');

router.get('/users', getUsers);

router.get('/users/:userId', getUserById);

router.patch('/users/me', updateProfile);

router.patch('/users/me/avatar', updateAvatar);

router.get('/users/me', getAuthenticatedUser);

module.exports = router;
