'use strict';

const Alias = require(`./alias`);
const {Model, DataTypes} = require(`sequelize`);

class User extends Model {}

const define = (sequelize) => {
  User.init({
    firstname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    }
  }, {
    sequelize,
    modelName: `User`,
    tableName: Alias.USERS,
  });

  return User;
};

module.exports = define;
