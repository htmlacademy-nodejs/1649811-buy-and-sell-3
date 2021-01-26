'use strict';

const {Sequelize} = require(`sequelize`);
const {DATABASE_URI} = process.env;

if (!DATABASE_URI) {
  throw new Error(`DATABASE_URI not defined.`);
}

module.exports = new Sequelize(DATABASE_URI, {
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  logging: false
});
