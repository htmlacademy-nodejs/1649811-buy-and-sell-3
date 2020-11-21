'use strict';

const http = require(`http`);
const fs = require(`fs`).promises;
const chalk = require(`chalk`);
const {HttpCode, DEFAULT_PORT} = require(`../../constants`);

const FILE_DATA = `${__dirname}/../../../mocks.json`;


const onClientConnect = async (req, res) => {
  const notFoundMessageText = `Not found`;

  switch (req.url) {
    case `/`:
      try {
        const fileContent = await fs.readFile(FILE_DATA, `utf8`);
        const mocks = JSON.parse(fileContent.trim());
        const listItems = mocks.map((announce) => `<li>${announce.title}</li>`).join(``);
        sendResponse(res, HttpCode.OK, `<ul>${listItems}</ul>`);
      } catch (err) {
        sendResponse(res, HttpCode.NOT_FOUND, notFoundMessageText);
      }
      break;

    default:
      sendResponse(res, HttpCode.NOT_FOUND, notFoundMessageText);
      break;
  }
};

const sendResponse = (res, statusCode, message) => {
  const template = `
    <!Doctype html>
      <html lang="ru">
      <head>
        <title>Module 2</title>
      </head>
      <body>${message}</body>
    </html>`.trim();

  res.statusCode = statusCode;
  res.writeHead(statusCode, {
    'Content-Type': `text/html; charset=UTF-8`,
  });

  res.end(template);
};


module.exports = {
  name: `--server`,
  run: async (arg) => {
    const port = Number.parseInt(arg, 10) || DEFAULT_PORT;
    const httpServer = http.createServer(onClientConnect);

    httpServer
      .listen(port)
      .on(`listening`, (err) => {
        if (err) {
          return console.error(chalk.red(`Ошибка при создании сервера.`, err));
        }
        return console.info(chalk.green(`Принимаю соединения на порт: ${port}`));
      });
  }
};
