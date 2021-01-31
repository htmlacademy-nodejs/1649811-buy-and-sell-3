'use strict';

const fs = require(`fs`).promises;
const chalk = require(`chalk`);
const {OFFERS_PER_PAGE} = require(`./constants`);

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const getRandomDate = (startTime) => {
  const currentTime = Date.now();
  const time = (startTime > currentTime)
    ? getRandomInt(currentTime, startTime)
    : getRandomInt(startTime, currentTime);
  return new Date(time);
};

const shuffle = (someArray) => {
  for (let i = someArray.length - 1; i > 0; i--) {
    const randomPosition = Math.floor(Math.random() * i);
    [someArray[i], someArray[randomPosition]] = [someArray[randomPosition], someArray[i]];
  }
  return someArray;
};

const checkObjProp = (obj, prop) => {
  return typeof obj === `object` && prop in obj;
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

const getTotalPages = (rowsCount) => {
  return Math.ceil(rowsCount / OFFERS_PER_PAGE);
};

const calculatePagination = (query) => {
  let {page = 1} = query;
  page = +page;

  const limit = OFFERS_PER_PAGE;
  const offset = (page - 1) * OFFERS_PER_PAGE;

  return [page, limit, offset];
};

module.exports = {
  getRandomInt,
  shuffle,
  checkObjProp,
  getRandomDate,
  readFile,
  getPictureFileName,
  getCreatedDate,
  getTotalPages,
  calculatePagination,
};
