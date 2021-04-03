'use strict';

const express = require(`express`);
const path = require(`path`);
const session = require(`express-session`);
const cookieParser = require(`cookie-parser`);
const helmet = require(`helmet`);
const offersRoutes = require(`./routes/offers-routes`);
const myRoutes = require(`./routes/my-routes`);
const mainRoutes = require(`./routes/main-routes`);
const {HttpCode} = require(`../constants`);
const loggedUser = require(`./middleware/logged-user`);

require(`dotenv`).config();

const DEFAULT_PORT = 8080;
const PUBLIC_DIR = `public`;
const VIEWS_DIR = `templates`;


const app = express();

app.set(`views`, path.resolve(__dirname, VIEWS_DIR));
app.set(`view engine`, `pug`);

app.disable(`x-powered-by`);
app.use(
    helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: [`'self'`, `'unsafe-inline'`],
        scriptSrc: [`'self'`, `'unsafe-inline'`],
        objectSrc: [`'none'`],
        upgradeInsecureRequests: [],
      },
      reportOnly: false,
    })
);
app.use(helmet.xssFilter());

app.use(session({
  secret: process.env.SECRET_SESSION,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    expires: new Date(Date.now() + 60 * 60 * 1000 * 24)
  }
}));

app.use(cookieParser(process.env.SECRET_SESSION));

app.use(express.static(path.resolve(__dirname, PUBLIC_DIR)));

app.use(loggedUser);

app.use(`/offers`, offersRoutes);
app.use(`/my`, myRoutes);
app.use(`/`, mainRoutes);

app.use((req, res) => {
  res.status(HttpCode.NOT_FOUND).render(`errors/404`);
});

app.use((err, req, res, _next) => {
  if (err.code === `EBADCSRFTOKEN`) {
    res.status(HttpCode.FORBIDDEN).render(`errors/403`);
  }
  console.error(err.stack);
  res.status(HttpCode.INTERNAL_SERVER_ERROR).render(`errors/500`);
});

app.listen(DEFAULT_PORT, () =>
  console.log(`Принимаю соединения на порт: ${DEFAULT_PORT}`));
