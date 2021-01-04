'use strict';

const baseValidator = require(`./base-validator`);

const offerKeys = [`category`, `description`, `picture`, `title`, `type`, `sum`];

module.exports = baseValidator(offerKeys);
