'use strict';

const Alias = require(`../model/alias`);

class OfferService {
  constructor(sequelize) {
    this._OfferCategory = sequelize.models.OfferCategory;
    this._Offer = sequelize.models.Offer;
    this._Comment = sequelize.models.Comment;
    this._Category = sequelize.models.Category;
  }

  async create(offerData) {
    const offer = await this._Offer.create(offerData);
    await offer.addCategories(offerData.categories);

    return offer;
  }

  async drop(id) {
    const deletedRows = await this._Offer.destroy({
      where: {id}
    });

    return !!deletedRows;
  }

  async findAll(needComments) {
    const include = [Alias.CATEGORIES];
    if (needComments) {
      include.push(Alias.COMMENTS);
    }
    return await this._Offer.findAll({
      include,
      order: [
        [`createdAt`, `DESC`],
      ],

    });
  }

  async findOne(id, needComments) {
    const include = [Alias.CATEGORIES];

    if (needComments) {
      const comments = {
        model: this._Comment,
        as: Alias.COMMENTS,
        include: [Alias.USER]
      };

      include.push(comments);
    }

    return await this._Offer.findByPk(id, {include});
  }

  async update(id, offer) {
    try {
      const offerModel = await this._Offer.findByPk(id);

      await offerModel.update(offer);

      await offerModel.setCategories(offer.categories);

      return true;
    } catch (err) {
      console.log(err.message);

      return false;
    }
  }

  async findAllByCategory(id, {limit, offset}) {
    const {count, rows} = await this._Offer.findAndCountAll({
      limit,
      offset,
      include: [
        Alias.CATEGORIES,
        {
          model: this._OfferCategory,
          as: Alias.OFFER_CATEGORIES,
          attributes: [],
          where: {
            categoryId: id
          }
        }],
      order: [
        [`createdAt`, `DESC`],
      ],
      distinct: true,
    });
    return {count, offers: rows};
  }

  async findPage({limit, offset}) {
    const {count, rows} = await this._Offer.findAndCountAll({
      limit,
      offset,
      include: [Alias.CATEGORIES],
      order: [
        [`createdAt`, `DESC`],
      ],
      distinct: true
    });
    return {count, offers: rows};
  }
}

module.exports = OfferService;
