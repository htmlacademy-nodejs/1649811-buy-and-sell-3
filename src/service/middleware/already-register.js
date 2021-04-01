'use strict';

const {HttpCode} = require(`../../constants`);

module.exports = (service) => async (req, res, next) => {
  const {email} = req.body;

  const user = await service.findByEmail(email);

  if (user) {
    return res.status(HttpCode.BAD_REQUEST)
      .json({message: [`"email" ${email} already exist`]});
  }

  return next();
};
