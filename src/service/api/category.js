'use strict';

const express = require(`express`);
const {HttpCode} = require(`../../constants`);
const {asyncWrapper} = require(`../../utils`);

module.exports = (app, service) => {
  const route = new express.Router();

  route.get(`/`, asyncWrapper(async (req, res) => {
    const {count} = req.query;

    const categories = await service.findAll(count);

    res.status(HttpCode.OK).json(categories);
  }));

  app.use(`/categories`, route);
};

