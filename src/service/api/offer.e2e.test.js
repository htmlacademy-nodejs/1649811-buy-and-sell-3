'use strict';

const express = require(`express`);
const request = require(`supertest`);
const {beforeAll, describe, test, expect} = require(`@jest/globals`);

const {HttpCode} = require(`../../constants`);
const offer = require(`./offer`);
const DataService = require(`../data-service/offer`);
const CommentService = require(`../data-service/comment`);

const mockData = [
  {
    "id": `LvViKa`,
    "type": `SALE`,
    "title": `Продам отличную подборку фильмов на VHS.`,
    "description": `Даю недельную гарантию. Две страницы заляпаны свежим кофе. Это настоящая находка для коллекционера! Продаю с болью в сердце... Кому нужен этот новый телефон, если тут такое... Таких предложений больше нет! Пользовались бережно и только по большим праздникам., Кажется, что это хрупкая вещь. Бонусом отдам все аксессуары.`,
    "sum": 90206,
    "picture": `item01.jpg`,
    "category": [`Обувь`, `Посуда`, `Игры`, `Журналы`],
    "comments": [
      {"id": `T1UHei`, "text": `Неплохо, но дорого`},
      {"id": `GWaIQW`, "text": `Продаю в связи с переездом. Отрываю от сердца.А сколько игр в комплекте?`},
      {"id": `lRy54-`, "text": `Неплохо, но дорогоВы что?! В магазине дешевле.`}
    ]
  },
  {
    "id": `hhAuYj`,
    "type": `SALE`,
    "title": `Продам Смартфон Apple iPhone.`,
    "description": `Продаю кроссовки женские. Кожа, внутри на подкладке (хлопок). Даю недельную гарантию. Кажется, что это хрупкая вещь.`,
    "sum": 50984,
    "picture": `item07.jpg`,
    "category": [`Журналы`, `Игры`, `Разное`],
    "comments": [
      {
        "id": `ZYr1nQ`,
        "text": `Почему в таком ужасном состоянии?Продаю в связи с переездом. Отрываю от сердца.`
      },
      {"id": `obLbia`, "text": `Неплохо, но дорогоА где блок питания?Вы что?! В магазине дешевле.`}, {
        "id": `Pi6Wdi`,
        "text": `С чем связана продажа? Почему так дешёво?Неплохо, но дорого`
      },
      {"id": `3mRxlY`, "text": `А сколько игр в комплекте?С чем связана продажа? Почему так дешёво?`}
    ]
  },
  {
    "id": `PvZ1Ii`,
    "type": `SALE`,
    "title": `Продам отличную подборку фильмов на VHS.`,
    "description": `Продаю с болью в сердце... Это настоящая находка для коллекционера! Отдам даром. Продаю кроссовки женские. Кожа, внутри на подкладке (хлопок). Пальто мужское в идеальном состоянии. Кажется, что это хрупкая вещь. Две страницы заляпаны свежим кофе. Товар в отличном состоянии. Кому нужен этот новый телефон, если тут такое... Таких предложений больше нет! Товар новый. Бонусом отдам все аксессуары. Не пытайтесь торговаться. Цену вещам я знаю. Если товар не понравится — верну всё до последней копейки.`,
    "sum": 7059,
    "picture": `item07.jpg`,
    "category": [`Животные`, `Книги`, `Игры`],
    "comments": [
      {
        "id": `O-8HM2`,
        "text": `Вы что?! В магазине дешевле.Оплата наличными или перевод на карту?А сколько игр в комплекте?`
      },
      {"id": `TqKy5w`, "text": `А сколько игр в комплекте?С чем связана продажа? Почему так дешёво?`}, {
        "id": `UMs82h`,
        "text": `А где блок питания?Совсем немного...А сколько игр в комплекте?`
      }
    ]
  },
  {
    "id": `wni_qp`,
    "type": `SALE`,
    "title": `Продам Смартфон Apple iPhone.`,
    "description": `Отдам даром. Товар в отличном состоянии. Если товар не понравится — верну всё до последней копейки. Бонусом отдам все аксессуары. Две страницы заляпаны свежим кофе. Кому нужен этот новый телефон, если тут такое... Мой дед не мог её сломать. Даю недельную гарантию. Таких предложений больше нет! Не пытайтесь торговаться. Цену вещам я знаю. Пальто мужское в идеальном состоянии. Кажется, что это хрупкая вещь. Продаю с болью в сердце... Если найдёте дешевле — сброшу цену. Продаю кроссовки женские. Кожа, внутри на подкладке (хлопок). Товар новый. Это настоящая находка для коллекционера! Пользовались бережно и только по большим праздникам.,`,
    "sum": 22317,
    "picture": `item11.jpg`,
    "category": [`Разное`, `Журналы`],
    "comments": [
      {
        "id": `MrzrgK`,
        "text": `Почему в таком ужасном состоянии?Вы что?! В магазине дешевле.Оплата наличными или перевод на карту?`
      },
      {"id": `MIqC7-`, "text": `Продаю в связи с переездом. Отрываю от сердца.`}, {
        "id": `xP7FOG`,
        "text": `Вы что?! В магазине дешевле.Почему в таком ужасном состоянии?`
      }
    ]
  },
  {
    "id": `Wk54gX`,
    "type": `OFFER`,
    "title": `Продам Смартфон Apple iPhone.`,
    "description": `Таких предложений больше нет! Не пытайтесь торговаться. Цену вещам я знаю. Товар в отличном состоянии. Кому нужен этот новый телефон, если тут такое... Товар новый. Продаю с болью в сердце... При покупке с меня бесплатная доставка в черте города. Пользовались бережно и только по большим праздникам., Даю недельную гарантию. Если найдёте дешевле — сброшу цену. Отдам даром. Если товар не понравится — верну всё до последней копейки. Это настоящая находка для коллекционера! Бонусом отдам все аксессуары.`,
    "sum": 84557,
    "picture": `item14.jpg`,
    "category": [`Животные`, `Разное`],
    "comments": [
      {
        "id": `-BMCrO`,
        "text": `Совсем немного...Оплата наличными или перевод на карту?Вы что?! В магазине дешевле.`
      },
      {
        "id": `CvuE_p`,
        "text": `Оплата наличными или перевод на карту?С чем связана продажа? Почему так дешёво?`
      },
      {"id": `ElkXwV`, "text": `Почему в таком ужасном состоянии?Вы что?! В магазине дешевле.`}, {
        "id": `vmLu7U`,
        "text": `Продаю в связи с переездом. Отрываю от сердца.Оплата наличными или перевод на карту?`
      }
    ]
  }
];

