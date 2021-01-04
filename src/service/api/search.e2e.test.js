'use strict';

const express = require(`express`);
const request = require(`supertest`);
const {beforeAll, describe, test, expect} = require(`@jest/globals`);

const search = require(`./search`);
const DataService = require(`../data-service/search`);
const {HttpCode} = require(`../../constants`);

const mockData = [
  {
    "id": `2rxdxG`,
    "type": `OFFER`,
    "title": `Люстры Италия, бронза.`,
    "description": `Товар новый. Пальто мужское в идеальном состоянии. Если товар не понравится — верну всё до последней копейки. Две страницы заляпаны свежим кофе. Бонусом отдам все аксессуары. Пользовались бережно и только по большим праздникам., Кажется, что это хрупкая вещь. Не пытайтесь торговаться. Цену вещам я знаю.`,
    "sum": 38774,
    "picture": `item05.jpg`,
    "category": [`Обувь`, `Посуда`, `Книги`, `Животные`, `Разное`, `Игры`],
    "comments": [
      {"id": `U_Tq4S`, "text": `Оплата наличными или перевод на карту?А сколько игр в комплекте?`}
    ]
  },
  {
    "id": `k8YYos`,
    "type": `SALE`,
    "title": `Куплю детские санки.`,
    "description": `Кому нужен этот новый телефон, если тут такое... Товар в отличном состоянии. Это настоящая находка для коллекционера! Товар новый. Две страницы заляпаны свежим кофе. Если найдёте дешевле — сброшу цену.`,
    "sum": 45989,
    "picture": `item13.jpg`,
    "category": [`Журналы`, `Животные`, `Обувь`, `Игры`, `Посуда`, `Одежда`, `Разное`],
    "comments": [
      {"id": `nkmqPw`, "text": `А сколько игр в комплекте?`},
      {"id": `DwV9Bw`, "text": `А где блок питания?`}
    ]
  },
  {
    "id": `0h_Bua`,
    "type": `SALE`,
    "title": `Пальто Zara.`,
    "description": `Отдам даром. Если товар не понравится — верну всё до последней копейки. Пользовались бережно и только по большим праздникам.,`,
    "sum": 45182,
    "picture": `item08.jpg`,
    "category": [`Обувь`],
    "comments": [
      {"id": `nfS_9r`, "text": `Продаю в связи с переездом. Отрываю от сердца.А сколько игр в комплекте?`},
      {"id": `QttgbM`, "text": `А сколько игр в комплекте?А где блок питания?`},
      {"id": `6TL1n8`, "text": `Совсем немного...`}
    ]
  },
  {
    "id": `ypI7mU`,
    "type": `OFFER`,
    "title": `Отдам в хорошие руки подшивку «Мурзилка».`,
    "description": `Если найдёте дешевле — сброшу цену. При покупке с меня бесплатная доставка в черте города. Мой дед не мог её сломать. Это настоящая находка для коллекционера! Продаю кроссовки женские. Кожа, внутри на подкладке (хлопок). Таких предложений больше нет! Продаю с болью в сердце... Если товар не понравится — верну всё до последней копейки. Две страницы заляпаны свежим кофе. Товар в отличном состоянии. Кому нужен этот новый телефон, если тут такое... Пальто мужское в идеальном состоянии. Даю недельную гарантию.`,
    "sum": 44487,
    "picture": `item10.jpg`,
    "category": [`Одежда`, `Животные`, `Посуда`],
    "comments": [
      {
        "id": `deAfsb`,
        "text": `С чем связана продажа? Почему так дешёво?Продаю в связи с переездом. Отрываю от сердца.А сколько игр в комплекте?`
      },
      {"id": `iieTr_`, "text": `А где блок питания?`}
    ]
  },
  {
    "id": `BE8epS`,
    "type": `OFFER`,
    "title": `Продам советскую посуду. Почти не разбита.`,
    "description": `Продаю кроссовки женские. Кожа, внутри на подкладке (хлопок). Отдам даром.`,
    "sum": 28561,
    "picture": `item03.jpg`,
    "category": [`Игры`, `Разное`, `Обувь`, `Посуда`, `Книги`, `Журналы`],
    "comments": [
      {"id": `9117q-`, "text": `С чем связана продажа? Почему так дешёво?`}
    ]
  }
];

const app = express();
app.use(express.json());

search(app, new DataService(mockData));

describe(`API returns offer based on search query`, () => {

  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/search`)
      .query({
        query: `Продам`
      });
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`1 offer found`, () => expect(response.body.length).toBe(1));
  test(`Offer has correct id`, () => expect(response.body[0].id).toBe(`BE8epS`));
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
