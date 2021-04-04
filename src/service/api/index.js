'use strict';

const express = require(`express`);
const category = require(`./category`);
const offer = require(`./offer`);
const search = require(`./search`);
const user = require(`./user`);
const sequelize = require(`../lib/sequelize`);
const defineModels = require(`../model/define-models`);
const {
  CategoryService,
  OfferService,
  CommentService,
  SearchService,
  UserService,
  RefreshTokenService,
} = require(`../data-service`);

const app = new express.Router();

defineModels(sequelize);

(() => {
  category(app, new CategoryService(sequelize));
  offer(app, new OfferService(sequelize), new CommentService(sequelize));
  search(app, new SearchService(sequelize));
  user(app, new UserService(sequelize), new RefreshTokenService(sequelize));
})();

module.exports = app;
