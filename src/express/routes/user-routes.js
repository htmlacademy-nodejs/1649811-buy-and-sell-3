'use strict';

const express = require(`express`);
const path = require(`path`);
const fs = require(`fs`).promises;
const csrf = require(`csurf`);
const {asyncWrapper, moveUploadedImage} = require(`../utils`);
const {newEmptyUser, emptyUser, getRequestData, getRequestLoginData, upload} = require(`./user-helper`);
const {USER_COOKIE_NAME, REFRESH_COOKIE_NAME, UPLOAD_DIR, userCookieOption} = require(`../const`);

const api = require(`../api`).getAPI();
const csrfProtection = csrf({cookie: {sameSite: `strict`}});

const router = new express.Router();

router.get(`/register`, csrfProtection, asyncWrapper(async (req, res) => {
  res.render(`main/sign-up`, {user: newEmptyUser, csrf: req.csrfToken(), errorMessages: []});
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
      await moveUploadedImage(user.avatar);
    }

    res.redirect(`/login`);
  } catch (error) {
    if (isPictureExist) {
      await fs.unlink(path.join(UPLOAD_DIR, user.avatar));
    }
    const {message: errorMessages} = error.response.data;
    res.render(`main/sign-up`, {user, csrf: req.csrfToken(), errorMessages});
  }

}));

router.get(`/login`, csrfProtection, asyncWrapper(async (req, res) => {
  res.render(`main/login`, {user: emptyUser, csrf: req.csrfToken(), errorMessages: []});
}));

router.post(`/login`, upload.any(), csrfProtection, asyncWrapper(async (req, res) => {
  const data = getRequestLoginData(req);
  try {
    const {accessToken, refreshToken} = await api.login(data);

    res
      .cookie(USER_COOKIE_NAME, accessToken, userCookieOption)
      .cookie(REFRESH_COOKIE_NAME, refreshToken, userCookieOption)
      .redirect(`/`);

  } catch (error) {
    console.log(error);

    const {message: errorMessages} = error.response.data;
    res.render(`main/login`, {user: data, csrf: req.csrfToken(), errorMessages});
  }
}));

router.get(`/logout`, asyncWrapper(async (req, res) => {
  const accessToken = req.signedCookies[USER_COOKIE_NAME];
  const refreshToken = req.signedCookies[REFRESH_COOKIE_NAME];

  await api.logout(accessToken, refreshToken);
  res
    .clearCookie(USER_COOKIE_NAME)
    .clearCookie(REFRESH_COOKIE_NAME)
    .redirect(`/`);
}));


module.exports = router;
