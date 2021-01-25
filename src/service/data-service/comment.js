'use strict';

class CommentService {
  constructor(sequelize) {
    this._Offer = sequelize.models.Offer;
    this._Comment = sequelize.models.Comment;
  }

  async create(offer, comment) {
    return await this._Comment.create({
      offerId: offer,
      ...comment
    });
  }

  async drop(id) {
    const deletedRows = await this._Comment.destroy({
      where: {id}
    });

    return !!deletedRows;
  }

  async findAll(offerId) {
    return await this._Comment.findAll({
      where: {offerId},
      raw: true
    });
  }

}

module.exports = CommentService;
