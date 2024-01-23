const express = require('express');

const mongoose = require('mongoose');

const { login, createUser } = require('./controllers/users');

const auth = require('./middlewares/auth');

mongoose
  .connect('mongodb://localhost:27017/aroundb', {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Failed to connect to MongoDB', err));

const { PORT = 3000 } = process.env;

const app = express();

app.use(express.json());

const userRoutes = require('./routes/users');

const cardRoutes = require('./routes/cards');

app.post('/signup', createUser);
app.post('/signin', login);

app.use(auth);

app.use(userRoutes);
app.use(cardRoutes);

app.use('*', (req, res) => {
  res.status(404).send({ message: 'Requested resource not found' });
});

app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});
