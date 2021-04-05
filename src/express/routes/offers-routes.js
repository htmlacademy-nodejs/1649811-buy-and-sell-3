'use strict';

const express = require(`express`);
const path = require(`path`);
const he = require(`he`);
const fs = require(`fs`).promises;
const privateRoute = require(`../middleware/private-route`);
const {getTotalPages, calculatePagination, asyncWrapper, moveUploadedImage} = require(`../utils`);
const {emptyOffer, getRequestData, upload} = require(`./offer-helper`);
const {UPLOAD_DIR, USER_COOKIE_NAME} = require(`../const`);

const api = require(`../api`).getAPI();
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

offersRouter.get(`/add`, privateRoute, asyncWrapper(async (req, res) => {
  const categories = await api.getCategories();
  const offer = Object.assign({}, emptyOffer);

  res.render(`offers/ticket-new`, {offer, categories, errorMessages: []});
}));

offersRouter.post(`/add`, privateRoute, upload.single(`avatar`), asyncWrapper(async (req, res) => {
  const {file} = req;

  const [isPictureExist, offer] = getRequestData(req, res);

  if (isPictureExist) {
    offer.picture = file.filename;
  }

  try {
    const accessToken = req.signedCookies[USER_COOKIE_NAME];
    await api.createOffer(offer, accessToken);

    if (isPictureExist) {
      await moveUploadedImage(offer.picture);
    }

    res.redirect(`/my`);
  } catch (error) {
    if (isPictureExist) {
      await fs.unlink(path.join(UPLOAD_DIR, offer.picture));
    }

    const {message: errorMessages} = error.response.data;
    const categories = await api.getCategories();

    res.render(`offers/ticket-new`, {offer, categories, errorMessages});
  }
}));

offersRouter.get(`/edit/:id`, privateRoute, asyncWrapper(async (req, res) => {
  const {id} = req.params;

  const [offer, categories] = await Promise.all([
    api.getOffer(id),
    api.getCategories()
  ]);

  res.render(`offers/ticket-edit`, {offer, categories, errorMessages: []});
}));

offersRouter.post(`/edit/:id`, privateRoute, upload.single(`avatar`), asyncWrapper(async (req, res) => {
  const {id} = req.params;
  const [isNewImage, offerData] = getRequestData(req, res);
  try {
    const accessToken = req.signedCookies[USER_COOKIE_NAME];
    await api.editOffer(id, offerData, accessToken);

    res.redirect(`/my`);

    if (isNewImage) {
      await moveUploadedImage(offerData.picture);
    }
  } catch (error) {
    if (isNewImage) {
      await fs.unlink(path.join(UPLOAD_DIR, offerData.picture));
    }
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

offersRouter.post(`/:id/comments`, upload.any(), asyncWrapper(async (req, res) => {
  const {id} = req.params;
  const user = res.locals.loggedUser;

  const data = {
    text: he.escape(req.body.comment),
    userId: user.id,
  };

  try {

    await api.addComment(id, data);
    res.redirect(`/offers/${id}`);

  } catch (err) {
    const {message: errorMessage} = err.response.data;

    const offer = await api.getOffer(id, true, true);
    res.render(`offers/ticket`, {offer, comment: req.body, errorMessage});
  }

}));

module.exports = offersRouter;
