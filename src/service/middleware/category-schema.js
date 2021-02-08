'use strict';

const Joi = require(`joi`);

module.exports = Joi.object({
  text: Joi.string()
    .max(100)
    .required(),
});

