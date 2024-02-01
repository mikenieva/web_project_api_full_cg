const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  console.log(authorization);
  console.log(req.headers);

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(401).send({ message: 'Se requiere autorización' });
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(
      token,
      NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret'
    );
  } catch (err) {
    return res.status(401).send({ message: 'tambien requiere autorización' });
  }

  req.user = payload; // asigna el payload al objeto de solicitud
  res.send(req.user);
  next(); // envía la solicitud al siguiente middleware

  return null;
};
