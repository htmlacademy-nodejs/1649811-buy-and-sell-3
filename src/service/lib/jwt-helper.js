'use strict';

const jwt = require(`jsonwebtoken`);
const {JWT_ACCESS_SECRET, JWT_REFRESH_SECRET} = process.env;

const makeTokens = (tokenData) => {
  const accessToken = jwt.sign(tokenData, JWT_ACCESS_SECRET, {expiresIn: `15m`});
  const refreshToken = jwt.sign(tokenData, JWT_REFRESH_SECRET);

  return {accessToken, refreshToken};
};

module.exports = makeTokens;
