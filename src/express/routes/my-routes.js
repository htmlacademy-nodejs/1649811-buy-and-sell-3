'use strict';

const express = require(`express`);
const api = require(`../api`).getAPI();
const privateRoute = require(`../middleware/private-route`);
const {calculatePagination, getTotalPages, asyncWrapper} = require(`../utils`);
const {USER_COOKIE_NAME} = require(`../const`);

const router = new express.Router();

router.get(`/`, privateRoute, asyncWrapper(async (req, res) => {

  const [page, limit, offset] = calculatePagination(req.query);
  const {id: userId} = res.locals.loggedUser;

  const [
    {count, offers},
    categories
  ] = await Promise.all([
    api.getMyOffers({limit, offset}, userId),
    api.getCategories(true),
  ]);

  const totalPages = getTotalPages(count);

  res.render(`my/tickets`, {offers, categories, page, totalPages});
}));

router.get(`/comments`, privateRoute, asyncWrapper(async (req, res) => {
  const {offerId, commentId} = req.query;

  if (offerId && commentId) {
    const token = req.signedCookies[USER_COOKIE_NAME];
    await api.deleteComment(offerId, commentId, token);
  }
  const {id: userId} = res.locals.loggedUser;
  const offers = await api.getMyComments(userId);

  res.render(`my/comments`, {offers});
}));


module.exports = router;
