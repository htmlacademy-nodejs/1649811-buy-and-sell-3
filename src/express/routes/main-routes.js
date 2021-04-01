'use strict';

const express = require(`express`);
const path = require(`path`);
const cookieParser = require(`cookie-parser`);
const fs = require(`fs`).promises;
const {
  getTotalPages, calculatePagination, asyncWrapper,
} = require(`../../utils`);
const {
  emptyUser, getRequestData, absoluteUploadDir, upload
} = require(`./user-helper`);
const api = require(`../api`).getAPI();

const PUBLIC_IMG_DIR = `../public/img`;


const router = new express.Router();

router.use(cookieParser());

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

router.get(`/register`, asyncWrapper(async (req, res) => {
  const user = {...emptyUser};
  res.render(`main/sign-up`, {emptyUser, user, errorMessages: []});
}));

router.post(`/register`, upload.single(`avatar`), asyncWrapper(async (req, res) => {
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
    res.render(`main/sign-up`, {user, errorMessages});
  }

}));
router.get(`/login`, (req, res) => res.render(`main/login`));

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

/*

module.exports = (app, userService) => {
  const route = new Router();

  route.post(`/register`, [validator(newUserSchema), userExists(userService)], asyncWrapper(async (req, res) => {
    await userService.create(req.body);
    return res.redirect(`/login`);
  }));

  route.post(`/login`, [validator(userSchema), authenticate(userService)], asyncWrapper(async (req, res) => {
    res.redirect(`/`);
  }));

  app.use(`/`, route);
};


 */
