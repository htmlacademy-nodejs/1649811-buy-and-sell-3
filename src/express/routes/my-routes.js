'use strict';

const express = require(`express`);
const api = require(`../api`).getAPI();

const router = new express.Router();

router.get(`/`, async (req, res) => {
  const offers = await api.getOffers();
  res.render(`my/tickets`, {offers});
});
router.get(`/comments`, async (req, res) => {
  const offers = await api.getOffers({comments: true});
  res.render(`my/comments`, {offers: offers.slice(0, 3)});
});


module.exports = router;
