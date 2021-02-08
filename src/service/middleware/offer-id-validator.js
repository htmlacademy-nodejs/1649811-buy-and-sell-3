'use strict';

const {HttpCode} = require(`../../constants`);

const regex = /^[0-9]+$/;

module.exports = () => (
  (req, res, next) => {
    const {offerId} = req.params;

    if (!regex.test(offerId)) {
      res.status(HttpCode.NOT_FOUND).send();
      return;
    }

    next();
  }
);
