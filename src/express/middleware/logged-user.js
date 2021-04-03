'use strict';

const {USER_COOKIE} = require(`../const`);

module.exports = (req, res, next) => {
  const user = req.signedCookies[USER_COOKIE];
  if (user) {
    res.locals.loggedUser = JSON.parse(user);
    res.locals.isLogged = true;
  }

  return next();
};
