'use strict';

const express = require(`express`);
const path = require(`path`);
const multer = require(`multer`);
const {nanoid} = require(`nanoid`);
const bodyParser = require(`body-parser`).urlencoded({extended: false});
const fs = require(`fs`).promises;
const {
  checkObjProp,
  getTotalPages,
  calculatePagination,
  asyncWrapper,
} = require(`../../utils`);

const PUBLIC_IMG_DIR = `../public/img`;
const UPLOAD_DIR = `../upload/img/`;
const emptyOffer = {
  title: ``,
  description: ``,
  sum: ``,
  type: ``,
  categories: [],
};

const api = require(`../api`).getAPI();

const absoluteUploadDir = path.resolve(__dirname, UPLOAD_DIR);

const getRequestData = (request) => {
  const {body, file} = request;

  const isPictureExist = checkObjProp(file, `filename`);

  const offer = {
    title: body[`ticket-name`],
    description: body.comment,
    sum: body.price,
    type: body.action,
    categories: Array.isArray(body.categories) ? body.categories : [],
    picture: isPictureExist ? file.filename : body[`offer-picture`],
    // временно
    userId: 1,
  };
  return [isPictureExist, offer];
};

const storage = multer.diskStorage({
  destination: absoluteUploadDir,
  filename: (req, file, cb) => {
    const uniqueName = nanoid(10);
    const extension = file.originalname.split(`.`).pop();
    cb(null, `${uniqueName}.${extension}`);
  }
});

const upload = multer({storage});

const offersRouter = new express.Router();

offersRouter.get(`/category/:id`, asyncWrapper(async (req, res) => {

  const [page, limit, offset] = calculatePagination(req.query);

  const {id} = req.params;
  const [{count, offers}, categories] = await Promise.all([
    api.getCategoryOffers(id, {limit, offset}),
    api.getCategories(true),
  ]);

  const category = categories.find((item) => +item.id === +id);
  const totalPages = getTotalPages(count);

  res.render(`offers/category`, {category, offers, categories, page, totalPages});
}));

offersRouter.get(`/add`, asyncWrapper(async (req, res) => {
  const categories = await api.getCategories();
  const offer = Object.assign({}, emptyOffer);

  res.render(`offers/ticket-new`, {offer, categories, errorMessages: []});
}));

offersRouter.post(`/add`, upload.single(`avatar`), asyncWrapper(async (req, res) => {
  const {file} = req;

  const [isPictureExist, offer] = getRequestData(req);

  if (isPictureExist) {
    offer.picture = file.filename;
  }

  try {
    await api.createOffer(offer);

    // Временно
    if (isPictureExist) {

      await fs.copyFile(
          path.resolve(absoluteUploadDir, offer.picture),
          path.resolve(__dirname, PUBLIC_IMG_DIR, offer.picture)
      );
    }

    res.redirect(`/my`);
  } catch (error) {

    const {message: errorMessages} = error.response.data;

    const categories = await api.getCategories();
    res.render(`offers/ticket-new`, {offer, categories, errorMessages});
  }
}));

offersRouter.get(`/edit/:id`, asyncWrapper(async (req, res) => {
  const {id} = req.params;

  const [offer, categories] = await Promise.all([
    api.getOffer(id),
    api.getCategories()
  ]);

  res.render(`offers/ticket-edit`, {offer, categories, errorMessages: []});
}));

offersRouter.post(`/edit/:id`, upload.single(`avatar`), asyncWrapper(async (req, res) => {
  const {id} = req.params;

  const [isNewImage, offerData] = getRequestData(req);
  try {
    await api.editOffer(id, offerData);

    res.redirect(`/my`);
    // Временно
    if (isNewImage) {
      await fs.copyFile(
          path.resolve(absoluteUploadDir, offerData.picture),
          path.resolve(__dirname, PUBLIC_IMG_DIR, offerData.picture)
      );
    }
  } catch (error) {

    const {message: errorMessages} = error.response.data;

    offerData.id = id;

    const categories = await api.getCategories();
    res.render(`offers/ticket-edit`, {offer: offerData, categories, errorMessages});
  }

}));

offersRouter.get(`/:id`, asyncWrapper(async (req, res) => {
  const {id} = req.params;
  const offer = await api.getOffer(id, true, true);

  res.render(`offers/ticket`, {offer});
}));

offersRouter.post(`/:id/comments`, bodyParser, asyncWrapper(async (req, res) => {
  const {id} = req.params;
  const {comment} = req.body;

  const data = {
    text: comment,
    userId: 1
  };

  try {

    await api.addComment(id, data);
    res.redirect(`/offers/${id}`);

  } catch (err) {
    const {message: errorMessage} = err.response.data;

    const offer = await api.getOffer(id, true, true);
    res.render(`offers/ticket`, {offer, comment, errorMessage});
  }

}));

module.exports = offersRouter;
