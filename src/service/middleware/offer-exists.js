'use strict';

const {HttpCode} = require(`../const`);

module.exports = (service) => async (req, res, next) => {
  const {offerId} = req.params;
  const {comments} = req.query;
  const offer = await service.findOne(offerId, comments);

  if (!offer) {
    return res.status(HttpCode.NOT_FOUND)
      .send(`Offer with ${offerId} not found`);
  }

  res.locals.offer = offer;
  return next();
};
