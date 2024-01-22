const express = require('express');

const mongoose = require('mongoose');

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

app.use((req, res, next) => {
  req.user = {
    _id: '657f509c04765e4d0e310eab',
  };

  next();
});

const userRoutes = require('./routes/users');

const cardRoutes = require('./routes/cards');

app.use(userRoutes);
app.use(cardRoutes);

app.use('*', (req, res) => {
  res.status(404).send({ message: 'Requested resource not found' });
});

app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});
