'use strict';

const express = require(`express`);
const fs = require(`fs`).promises;
const chalk = require(`chalk`);
const {HttpCode, DEFAULT_PORT} = require(`../../constants`);
const {fileExists} = require(`../../utils`);

const FILE_DATA = `${__dirname}/../../../mocks.json`;

const router = new express.Router();
const offersRoute = router.get(`/offers`, async (req, res) => {
  try {
    let json = [];
    if (await fileExists(FILE_DATA)) {
      const fileContent = await fs.readFile(FILE_DATA, `utf8`);
      if (fileContent.length) {
        json = JSON.parse(fileContent);
      }
    }
    res.send(json);
  } catch (err) {
    res.status(HttpCode.INTERNAL_SERVER_ERROR).send(err.message);
  }
});

const app = express();
app.use(express.json());

app.use(offersRoute);

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

    app.listen(port, (err) => {
      if (err) {
        return console.error(chalk.red(`Ошибка при создании сервера.`, err));
      }

      return console.info(chalk.yellow(`Принимаю соединения на порт: ${port}`));
    });
  }
};
