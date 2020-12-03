'use strict';

const express = require(`express`);

const router = new express.Router();

router.get(`/`, (req, res) => res.render(`main/index`));
router.get(`/register`, (req, res) => res.render(`main/sign-up`));
router.get(`/login`, (req, res) => res.render(`main/login`));
router.get(`/search`, (req, res) => res.render(`main/search-result`));

module.exports = router;
