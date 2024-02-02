const { Router } = require('express');

const router = Router();

const { celebrate, Joi } = require('celebrate');

const validator = require('validator');

const auth = require('../middleware/auth');

const {
  getUsers,
  getUserById,
  updateProfile,
  updateAvatar,
  getAuthenticatedUser,
} = require('../controllers/users');

const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error('string.uri');
};

router.get('/users', getUsers);

router.get(
  '/users/:userId',
  celebrate({
    params: Joi.object().keys({
      userId: Joi.string().alphanum().required(),
    }),
  }),
  getUserById
);

router.patch(
  '/users/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30).required,
      about: Joi.string().min(2).max(30).required,
    }),
  }),
  updateProfile
);

router.patch(
  '/users/me/avatar',
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().required().custom(validateURL),
    }),
  }),
  updateAvatar
);

router.get('/users/me', auth, getAuthenticatedUser);

module.exports = router;
