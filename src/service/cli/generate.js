'use strict';

const fs = require(`fs`).promises;
const chalk = require(`chalk`);
const {ExitCode} = require(`../../constants`);
const {getRandomInt, shuffle} = require(`../../utils`);

const FILE_OUTPUT = `${__dirname}/../../../mocks.json`;
const FILE_TITLE = `${__dirname}/../../../data/title.txt`;
const FILE_DESCRIPTION = `${__dirname}/../../../data/description.txt`;
const FILE_CATEGORY = `${__dirname}/../../../data/category.txt`;

const DEFAULT_COUNT = 1;
const MAX_COUNT = 1000;

const PictureRestrict = {
  MIN: 1,
  MAX: 16,
};

const OfferType = {
  OFFER: `offer`,
  SALE: `sale`,
};

const SumRestrict = {
  MIN: 1000,
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

const generateOffers = (count, titles, descriptions, categories) => (
  Array(count).fill({}).map(() => ({
    type: Object.keys(OfferType)[Math.floor(Math.random() * Object.keys(OfferType).length)],
    title: titles[getRandomInt(0, titles.length - 1)],
    description: shuffle(descriptions).slice(0, getRandomInt(1, descriptions.length - 1)).join(` `),
    sum: getRandomInt(SumRestrict.MIN, SumRestrict.MAX),
    picture: getPictureFileName(getRandomInt(PictureRestrict.MIN, PictureRestrict.MAX)),
    category: shuffle(categories).slice(0, getRandomInt(1, categories.length - 1))
  }))
);


module.exports = {
  name: `--generate`,
  async run(arg) {
    const count = Number.parseInt(arg, 10) || DEFAULT_COUNT;
    if (count > MAX_COUNT) {
      console.error(chalk.red(`Не больше 1000 объявлений`));
      process.exit(ExitCode.error);
    }

    const titles = await readFile(FILE_TITLE);
    const descriptions = await readFile(FILE_DESCRIPTION);
    const categories = await readFile(FILE_CATEGORY);

    const data = JSON.stringify(generateOffers(count, titles, descriptions, categories));
    try {
      await fs.writeFile(FILE_OUTPUT, data, `utf8`);
      console.log(chalk.green(`Данные успешно записаны.`));
    } catch (err) {
      console.error(chalk.red(err));
      process.exit(ExitCode.error);
    }
  }
};
