'use strict';

const Joi = require(`joi`);
const {
  MIN_PASSWORD_LENGTH,
  MAX_PASSWORD_LENGTH
} = require(`../../constants`);


module.exports = Joi.object({

  firstname: Joi.string()
    .regex(/^[a-zA-Zа-яА-Я]+$/i)
    .required(),

  lastname: Joi.string()
    .regex(/^[a-zA-Zа-яА-Я]+$/i)
    .required(),

  email: Joi.string()
    .required()
    .email(),

  password: Joi.string()
    .required()
    .min(MIN_PASSWORD_LENGTH)
    .max(MAX_PASSWORD_LENGTH),

  repeat: Joi.string()
    .required()
    .valid(Joi.ref(`password`)),

  avatar: Joi.string()
    .required(),
});
