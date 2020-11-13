'use strict';

const help = require(`./help`);
const generate = require(`./generate`);
const version = require(`./version`);


const Cli = {
  [help.name]: help,
  [generate.name]: generate,
  [version.name]: version
};

module.exports = {
  Cli,
};
