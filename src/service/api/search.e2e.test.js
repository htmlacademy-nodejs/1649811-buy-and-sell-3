'use strict';

const express = require(`express`);
const request = require(`supertest`);
const {beforeAll, describe, test, expect} = require(`@jest/globals`);
const {Sequelize} = require(`sequelize`);

const search = require(`./search`);
const DataService = require(`../data-service/search`);
const initDb = require(`../lib/init-db`);

const {HttpCode} = require(`../const`);

const mockCategories = [`Обувь`, `Посуда`, `Книги`, `Животные`, `Разное`, `Игры`];
const mockOffers = [
  {
    "type": `buy`,
    "title": `Куплю породистого кота.`,
    "description": `Пользовались бережно и только по большим праздникам., Кажется, что это хрупкая вещь. Продаю кроссовки женские. Кожа, внутри на подкладке (хлопок). Отдам даром. Бонусом отдам все аксессуары. Если найдёте дешевле — сброшу цену. Товар новый. Даю недельную гарантию. Пальто мужское в идеальном состоянии. Это настоящая находка для коллекционера! Кому нужен этот новый телефон, если тут такое... Если товар не понравится — верну всё до последней копейки. Две страницы заляпаны свежим кофе. Товар в отличном состоянии. Продаю с болью в сердце... Мой дед не мог её сломать.`,
    "sum": 11718,
    "picture": `item15.jpg`,
  },
  {
    "type": `sale`,
    "title": `Люстры Италия, бронза.`,
    "description": `Товар новый. Пальто мужское в идеальном состоянии. Если товар не понравится — верну всё до последней копейки. Две страницы заляпаны свежим кофе. Бонусом отдам все аксессуары. Пользовались бережно и только по большим праздникам., Кажется, что это хрупкая вещь. Не пытайтесь торговаться. Цену вещам я знаю.`,
    "sum": 38774,
    "picture": `item05.jpg`,
  },
  {
    "type": `buy`,
    "title": `Куплю детские санки.`,
    "description": `Кому нужен этот новый телефон, если тут такое... Товар в отличном состоянии. Это настоящая находка для коллекционера! Товар новый. Две страницы заляпаны свежим кофе. Если найдёте дешевле — сброшу цену.`,
    "sum": 45989,
    "picture": `item13.jpg`,
  }
];
const mockUsers = [`Иван Иванов ivan@mail.com ivanov`];
const mockComments = [`Оплата наличными или перевод на карту?`];

const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});
const app = express();
app.use(express.json());

beforeAll(async () => {
  await initDb(mockDB, {categories: mockCategories, offers: mockOffers, users: mockUsers, comments: mockComments});
  search(app, new DataService(mockDB));
});


describe(`API returns offer based on search query`, () => {

  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/search`)
      .query({
        query: `Италия`
      });
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`1 offer found`, () => expect(response.body.length).toBe(1));
  test(`Offer has title "Люстры Италия, бронза."`, () => expect(response.body[0].title).toBe(`Люстры Италия, бронза.`));
});

test(
    `API returns code 404 if nothing is found`,
    () => request(app)
    .get(`/search`)
    .query({
      query: `Куплю коня`
    })
    .expect(HttpCode.NOT_FOUND)
);

test(
    `API returns 400 when query string is absent`,
    () => request(app)
    .get(`/search`)
    .expect(HttpCode.BAD_REQUEST)
);

test(
    `API returns 404 when method is post`,
    () => request(app)
    .post(`/search`)
    .expect(HttpCode.NOT_FOUND)
);
