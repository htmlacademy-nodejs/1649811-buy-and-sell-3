'use strict';

const express = require(`express`);
const path = require(`path`);
const fs = require(`fs`).promises;
const csrf = require(`csurf`);
const {getTotalPages, calculatePagination, asyncWrapper} = require(`../../utils`);
const {
  emptyUser, getRequestData, getRequestLoginData, absoluteUploadDir, upload
} = require(`./user-helper`);
const api = require(`../api`).getAPI();
const {USER_COOKIE} = require(`../const`);

const csrfProtection = csrf({cookie: true});

const PUBLIC_IMG_DIR = `../public/img`;
const router = new express.Router();

router.get(`/`, asyncWrapper(async (req, res) => {

  const [page, limit, offset] = calculatePagination(req.query);

  const [
    {count, offers},
    categories
  ] = await Promise.all([
    api.getOffers({limit, offset}),
    api.getCategories(true),
  ]);

  const totalPages = getTotalPages(count);

  res.render(`main`, {offers, categories, page, totalPages});
}));

router.get(`/register`, csrfProtection, asyncWrapper(async (req, res) => {
  const user = {...emptyUser};
  res.render(`main/sign-up`, {user, csrf: req.csrfToken(), errorMessages: []});
}));

router.post(`/register`, upload.single(`avatar`), csrfProtection, asyncWrapper(async (req, res) => {
  const {file} = req;

  const [isPictureExist, user] = getRequestData(req);

  if (isPictureExist) {
    user.avatar = file.filename;
  }

  try {
    await api.createUser(user);

    if (isPictureExist) {

      await fs.copyFile(
        path.resolve(absoluteUploadDir, user.avatar),
        path.resolve(__dirname, PUBLIC_IMG_DIR, user.avatar)
      );

      await fs.unlink(path.resolve(absoluteUploadDir, user.avatar));
    }

    res.redirect(`/login`);
  } catch (error) {
    const {message: errorMessages} = error.response.data;
    res.render(`main/sign-up`, {user, csrf: req.csrfToken(), errorMessages});
  }

}));

router.get(`/login`, csrfProtection, asyncWrapper(async (req, res) => {
  const user = {email: ``, password: ``};
  res.render(`main/login`, {user, csrf: req.csrfToken(), errorMessages: []});
}));

router.post(`/login`, upload.any(), csrfProtection, asyncWrapper(async (req, res) => {
  const data = getRequestLoginData(req);
  try {
    const user = await api.login(data);

    res
      .cookie(USER_COOKIE, JSON.stringify(user), {signed: true, httpOnly: true, sameSite: `strict`})
      .redirect(`/`);

  } catch (error) {
    console.log(data);
    const {message: errorMessages} = error.response.data;
    res.render(`main/login`, {user: data, csrf: req.csrfToken(), errorMessages});
  }

}));

router.get(`/logout`, asyncWrapper(async (req, res) => {
  res
    .clearCookie(USER_COOKIE)
    .redirect(`/`);
}));

router.get(`/search`, asyncWrapper(async (req, res) => {
  try {
    const {search} = req.query;
    let results = await api.search(search);

    res.render(`main/search-result`, {results});
  } catch (error) {
    console.log(error.message);
    res.render(`main/search-result`, {results: []});
  }
}));

module.exports = router;
