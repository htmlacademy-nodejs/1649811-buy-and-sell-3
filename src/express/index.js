'use strict';

const express = require(`express`);
const path = require(`path`);
const chalk = require(`chalk`);

const offersRoutes = require(`./routes/offers-routes`);
const myRoutes = require(`./routes/my-routes`);
const mainRoutes = require(`./routes/main-routes`);

const DEFAULT_PORT = 8080;
const PUBLIC_DIR = `public`;
const VIEWS_DIR = `templates`;

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  console.error(chalk.red(err.stack));
  res.status(500).render(`errors/500`);
};

// eslint-disable-next-line no-unused-vars
const notFoundHandler = (req, res, next) => {
  res.status(404).render(`errors/404`);
};

const app = express();

app.use(express.static(path.resolve(__dirname, PUBLIC_DIR)));

app.set(`views`, path.resolve(__dirname, VIEWS_DIR));
app.set(`view engine`, `pug`);

app.use(`/offers`, offersRoutes);
app.use(`/my`, myRoutes);
app.use(`/`, mainRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(DEFAULT_PORT, () =>
  console.log(chalk.yellow(`Принимаю соединения на порт: ${DEFAULT_PORT}`)));
