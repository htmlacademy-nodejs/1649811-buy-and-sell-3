'use strict';

const Alias = require(`./alias`);
const defineCategory = require(`./category`);
const defineUser = require(`./user`);
const defineOffer = require(`./offer`);
const defineComment = require(`./comment`);
const {Model} = require(`sequelize`);

class OfferCategory extends Model {}

const define = (sequelize) => {

  const Category = defineCategory(sequelize);
  const User = defineUser(sequelize);
  const Offer = defineOffer(sequelize);
  const Comment = defineComment(sequelize);


  User.hasMany(Offer, {
    as: Alias.OFFERS,
    foreignKey: `userId`,
    onDelete: `CASCADE`,
    onUpdate: `CASCADE`,
  });
  Offer.belongsTo(User, {
    as: Alias.USER,
  });


  User.hasMany(Comment, {
    as: Alias.COMMENTS,
    foreignKey: `userId`,
    onDelete: `CASCADE`,
    onUpdate: `CASCADE`,
  });
  Comment.belongsTo(User, {
    as: Alias.USER,
  });

  OfferCategory.init({}, {sequelize});

  Offer.belongsToMany(Category, {
    as: Alias.CATEGORIES,
    through: OfferCategory,
    // foreignKey: `offerId`,
  });
  Category.belongsToMany(Offer, {
    as: Alias.OFFERS,
    through: OfferCategory,
    // foreignKey: `categoryId`,
  });


  Offer.hasMany(Comment, {
    as: Alias.COMMENTS,
    foreignKey: `offerId`,
    onDelete: `CASCADE`,
    onUpdate: `CASCADE`,
  });
  Comment.belongsTo(Offer, {
    foreignKey: `offerId`
  });

  return {Category, User, Offer, Comment};
};

module.exports = define;
