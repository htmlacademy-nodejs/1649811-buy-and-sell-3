'use strict';

const path = require(`path`);

const PUBLIC_IMG_DIR = path.resolve(__dirname, `public`, `img`);
const UPLOAD_DIR = path.join(__dirname, `upload`);
const USER_COOKIE_NAME = `user`;
const SESSION_NAME = `sid`;
const DEFAULT_PORT = 8080;
const PUBLIC_DIR = `public`;
const VIEWS_DIR = `templates`;
const OFFERS_PER_PAGE = 4;
const HttpCode = {
  OK: 200,
  CREATED: 201,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  FORBIDDEN: 403,
  UNAUTHORIZED: 401,
  BAD_REQUEST: 400,
  REDIRECT: 302,
};

module.exports = {
  PUBLIC_IMG_DIR,
  UPLOAD_DIR,
  USER_COOKIE_NAME,
  SESSION_NAME,
  DEFAULT_PORT,
  PUBLIC_DIR,
  VIEWS_DIR,
  OFFERS_PER_PAGE,
  HttpCode,
};
