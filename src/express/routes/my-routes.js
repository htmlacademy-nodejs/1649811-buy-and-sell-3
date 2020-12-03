'use strict';

const express = require(`express`);

const router = new express.Router();

router.get(`/`, (req, res) => res.render(`my/tickets`));
router.get(`/comments`, (req, res) => res.render(`my/comments`));


module.exports = router;

