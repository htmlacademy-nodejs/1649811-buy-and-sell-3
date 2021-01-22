'use strict';

const path = require(`path`);
const {ExitCode} = require(`../../constants`);
const {getRandomInt, shuffle, readFile, getPictureFileName} = require(`../../utils`);
const sequelize = require(`../lib/sequelize`);
const defineModels = require(`../model`);

const FILE_TITLE = path.resolve(__dirname, `../../../data/title.txt`);
const FILE_DESCRIPTION = path.resolve(__dirname, `../../../data/description.txt`);
const FILE_CATEGORY = path.resolve(__dirname, `../../../data/category.txt`);
const FILE_COMMENT = path.resolve(__dirname, `../../../data/comment.txt`);
const FILE_USER = path.resolve(__dirname, `../../../data/user.txt`);

const MAX_COMMENTS = 6;
const OFFERS_COUNT = 5;
const MIN_USERS_COUNT = 2;

const PictureRestrict = {
  MIN: 1,
  MAX: 16,
};

const OfferType = [`buy`, `sale`];

const SumRestrict = {
  MIN: 100,
  MAX: 100000,
};

const generateOffers = (count, titles, descriptions, userIds) => {
  return Array.from({length: count}, (_, i) => (
    {
      title: titles[i],
      description: shuffle(descriptions).slice(0, getRandomInt(1, descriptions.length - 1)).join(` `),
      picture: getPictureFileName(getRandomInt(PictureRestrict.MIN, PictureRestrict.MAX)),
      type: OfferType[getRandomInt(0, 1)],
      sum: getRandomInt(SumRestrict.MIN, SumRestrict.MAX),
      userId: userIds[getRandomInt(0, userIds.length - 1)],
    }
  ));
};

const generateCategories = (categories) => {
  return categories.map((item) => (
    {title: item}
  ));
};

const generateUsers = (users) => {
  return shuffle(users).slice(0, getRandomInt(MIN_USERS_COUNT, users.length))
    .map((item, index) => {
      const [firstname, lastname, email, password] = item.split(` `);
      return {
        firstname,
        lastname,
        email,
        password,
        avatar: `avatar0${index + 1}.jpg`,
      };
    });
};

const generateComments = (comments, offerIds, userIds) => {

  const values = [];

  offerIds.forEach((offerId) => {
    userIds.forEach((userId) => {
      const countComments = getRandomInt(1, MAX_COMMENTS);

      for (let i = 0; i < countComments; i++) {
        const text = shuffle(comments).slice(0, getRandomInt(1, 3)).join(` `);
        values.push({text, userId, offerId});
      }
    });
  });

  return values;
};

const getIds = (items) => {
  return items.map((item) => item.dataValues.id);
};

module.exports = {
  name: `--filldb`,
  async run(arg) {
    try {
      console.info(`Trying to connect to database...`);
      await sequelize.authenticate();
      console.info(`Connection to database established`);

      const dataTitles = await readFile(FILE_TITLE);
      const dataDescriptions = await readFile(FILE_DESCRIPTION);
      const dataCategories = await readFile(FILE_CATEGORY);
      const dataComments = await readFile(FILE_COMMENT);
      const dataUsers = await readFile(FILE_USER);

      const count = Math.min(Number.parseInt(arg, 10) || OFFERS_COUNT, dataTitles.length);

      const {Category, User, Offer, Comment} = defineModels(sequelize);

      await sequelize.sync({force: true});

      const categories = await Category.bulkCreate(generateCategories(dataCategories));

      const users = await User.bulkCreate(generateUsers(dataUsers));
      const userIds = getIds(users);

      const offers = await Offer.bulkCreate(generateOffers(count, dataTitles, dataDescriptions, userIds));
      const offerIds = getIds(offers);

      await Comment.bulkCreate(generateComments(dataComments, offerIds, userIds));

      const offerPromises = offers.map(async (offer) => {
        const offerCategories = shuffle([...categories])
          .slice(0, getRandomInt(1, categories.length));

        await offer.addCategories(offerCategories);

      });

      await Promise.all(offerPromises);

      await sequelize.close();

    } catch (err) {
      console.error(`An error occurred: ${err.message}`);
      process.exit(ExitCode.ERROR);
    }
  }
};
