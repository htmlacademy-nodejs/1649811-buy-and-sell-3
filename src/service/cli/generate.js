'use strict';

const fs = require(`fs`).promises;
const chalk = require(`chalk`);
const {nanoid} = require(`nanoid`);
const {ExitCode, MAX_ID_LENGTH} = require(`../const`);
const {getRandomInt, shuffle, readFile, getPictureFileName} = require(`../utils`);

const FILE_OUTPUT = `${__dirname}/../../../mocks.json`;
const FILE_TITLE = `${__dirname}/../../../data/title.txt`;
const FILE_DESCRIPTION = `${__dirname}/../../../data/description.txt`;
const FILE_CATEGORY = `${__dirname}/../../../data/category.txt`;
const FILE_COMMENT = `${__dirname}/../../../data/comment.txt`;

const DEFAULT_COUNT = 1;
const MAX_COUNT = 1000;
const MAX_COMMENTS = 4;


const PictureRestrict = {
  MIN: 1,
  MAX: 16,
};

const OfferType = {
  OFFER: `buy`,
  SALE: `sale`,
};

const SumRestrict = {
  MIN: 1000,
  MAX: 100000,
};


const generateComments = (count, comments) => (
  Array(count).fill({}).map(() => ({
    id: nanoid(MAX_ID_LENGTH),
    text: shuffle(comments)
      .slice(0, getRandomInt(1, 3))
      .join(``)
  }))
);

const generateOffers = (count, titles, descriptions, categories, comments) => (
  Array(count).fill({}).map(() => ({
    id: nanoid(MAX_ID_LENGTH),
    type: Object.keys(OfferType)[Math.floor(Math.random() * Object.keys(OfferType).length)],
    title: titles[getRandomInt(0, titles.length - 1)],
    description: shuffle(descriptions).slice(0, getRandomInt(1, descriptions.length - 1)).join(` `),
    sum: getRandomInt(SumRestrict.MIN, SumRestrict.MAX),
    picture: getPictureFileName(getRandomInt(PictureRestrict.MIN, PictureRestrict.MAX)),
    category: shuffle(categories).slice(0, getRandomInt(1, categories.length - 1)),
    comments: generateComments(getRandomInt(1, MAX_COMMENTS), comments),
  }))
);


module.exports = {
  name: `--generate`,
  async run(arg) {
    const count = Number.parseInt(arg, 10) || DEFAULT_COUNT;
    if (count > MAX_COUNT) {
      console.error(chalk.red(`Не больше 1000 объявлений`));
      process.exit(ExitCode.ERROR);
    }

    const titles = await readFile(FILE_TITLE);
    const descriptions = await readFile(FILE_DESCRIPTION);
    const categories = await readFile(FILE_CATEGORY);
    const comments = await readFile(FILE_COMMENT);

    const data = JSON.stringify(generateOffers(count, titles, descriptions, categories, comments));
    try {
      await fs.writeFile(FILE_OUTPUT, data, `utf8`);
      console.log(chalk.green(`Данные успешно записаны.`));
    } catch (err) {
      console.error(chalk.red(err));
      process.exit(ExitCode.ERROR);
    }
  }
};
