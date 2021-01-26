'use strict';

const {Op} = require(`sequelize`);
const Alias = require(`../model/alias`);

class SearchService {
  constructor(sequelize) {
    this._Offer = sequelize.models.Offer;
  }

  async findAll(searchText) {
    return await this._Offer.findAll({
      where: {
        title: {
          [Op.substring]: searchText
        }
      },
      include: Alias.CATEGORIES
    });
  }
}

module.exports = SearchService;