const mockNewOffer = {
  "category": [`Животные`, `Разное`],
  "title": `Продаю коня`,
  "description": `Конь в отличном состоянии, пробег 1000 км`,
  "picture": `1.jpg`,
  "type": `SALE`,
  "sum": 1234,
};

const createAPI = () => {
  const app = express();

  const cloneData = JSON.parse(JSON.stringify(mockData));

  app.use(express.json());
  offer(app, new DataService(cloneData), new CommentService());

  return app;
};

describe(`API returns a list of all offers`, () => {
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app).get(`/offers`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns a list of 5 offers`, () => expect(response.body.length).toBe(5));

  test(`First offer id equals "LvViKa"`, () => expect(response.body[0].id).toBe(`LvViKa`));
});

describe(`API returns an offer with given id`, () => {

  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app).get(`/offers/hhAuYj`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Offer title is "Продам Смартфон Apple iPhone."`, () =>
    expect(response.body.title).toBe(`Продам Смартфон Apple iPhone.`));
});

describe(`API created an offer if data is valid`, () => {
  const newOffer = Object.assign({}, mockNewOffer);
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app).post(`/offers`).send(newOffer);
  });

  test(`Status code 201`, () =>
    expect(response.statusCode).toBe(HttpCode.CREATED));

  test(`Returns offer created`, () => expect(response.body).toEqual(expect.objectContaining(newOffer)));

  test(`Offers count is changed`, () => request(app).get(`/offers`)
    .expect((res) => expect(res.body.length).toBe(6)));
});

