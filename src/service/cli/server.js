'use strict';

const express = require(`express`);
const {HttpCode, DEFAULT_PORT, API_PREFIX, ExitCode} = require(`../../constants`);
const routes = require(`../api`);
const {getLogger} = require(`../lib/logger`);
const sequelize = require(`../lib/sequelize`);

const app = express();
const logger = getLogger({name: `api`});

app.use(express.json());

app.use((req, res, next) => {
  logger.debug(`Request ${req.method} ${req.url}`);
  res.on(`finish`, () => {
    logger.info(`Response status code ${res.statusCode}`);
  });
  next();
});

app.use(API_PREFIX, routes);

app.use((req, res) => {
  res.status(HttpCode.NOT_FOUND).send(`Not found`);
  logger.error(`Route not found: ${req.url}`);
});

app.use((err, _req, _res, _next) => {
  logger.error(`An error occurred while processing the request: ${err.message}`);
});

module.exports = {
  name: `--server`,
  run: async (arg) => {

    const port = Number.parseInt(arg, 10) || DEFAULT_PORT;

    try {
      console.info(`Trying to connect to database...`);
      await sequelize.authenticate();

      console.info(`Connection has been established successfully.`);

      app.listen(port, () => {
        console.info(`Server listening to connections on ${port}`);
      });
    } catch (err) {
      console.error(`An error occurred: ${err.message}`);
      process.exit(ExitCode.ERROR);
    }
  }
};
