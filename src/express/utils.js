'use strict';

const path = require(`path`);
const fs = require(`fs`).promises;
const {OFFERS_PER_PAGE, PUBLIC_IMG_DIR, UPLOAD_DIR} = require(`./const`);


const checkObjProp = (obj, prop) => {
  return typeof obj === `object` && prop in obj;
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

const asyncWrapper = (callback) => {
  return (req, res, next) => {
    callback(req, res, next)
      .catch(next);
  };
};

const moveUploadedImage = async (image) => {
  const picture = path.join(UPLOAD_DIR, image);
  await fs.copyFile(
      picture,
      path.join(PUBLIC_IMG_DIR, image)
  );

  await fs.unlink(picture);
};

module.exports = {
  checkObjProp,
  getTotalPages,
  calculatePagination,
  asyncWrapper,
  moveUploadedImage,
};
