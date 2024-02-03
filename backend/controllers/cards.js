const Card = require('../models/cards');

const NotFoundError = require('../errors/not-found-error');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .sort({ createdAt: -1 })
    .orFail(() => new NotFoundError('No se ha encontrado ninguna tarjeta'))
    .then((cards) => res.send(cards))
    .catch((err) => next(err));
};

module.exports.createCard = (req, res, next) => {
  const userId = req.user._id; // _id se volverá accesible luego de la autenticación
  const { name, link } = req.body;

  if (!req.body) {
    return res.status(400).send({ message: 'Request body is required' });
  }

  if (!name || !link) {
    return res.status(400).send({ message: 'name and link are required' });
  }

  return Card.create({ name, link, owner: userId })
    .then((card) => res.send(card))
    .catch((err) => next(err));
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail(() => new NotFoundError('No se ha encontrado ninguna tarjeta')) // si no se encuentra la tarjeta, se ejecuta el error
    .then((card) => {
      if (card.owner.toString() !== req.user._id) {
        return res.status(403).send({ message: 'Forbidden' });
      }
      return Card.deleteOne(card)
        .then(() => res.send({ data: card }))
        .catch((err) => next(err));
    })
    .catch((err) => next(err));
};

module.exports.likeCard = (req, res, next) => {
  const userId = req.user._id;
  const { cardId } = req.params;

  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: userId } },
    { new: true }
  )
    .orFail(() => new NotFoundError('Card not found')) // si no se encuentra la tarjeta, se ejecuta el error
    .then((card) => res.send(card))
    .catch((err) => next(err));
};

module.exports.unlikeCard = (req, res, next) => {
  const userId = req.user._id;
  const { cardId } = req.params;

  Card.findByIdAndUpdate(cardId, { $pull: { likes: userId } }, { new: true })
    .orFail(() => new NotFoundError('Card not found')) // si no se encuentra la tarjeta, se ejecuta el error
    .then((card) => res.send(card))
    .catch((err) => next(err));
};
