'use strict';

const Alias = require(`./alias`);
const {Model, DataTypes} = require(`sequelize`);

class Category extends Model {}

const define = (sequelize) => {
  Category.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    }
  }, {
    sequelize,
    modelName: `Category`,
    tableName: Alias.CATEGORIES,
  });

  return Category;
};

module.exports = define;
