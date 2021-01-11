'use strict';

const express = require(`express`);
const api = require(`../api`).getAPI();

const router = new express.Router();

router.get(`/`, async (req, res) => {
  const offers = await api.getOffers();
  res.render(`main`, {offers});
});

router.get(`/register`, (req, res) => res.render(`main/sign-up`));
router.get(`/login`, (req, res) => res.render(`main/login`));

router.get(`/search`, async (req, res) => {
  try {
    const {search} = req.query;
    let results = await api.search(search);

    res.render(`main/search-result`, {results});
  } catch (error) {
    console.log(error.message);
    res.render(`main/search-result`, {results: []});
  }
});

module.exports = router;

