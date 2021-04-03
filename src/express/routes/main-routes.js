'use strict';

const express = require(`express`);
const {getTotalPages, calculatePagination, asyncWrapper} = require(`../utils`);

const api = require(`../api`).getAPI();
const router = new express.Router();

router.get(`/`, asyncWrapper(async (req, res) => {

  const [page, limit, offset] = calculatePagination(req.query);

  const [
    {count, offers},
    categories
  ] = await Promise.all([
    api.getOffers({limit, offset}),
    api.getCategories(true),
  ]);

  const totalPages = getTotalPages(count);

  res.render(`main`, {offers, categories, page, totalPages});
}));
router.get(`/search`, asyncWrapper(async (req, res) => {
  try {
    const {search} = req.query;
    let results = await api.search(search);

    res.render(`main/search-result`, {results});
  } catch (error) {
    console.log(error.message);
    res.render(`main/search-result`, {results: []});
  }
}));

module.exports = router;
