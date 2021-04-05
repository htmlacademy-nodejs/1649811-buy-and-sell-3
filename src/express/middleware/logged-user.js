'use strict';

const jwt = require(`jsonwebtoken`);
const {USER_COOKIE_NAME, REFRESH_COOKIE_NAME, userCookieOption} = require(`../const`);
const api = require(`../api`).getAPI();

module.exports = (req, res, next) => {
  const user = req.signedCookies[USER_COOKIE_NAME];
  if (!user) {
    next();
    return;
  }

  jwt.verify(user, process.env.JWT_ACCESS_SECRET, async (err, userData) => {
    if (err) {
      const refresh = req.signedCookies[REFRESH_COOKIE_NAME];
      const {accessToken, refreshToken} = await api.refresh(refresh);
      res
        .cookie(USER_COOKIE_NAME, accessToken, userCookieOption)
        .cookie(REFRESH_COOKIE_NAME, refreshToken, userCookieOption);

      res.locals.loggedUser = jwt.decode(accessToken);

      next();
      return;
    }

    res.locals.loggedUser = userData;
    next();
  });
};
