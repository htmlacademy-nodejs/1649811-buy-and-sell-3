'use strict';

const fs = require(`fs`).promises;
const chalk = require(`chalk`);
const path = require(`path`);
const {ExitCode} = require(`../../constants`);
const {getRandomInt, shuffle, getRandomDate} = require(`../../utils`);

const FILE_OUTPUT = path.resolve(__dirname, `../../../fill-db.sql`);
const FILE_TITLE = path.resolve(__dirname, `../../../data/title.txt`);
const FILE_DESCRIPTION = path.resolve(__dirname, `../../../data/description.txt`);
const FILE_CATEGORY = path.resolve(__dirname, `../../../data/category.txt`);
const FILE_COMMENT = path.resolve(__dirname, `../../../data/comment.txt`);
const FILE_USER = path.resolve(__dirname, `../../../data/user.txt`);

const MAX_COMMENTS = 6;
const DATE_DIFF_MONTH = -3;
const OFFERS_COUNT = 5;
const MIN_USERS_COUNT = 2;

const PictureRestrict = {
  MIN: 1,
  MAX: 16,
};

const OfferType = {
  OFFER: `buy`,
  SALE: `sale`,
};

const SumRestrict = {
  MIN: 100,
  MAX: 100000,
};

const readFile = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, `utf8`);
    return content.trim().split(`\n`);
  } catch (error) {
    console.error(chalk.red(error));
    return [];
  }
};

const getPictureFileName = (number) => `item${number.toString().padStart(2, `0`)}.jpg`;

const getCreatedDate = (diffMonth) => {
  const diffDate = new Date();
  diffDate.setMonth(diffDate.getMonth() + diffMonth);
  return getRandomDate(diffDate.getTime());
};

const generateOffers = (count, titles, descriptions, maxUserId) => {
  let id = 1;

  return Array(count).fill(0).map(() => {
    const typeId = getRandomInt(1, 2);
    const title = titles[id];
    const description = shuffle(descriptions).slice(0, getRandomInt(1, descriptions.length - 1)).join(` `);
    const sum = getRandomInt(SumRestrict.MIN, SumRestrict.MAX);
    const picture = getPictureFileName(getRandomInt(PictureRestrict.MIN, PictureRestrict.MAX));
    const createdAt = getCreatedDate(DATE_DIFF_MONTH).toISOString();
    const userId = getRandomInt(1, maxUserId);

    return `\t(${id++}, '${title}', '${description}', '${picture}', ${typeId}, ${userId}, '${createdAt}', ${sum})`;

  }).join(`,\n`);
};

const generateCategories = (categories) => {
  let id = 1;
  return categories.map((item) => `\t(${id++}, '${item}')`).join(`,\n`);
};

const generateTypes = () => {
  return `\t(1, '${OfferType.OFFER}'),\n\t(2, '${OfferType.SALE}')`;
};

const generateUsers = (users, count) => {
  return shuffle(users).slice(0, count)
    .map((item, index) => {
      const [firstname, lastname, email, password] = item.split(` `);
      const id = index + 1;

      return `\t(${id}, '${firstname}', '${lastname}', '${email}', '${password}', 'avatar0${id}.jpg')`;
    }).join(`,\n`);
};

const generateComments = (comments, offersCount, usersCount) => {

  const values = [];
  const users = shuffle(Array.from({length: usersCount}, (_, i) => i + 1))
    .slice(0, getRandomInt(2, usersCount));

  for (let i = 1; i <= offersCount; i++) {
    users.forEach((userId) => {
      const countComments = getRandomInt(1, MAX_COMMENTS);

      for (let j = 0; j < countComments; j++) {
        const text = shuffle(comments).slice(0, getRandomInt(1, 3)).join(` `);
        const createdAt = getCreatedDate(DATE_DIFF_MONTH).toISOString();

        const entry = `\t(DEFAULT, '${text}', ${i}, ${userId}, '${createdAt}')`;
        values.push(entry);
      }
    });
  }

  return values.join(`,\n`);

};

const generateOffersCategories = (offersCount, categoriesCount) => {
  const values = [];
  const identifiers = Array.from({length: categoriesCount}, (_, i) => i + 1);

  for (let i = 1; i <= offersCount; i++) {
    const offerCategories = shuffle(identifiers).slice(0, getRandomInt(1, categoriesCount));

    offerCategories.forEach((item) => {
      const entry = `\t(${i}, ${item})`;
      values.push(entry);
    });
  }

  return values.join(`,\n`);
};


const getQuery = (table, values) => {
  const comment = `--\n-- ${table} -\n--`;

  return `${comment}\nINSERT INTO ${table} VALUES\n${values};\n\n`;
};


module.exports = {
  name: `--fill`,
  async run(arg) {
    const titles = await readFile(FILE_TITLE);
    const descriptions = await readFile(FILE_DESCRIPTION);
    const categories = await readFile(FILE_CATEGORY);
    const comments = await readFile(FILE_COMMENT);
    const users = await readFile(FILE_USER);

    const countOffers = Math.min(Number.parseInt(arg, 10) || OFFERS_COUNT, titles.length);
    const countUsers = getRandomInt(MIN_USERS_COUNT, users.length);

    const categoriesValues = generateCategories(categories);
    const typesValues = generateTypes();
    const usersValues = generateUsers(users, countUsers);
    const offersValues = generateOffers(countOffers, titles, descriptions, countUsers);
    const commentsValues = generateComments(comments, countOffers, countUsers);
    const offersCategoriesValues = generateOffersCategories(countOffers, categories.length);

    const queryCategory = getQuery(`categories`, categoriesValues);
    const queryTypes = getQuery(`types`, typesValues);
    const queryUsers = getQuery(`users`, usersValues);
    const queryOffers = getQuery(`offers`, offersValues);
    const queryComments = getQuery(`comments`, commentsValues);
    const queryOffersCategories = getQuery(`offers_categories`, offersCategoriesValues);

    const data = queryCategory + queryTypes + queryUsers + queryOffers + queryComments + queryOffersCategories;
    try {
      await fs.writeFile(FILE_OUTPUT, data, `utf8`);

      console.log(chalk.green(`Данные успешно записаны.`));
    } catch (err) {
      console.error(chalk.red(err));
      process.exit(ExitCode.ERROR);
    }
  }
};
