'use strict';

const {Router} = require(`express`);
const {asyncWrapper} = require(`../../utils`);
const {HttpCode} = require(`../../constants`);
const newUserSchema = require(`../middleware/new-user-schema`);
const userSchema = require(`../middleware/user-schema`);
const validator = require(`../middleware/validator-middleware`);
const alreadyExist = require(`../middleware/already-register`);


module.exports = (app, userService) => {
  const route = new Router();

  route.post(`/user`, [validator(newUserSchema), alreadyExist(userService)], asyncWrapper(async (req, res) => {
    const isCreated = await userService.create(req.body);
    return isCreated ? res.status(HttpCode.CREATED).json() : res.status(HttpCode.BAD_REQUEST).json();
  }));

  route.post(`/login`, validator(userSchema), asyncWrapper(async (req, res) => {
    const {email, password} = req.body;

    const user = await userService.findByEmail(email);
    if (!user) {
      return res.status(HttpCode.NOT_FOUND)
        .json({message: [`User with email ${email} not found`]});
    }

    if (!await userService.checkAuth(user, password)) {
      return res.status(HttpCode.UNAUTHORIZED)
        .json({message: [`Wrong password`]});
    }

    delete user.password;

    return res.status(HttpCode.OK).json(user);
  }));

  app.use(`/`, route);
};

