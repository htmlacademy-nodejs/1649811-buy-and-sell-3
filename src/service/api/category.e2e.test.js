'use strict';

const express = require(`express`);
const request = require(`supertest`);
const {beforeAll, describe, test, expect} = require(`@jest/globals`);
const {Sequelize} = require(`sequelize`);

const category = require(`./category`);
const DataService = require(`../data-service/category`);
const initDb = require(`../lib/init-db`);

const {HttpCode} = require(`../const`);

const mockCategories = [`Журналы`, `Игры`, `Одежда`];
const mockOffers = [
  {
    "type": `sale`,
    "title": `Куплю породистого кота.`,
    "description": `Пользовались бережно и только по большим праздникам., Кажется, что это хрупкая вещь. Продаю кроссовки женские. Кожа, внутри на подкладке (хлопок). Отдам даром. Бонусом отдам все аксессуары. Если найдёте дешевле — сброшу цену. Товар новый. Даю недельную гарантию. Пальто мужское в идеальном состоянии. Это настоящая находка для коллекционера! Кому нужен этот новый телефон, если тут такое... Если товар не понравится — верну всё до последней копейки. Две страницы заляпаны свежим кофе. Товар в отличном состоянии. Продаю с болью в сердце... Мой дед не мог её сломать.`,
    "sum": 11718,
    "picture": `item15.jpg`,
  },
];
const mockUsers = [`Иван Иванов ivan@mail.com ivanov`];
const mockComments = [`Оплата наличными или перевод на карту?`];

const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});
const app = express();
app.use(express.json());

beforeAll(async () => {
  await initDb(mockDB, {categories: mockCategories, offers: mockOffers, users: mockUsers, comments: mockComments});
  category(app, new DataService(mockDB));
});

describe(`API returns category list`, () => {

  let response;

  beforeAll(async () => {
    response = await request(app).get(`/categories`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns list of 3 categories`, () => expect(response.body.length).toBe(3));
  test(
      `Category names are "Журналы", "Игры", "Одежда"`,
      () => expect(response.body.map((item) => item.title)).toEqual(
          expect.arrayContaining(mockCategories)
      )
  );
});
