'use strict';

const express = require(`express`);
const path = require(`path`);

const offersRoutes = require(`./routes/offers-routes`);
const myRoutes = require(`./routes/my-routes`);
const mainRoutes = require(`./routes/main-routes`);
const {HttpCode} = require(`../constants`);

const DEFAULT_PORT = 8080;
const PUBLIC_DIR = `public`;
const VIEWS_DIR = `templates`;

const app = express();

app.use(`/offers`, offersRoutes);
app.use(`/my`, myRoutes);
app.use(`/`, mainRoutes);

app.use(express.static(path.resolve(__dirname, PUBLIC_DIR)));

app.use((req, res) => {
  res.status(HttpCode.NOT_FOUND).render(`errors/404`);
});

app.use((err, req, res, _next) => {
  console.error(err.stack);
  res.status(HttpCode.INTERNAL_SERVER_ERROR).render(`errors/500`);
});

app.set(`views`, path.resolve(__dirname, VIEWS_DIR));
app.set(`view engine`, `pug`);

app.listen(DEFAULT_PORT, () =>
  console.log(`Принимаю соединения на порт: ${DEFAULT_PORT}`));
