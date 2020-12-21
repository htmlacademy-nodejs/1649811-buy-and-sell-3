'use strict';

const express = require(`express`);
const category = require(`./category`);
const offer = require(`./offer`);
const search = require(`./search`);
const {CategoryService, OfferService, CommentService, SearchService} = require(`../data-service`);
const getMockData = require(`../lib/get-mock-data`);

const app = new express.Router();

(async () => {
  const mockData = await getMockData();

  category(app, new CategoryService(mockData));
  offer(app, new OfferService(mockData), new CommentService());
  search(app, new SearchService(mockData));

})();

module.exports = app;
