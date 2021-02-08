'use strict';

const Joi = require(`joi`);

module.exports = Joi.object({
  title: Joi.string()
    .min(10)
    .max(100)
    .required(),

  description: Joi.string()
    .min(50)
    .max(1000)
    .required(),

  categories: Joi.array()
    .items(Joi.number().min(1))
    .required(),

  sum: Joi.number()
    .min(100)
    .required(),

  type: Joi.string()
    .valid(`buy`, `sale`)
    .required(),

  picture: Joi.string()
    .max(255)
    .required(),

  userId: Joi.number()
    .required(),

  comments: Joi.array()
    .items(Joi.number().min(1)),
});

