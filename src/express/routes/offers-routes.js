'use strict';

const express = require(`express`);
const path = require(`path`);
const multer = require(`multer`);
const {nanoid} = require(`nanoid`);
const fs = require(`fs`).promises;
const {checkObjProp} = require(`../../utils`);

const UPLOAD_DIR = `../upload/img/`;
const PUBLIC_IMG_DIR = `../public/img`;
const emptyOffer = {
  title: ``,
  description: ``,
  sum: ``,
  type: ``,
  category: ``,
};

const api = require(`../api`).getAPI();

const absoluteUploadDir = path.resolve(__dirname, UPLOAD_DIR);

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

offersRouter.get(`/category/:id`, (req, res) => res.render(`offers/category`));

offersRouter.get(`/add`, async (req, res) => {
  const categories = await api.getCategories();
  const newOffer = Object.assign({}, emptyOffer);

  res.render(`offers/new-ticket`, {newOffer, categories});
});

offersRouter.post(`/add`, upload.single(`avatar`), async (req, res) => {
  const {body, file} = req;
  const isPictureExist = checkObjProp(file, `filename`);

  const newOffer = {
    title: body[`ticket-name`],
    description: body.comment,
    sum: body.price,
    type: body.action,
    category: body.category,
  };

  if (isPictureExist) {
    newOffer.picture = file.filename;
  }

  try {
    await api.createOffer(newOffer);

    // Временно
    if (isPictureExist) {
      await fs.copyFile(
          path.resolve(absoluteUploadDir, newOffer.picture),
          path.resolve(__dirname, PUBLIC_IMG_DIR, newOffer.picture)
      );
    }

    res.redirect(`/my`);
  } catch (error) {
    console.log(error.message);
    const categories = await api.getCategories();
    res.render(`offers/new-ticket`, {newOffer, categories});
  }
});

offersRouter.get(`/edit/:id`, async (req, res) => {
  const {id} = req.params;

  const [offer, categories] = await Promise.all([
    api.getOffer(id),
    api.getCategories()
  ]);

  res.render(`offers/ticket-edit`, {offer, categories});
});

offersRouter.post(`/edit/:id`, upload.single(`avatar`), async (req, res) => {
  const {body, file} = req;
  const {id} = req.params;

  const isNewImage = checkObjProp(file, `filename`);

  const offerData = {
    picture: isNewImage ? file.filename : body[`offer-picture`],
    title: body[`ticket-name`],
    description: body.comment,
    sum: body.price,
    type: body.action,
    category: body.category,
  };

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
    console.log(error.message);

    const categories = await api.getCategories();
    res.render(`offers/ticket-edit`, {offerData, categories});
  }

});

offersRouter.get(`/:id`, async (req, res) => {
  const {id} = req.params;
  const ticket = await api.getOffer(id);

  res.render(`offers/ticket`, {ticket});
});

module.exports = offersRouter;
