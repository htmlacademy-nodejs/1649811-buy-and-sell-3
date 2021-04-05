'use strict';

module.exports = (req, res, next) => {
  const {loggedUser} = res.locals;
  if (!loggedUser) {
    res.redirect(`/login`);
  }

  next();
};
