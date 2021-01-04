'use strict';

const {HttpCode} = require(`../../constants`);

module.exports = (keys) => (req, res, next) => {
  const item = req.body;
  const itemKeys = Object.keys(item);
  const keysExists = keys.every((key) => itemKeys.includes(key));

  if (!keysExists) {
    return res.status(HttpCode.BAD_REQUEST).send(`Bad request`);
  }

  return next();
};
