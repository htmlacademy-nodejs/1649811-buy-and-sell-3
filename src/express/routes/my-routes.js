'use strict';

const express = require(`express`);
const api = require(`../api`).getAPI();
const {calculatePagination, getTotalPages} = require(`../../utils`);

const router = new express.Router();

router.get(`/`, async (req, res) => {

  const [page, limit, offset] = calculatePagination(req.query);

  const [
    {count, offers},
    categories
  ] = await Promise.all([
    api.getOffers({limit, offset}),
    api.getCategories(true),
  ]);

  const totalPages = getTotalPages(count);

  res.render(`my/tickets`, {offers, categories, page, totalPages});
});
router.get(`/comments`, async (req, res) => {
  const offers = await api.getOffers({comments: true});
  res.render(`my/comments`, {offers: offers.slice(0, 3)});
});


module.exports = router;
