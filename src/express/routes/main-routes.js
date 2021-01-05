'use strict';

const express = require(`express`);

const api = require(`../api`).getAPI();

const router = new express.Router();

router.get(`/`, async (req, res) => {
  // если offers - pug выдает ошибку
  const ads = await api.getOffers();
  res.render(`main`, {ads});
});

router.get(`/register`, (req, res) => res.render(`main/sign-up`));
router.get(`/login`, (req, res) => res.render(`main/login`));
router.get(`/search`, (req, res) => res.render(`main/search-result`));

module.exports = router;