describe(`API refuses to create an offer if data is invalid`, () => {
  const newOffer = Object.assign({}, mockNewOffer);
  const app = createAPI();

  test(`Without any required property response code is 400`, async () => {

    for (const key of Object.keys(newOffer)) {
      const badOffer = {...newOffer};
      delete badOffer[key];

      await request(app).post(`/offers`).send(badOffer)
        .expect(HttpCode.BAD_REQUEST);
    }
  });
});

describe(`API changes existent offer`, () => {
  const newOffer = Object.assign({}, mockNewOffer, {comments: []});

  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app).put(`/offers/PvZ1Ii`).send(newOffer);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns changed offer`,
      () => expect(response.body).toEqual(expect.objectContaining(newOffer)));

  beforeAll(async () => {
    response = await request(app).get(`/offers/PvZ1Ii`);
  });

  test(`Offer is really changed`,
      () => expect(response.body.title).toBe(`Продаю коня`));

  test(`Offer comments is empty array`,
      () => expect(response.body.comments).toStrictEqual([]));
});

test(`API returns status code 404 when trying to change non-existent offer`, () => {
  const validOffer = Object.assign({}, mockNewOffer);
  const app = createAPI();

  return request(app)
    .put(`/offers/NO-EXIST`)
    .send(validOffer)
    .expect(HttpCode.NOT_FOUND);
});

test(`API return status code 400 when trying to change an offer with invalid data`, () => {
  const invalidOffer = Object.assign({}, mockNewOffer);
  delete invalidOffer.title;

  const app = createAPI();

  return request(app)
    .put(`/offers/LvViKa`)
    .send(invalidOffer)
    .expect(HttpCode.BAD_REQUEST);
});

describe(`API correctly deletes an offer`, () => {
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app).delete(`/offers/hhAuYj`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns deleted offer`, () => expect(response.body.id).toBe(`hhAuYj`));

  test(`Offers count is 4 now`, () => request(app)
    .get(`/offers`)
    .expect((res) => expect(res.body.length).toBe(4))
  );
});

test(`API refuses to delete non-existent offer`, () => {
  const app = createAPI();

  return request(app)
      .delete(`/offers/NO-EXIST`)
      .expect(HttpCode.NOT_FOUND);
});

describe(`API returns a list of comments to given offer`, () => {
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app).get(`/offers/LvViKa/comments`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Return a list of 3 comments`, () => expect(response.body.length).toBe(3));

  test(`First comment id equals "T1UHei"`, () => expect(response.body[0].id).toEqual(`T1UHei`));
});

describe(`API creates a comment if data is valid`, () => {
  const newComment = {text: `Возможна ли рассрочка?`};
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app).post(`/offers/LvViKa/comments`).send(newComment);
  });

  test(`Status code 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));

  test(`Returns comment created`, () => expect(response.body).toEqual(expect.objectContaining(newComment)));

  test(`Comments count is changed`, () => request(app).get(`/offers/LvViKa/comments`)
    .expect((res) => expect(res.body.length).toBe(4))
  );
});

test(`API refuses to create a comment when data is invalid, and returns status code 400`, () => {

  const app = createAPI();

  return request(app)
    .post(`/offers/LvViKa/comments`)
    .send({})
    .expect(HttpCode.BAD_REQUEST);
});

test(`API refuses to create a comment to non-existent offer and returns status code 404`, () => {
  const app = createAPI();

  return request(app)
    .post(`/offers/NO-EXIST/comments`)
    .send({text: `test comment`})
    .expect(HttpCode.NOT_FOUND);
});

describe(`API correctly deletes a comment`, () => {
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app).delete(`/offers/LvViKa/comments/T1UHei`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns deleted comment`, () => expect(response.body.id).toEqual(`T1UHei`));

  test(`Comments count is 2 now`, () => request(app)
    .get(`/offers/LvViKa/comments`)
    .expect((res) => expect(res.body.length).toBe(2))
  );
});

test(`API refuses to delete non-existent comment`, () => {
  const app = createAPI();

  return request(app)
      .delete(`/offers/LvViKa/comments/NO-EXIST`)
      .expect(HttpCode.NOT_FOUND);
});

test(`API refused to delete a comment to non-existent offer`, () => {
  const app = createAPI();

  return request(app)
    .delete(`/offers/NO-EXIST/comments/NO-EXIST/T1UHei`)
    .expect(HttpCode.NOT_FOUND);
});

