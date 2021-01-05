'use strict';

const express = require(`express`);
const api = require(`../api`).getAPI();

const router = new express.Router();

router.get(`/`, async (req, res) => {
  const ads = await api.getOffers();
  res.render(`my/tickets`, {ads});
});
router.get(`/comments`, async (req, res) => {
  const ads = await api.getOffers();
  res.render(`my/comments`, {ads: ads.slice(0, 3)});
});


module.exports = router;
