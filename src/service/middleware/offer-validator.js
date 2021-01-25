'use strict';

const baseValidator = require(`./base-validator`);

const offerKeys = [`categories`, `description`, `picture`, `title`, `type`, `sum`];

module.exports = baseValidator(offerKeys);
