'use strict';

module.exports = (req, res, next) => {
  const {isLogged} = res.locals;
  if (!isLogged) {
    return res.redirect(`/login`);
  }

  return next();
};
