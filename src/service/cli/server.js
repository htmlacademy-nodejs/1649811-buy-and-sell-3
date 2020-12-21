'use strict';

const express = require(`express`);
const chalk = require(`chalk`);
const {HttpCode, DEFAULT_PORT, API_PREFIX} = require(`../../constants`);
const routes = require(`../api`);

const app = express();

app.use(express.json());

app.use(API_PREFIX, routes);

app.use((req, res) => {
  res.status(HttpCode.NOT_FOUND).send(`Not found`);
});

app.use((err, _req, _res, _next) => {
  console.error(chalk.red(err.stack));
});

module.exports = {
  name: `--server`,
  run: async (arg) => {
    const port = Number.parseInt(arg, 10) || DEFAULT_PORT;

    app.listen(port, () => {
      return console.info(chalk.yellow(`Принимаю соединения на порт: ${port}`));
    });
  }
};
