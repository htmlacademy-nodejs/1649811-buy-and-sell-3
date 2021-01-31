'use strict';

const DEFAULT_COMMAND = `--help`;

const USER_ARGV_INDEX = 2;

const DEFAULT_PORT = 3000;

const ExitCode = {
  ERROR: 1,
  SUCCESS: 0,
};

const MAX_ID_LENGTH = 6;

const HttpCode = {
  OK: 200,
  CREATED: 201,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  FORBIDDEN: 403,
  UNAUTHORIZED: 401,
  BAD_REQUEST: 400,
};

const API_PREFIX = `/api`;

const Env = {
  DEVELOPMENT: `development`,
  PRODUCTION: `production`
};

const OFFERS_PER_PAGE = 8;

module.exports = {
  DEFAULT_COMMAND,
  USER_ARGV_INDEX,
  DEFAULT_PORT,
  ExitCode,
  MAX_ID_LENGTH,
  HttpCode,
  API_PREFIX,
  Env,
  OFFERS_PER_PAGE,
};
