'use strict';

const path = require(`path`);
const {ExitCode} = require(`../../constants`);
const {getRandomInt, shuffle, readFile, getPictureFileName, getCreatedDate} = require(`../../utils`);
const sequelize = require(`../lib/sequelize`);
const initDb = require(`../lib/init-db`);

const FILE_TITLE = path.resolve(__dirname, `../../../data/title.txt`);
const FILE_DESCRIPTION = path.resolve(__dirname, `../../../data/description.txt`);
const FILE_CATEGORY = path.resolve(__dirname, `../../../data/category.txt`);
const FILE_COMMENT = path.resolve(__dirname, `../../../data/comment.txt`);
const FILE_USER = path.resolve(__dirname, `../../../data/user.txt`);

const OFFERS_COUNT = 5;

const PictureRestrict = {
  MIN: 1,
  MAX: 16,
};

const OfferType = [`buy`, `sale`];

const SumRestrict = {
  MIN: 100,
  MAX: 100000,
};

const generateOffers = (count, titles, descriptions) => {
  return Array.from({length: count}, (_, i) => (
    {
      title: titles[i],
      createdAt: getCreatedDate(-3),
      description: shuffle(descriptions).slice(0, getRandomInt(1, descriptions.length - 1)).join(` `),
      picture: getPictureFileName(getRandomInt(PictureRestrict.MIN, PictureRestrict.MAX)),
      type: OfferType[getRandomInt(0, 1)],
      sum: getRandomInt(SumRestrict.MIN, SumRestrict.MAX),
    }
  ));
};

module.exports = {
  name: `--filldb`,
  async run(arg) {
    try {
      console.info(`Trying to connect to database...`);
      await sequelize.authenticate();
      console.info(`Connection to database established`);

      const titles = await readFile(FILE_TITLE);
      const descriptions = await readFile(FILE_DESCRIPTION);
      const categories = await readFile(FILE_CATEGORY);
      const comments = await readFile(FILE_COMMENT);
      const users = await readFile(FILE_USER);

      const count = Math.min(Number.parseInt(arg, 10) || OFFERS_COUNT, titles.length);
      const offers = generateOffers(count, titles, descriptions);

      await initDb(sequelize, {categories, offers, users, comments}, true);

      console.info(`Database created and populated`);
      await sequelize.close();

    } catch (err) {
      console.error(`An error occurred: ${err.message}`);
      process.exit(ExitCode.ERROR);
    }
  }
};
