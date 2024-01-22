const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() =>
      res.status(500).send({ message: 'An error has ocurred on the server' })
    );
};

module.exports.getUserById = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      if (user) {
        res.send({ data: user });
      } else {
        res.status(404).send({ message: 'User ID not found' });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Invalid user ID' });
      } else {
        res.status(500).send({ message: 'An error has ocurred on the server' });
      }
    });
};

module.exports.createUser = (req, res) => {
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => User.create({ ...req.body, password: hash }))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Invalid user data' });
      } else {
        res.status(500).send({ message: 'An error has ocurred on the server' });
      }
    });
};

module.exports.updateProfile = (req, res) => {
  const userId = req.user._id;
  const { name, about } = req.body;

  if (name === undefined && about === undefined) {
    return res.status(400).send({ message: 'No fields to update' });
  }

  return User.findByIdAndUpdate(
    userId,
    { name, about },
    { new: true, runValidators: true }
  )
    .orFail()
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Invalid user data' });
      } else if (err.name === 'DocumentNotFoundError') {
        res.status(404).send({ message: 'User not found' });
      } else {
        res.status(500).send({ message: 'An error has ocurred on the server' });
      }
    });
};

module.exports.updateAvatar = (req, res) => {
  const userId = req.user._id;
  const { avatar } = req.body;

  if (avatar === undefined) {
    return res.status(400).send({ message: 'No avatar URL provided' });
  }

  return User.findByIdAndUpdate(
    userId,
    { avatar },
    { new: true, runValidators: true }
  )
    .orFail()
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Invalid avatar URL' });
      } else if (err.name === 'DocumentNotFoundError') {
        res.status(404).send({ message: 'User not found' });
      } else {
        res.status(500).send({ message: 'An error has ocurred on the server' });
      }
    });
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      // estamos creando un token
      const token = jwt.sign({ _id: user._id.toString() }, 'some-secret-key', {
        expiresIn: '7 days',
      });

      // devolvemos el token
      return res.send({ token });
    })
    .catch((err) => res.status(401).send({ message: err.message }));
};
