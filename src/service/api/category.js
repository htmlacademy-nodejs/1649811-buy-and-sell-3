'use strict';

const express = require(`express`);
const {HttpCode} = require(`../../constants`);

module.exports = (app, service) => {
  const route = new express.Router();

  route.get(`/`, (req, res) => {
    const categories = service.findAll();
    res.status(HttpCode.OK).json(categories);
  });

  app.use(`/categories`, route);
};

