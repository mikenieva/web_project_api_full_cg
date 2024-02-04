const express = require('express');

const mongoose = require('mongoose');

const { errors } = require('celebrate');

const cors = require('cors');

require('dotenv').config();

const { login, createUser } = require('./controllers/users');

// const auth = require('./middleware/auth');

const { PORT = 3000 } = process.env;

const userRoutes = require('./routes/users');
const cardRoutes = require('./routes/cards');

const { requestLogger, errorLogger } = require('./middleware/logger');

const app = express();

mongoose
  .connect('mongodb://localhost:27017/aroundb')
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Failed to connect to MongoDB', err));

app.use(express.json());

app.use(requestLogger);

app.use(cors());
app.options('*', cors());

app.post('/signup', createUser);
app.post('/signin', login);

// app.use(auth);

app.use(userRoutes);

app.use(cardRoutes);

app.use('*', (req, res) => {
  res.status(404).send({ message: 'Requested resource not found' });
});

// middleware de logs de errores
app.use(errorLogger);

// middleware de errores de celebrate
app.use(errors());

// middleware majeador central de errores
app.use((err, req, res, next) => {
  // si un error no tiene estado, se muestra 500
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    // comprueba el estado y muestra un mensaje basado en dicho estado
    message:
      statusCode === 500 ? 'Se ha producido un error en el servidor' : message,
  });
});

app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});
