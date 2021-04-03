'use strict';

const {USER_COOKIE_NAME} = require(`../const`);

module.exports = (req, res, next) => {
  const user = req.signedCookies[USER_COOKIE_NAME];
  if (user) {
    res.locals.loggedUser = JSON.parse(user);
    res.locals.isLogged = true;
  }

  return next();
};
