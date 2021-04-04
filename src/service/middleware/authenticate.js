'use strict';

const {HttpCode} = require(`../const`);

module.exports = (service) => async (req, res, next) => {
  const {email, password} = req.body;

  const user = await service.findByEmail(email);
  if (!user) {
    return res.status(HttpCode.NOT_FOUND)
      .json({message: [`User with email ${email} not found`]});
  }

  if (!await service.checkAuth(user, password)) {
    return res.status(HttpCode.UNAUTHORIZED)
      .json({message: [`Wrong password`]});
  }

  res.locals.user = user;
  return next();
};
