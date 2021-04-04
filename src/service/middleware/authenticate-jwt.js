'use strict';

const jwt = require(`jsonwebtoken`);
const {HttpCode} = require(`../const`);
const {JWT_ACCESS_SECRET} = process.env;

module.exports = (req, res, next) => {
  const authorization = req.headers[`authorization`];

  if (!authorization) {
    return res.sendStatus(HttpCode.UNAUTHORIZED);
  }

  const [, token] = authorization.split(` `);

  if (!token) {
    return res.sendStatus(HttpCode.UNAUTHORIZED);
  }

  jwt.verify(token, JWT_ACCESS_SECRET, (err, userData) => {

    if (err) {
      return res.sendStatus(HttpCode.FORBIDDEN);
    }

    res.locals.user = userData;

    return next();
  });

  return null;
};
