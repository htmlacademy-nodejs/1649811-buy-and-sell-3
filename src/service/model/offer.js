'use strict';

const Alias = require(`./alias`);
const {Model, DataTypes} = require(`sequelize`);

class Offer extends Model {
}

const define = (sequelize) => {
  Offer.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    picture: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    sum: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

  }, {
    sequelize,
    modelName: `Offer`,
    tableName: Alias.OFFERS,
  });

  return Offer;
};

module.exports = define;
