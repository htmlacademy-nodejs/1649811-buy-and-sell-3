'use strict';

const chalk = require(`chalk`);

module.exports = {
  name: `--help`,
  run() {
    const message = `
    Программа запускает http-сервер и формирует файл с данными для API.

    Гайд:
    service.js <command>

    Команды:
      --server              запуск сервера
      --version:            выводит номер версии
      --help:               печатает этот текст
      --generate [count]    формирует файл mocks.json
      --fill [count]        формирует файл fill-db.sql
    `;
    console.info(chalk.gray(message));
  }
};
