'use strict';

const {HttpCode} = require(`../../constants`);

module.exports = (service) => async (req, res, next) => {
  const {email, password} = req.body;

  const user = await service.findByEmail(email);
  if (!user) {
    return res.status(HttpCode.NOT_FOUND)
      .send(`User with ${email} not found`);
  }

  if (!await service.checkAuth(user, password)) {
    return res.status(HttpCode.UNAUTHORIZED)
      .send(`Wrong password`);
  }

  req.session.isLogged = true;
  req.session.username = user.email;

  return next();
};
