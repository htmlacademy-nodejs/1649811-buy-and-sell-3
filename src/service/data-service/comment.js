'use strict';

const {QueryTypes} = require(`sequelize`);

class CommentService {
  constructor(sequelize) {
    this._sequelize = sequelize;
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

  async findByUser(userId) {
    console.log(userId);

    const sql = `select o.title,
                        o.id,
                        c.text,
                        o."userId",
                        uu.id,
                        uu.firstname,
                        uu.lastname,
                        uu.email,
                        uu.avatar
                 from offers o
                        right join comments c on o.id = c."offerId"
                        left join users uu on uu.id = c."userId"
                 where o."userId" = ?
                 order by c."createdAt" DESC`;


    return await this._sequelize.query(
      sql,
      {
        replacements: [userId],
        type: QueryTypes.SELECT
      }
    );
  }
}


module.exports = CommentService;
