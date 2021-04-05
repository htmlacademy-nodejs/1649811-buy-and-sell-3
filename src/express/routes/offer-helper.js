'use strict';

const multer = require(`multer`);
const {nanoid} = require(`nanoid`);
const {checkObjProp} = require(`../utils`);
const {UPLOAD_DIR} = require(`../const`);

const emptyOffer = {
  title: ``,
  description: ``,
  sum: ``,
  type: ``,
  categories: [],
};

const getRequestData = (request, response) => {
  const {body, file} = request;

  const isPictureExist = checkObjProp(file, `filename`);

  const user = response.locals.loggedUser;

  const offer = {
    title: body[`ticket-name`],
    description: body.comment,
    sum: body.price,
    type: body.action,
    categories: Array.isArray(body.categories) ? body.categories : [],
    picture: isPictureExist ? file.filename : body[`offer-picture`],
    userId: user.id,
  };
  return [isPictureExist, offer];
};

const storage = multer.diskStorage({
  destination: UPLOAD_DIR,
  filename: (req, file, cb) => {
    const uniqueName = nanoid(10);
    const extension = file.originalname.split(`.`).pop();
    cb(null, `${uniqueName}.${extension}`);
  }
});

const upload = multer({storage});

module.exports = {
  emptyOffer,
  getRequestData,
  upload,
};

