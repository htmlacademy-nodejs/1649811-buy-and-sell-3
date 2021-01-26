'use strict';

const express = require(`express`);
const request = require(`supertest`);
const {beforeAll, describe, test, expect} = require(`@jest/globals`);
const {Sequelize} = require(`sequelize`);

const offer = require(`./offer`);
const DataService = require(`../data-service/offer`);
const CommentService = require(`../data-service/comment`);
const initDb = require(`../lib/init-db`);

const {HttpCode} = require(`../../constants`);

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
const mockUsers = [
  `Иван Иванов ivan@mail.com ivanov`,
  `Светлана Светлакова svetlana@mail.com svetlakova`,
];
const mockComments = [
  `Оплата наличными или перевод на карту?`,
  `Почему в таком ужасном состоянии?`,
  `С чем связана продажа? Почему так дешёво?`
];

const mockNewOffer = {
  "title": `Продаю коня`,
  "description": `Конь в отличном состоянии, пробег 1000 км`,
  "picture": `1.jpg`,
  "type": `sale`,
  "sum": 1234,
  "categories": [1, 2],
  "userId": 1
};

const createAPI = async () => {
  const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});
  await initDb(mockDB, {
    categories: mockCategories,
    offers: mockOffers,
    users: mockUsers,
    comments: mockComments,
  });
  const app = express();
  app.use(express.json());

  offer(app, new DataService(mockDB), new CommentService(mockDB));

  return app;
};

describe(`API returns a list of all offers`, () => {
  let response;

  beforeAll(async () => {
    const app = await createAPI();
    response = await request(app).get(`/offers`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns a list of 3 offers`, () => expect(response.body.length).toBe(3));

  test(`First offer title equals "Куплю породистого кота."`, () => expect(response.body[0].title).toBe(`Куплю породистого кота.`));
});

describe(`API returns an offer with given id`, () => {
  let response;

  beforeAll(async () => {
    const app = await createAPI();
    response = await request(app).get(`/offers/2`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Offer title is "Люстры Италия, бронза."`, () =>
    expect(response.body.title).toBe(`Люстры Италия, бронза.`));
});

describe(`API created an offer if data is valid`, () => {
  const newOffer = Object.assign({}, mockNewOffer);
  let response;
  let app;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app).post(`/offers`).send(newOffer);
  });

  test(`Status code 201`, () =>
    expect(response.statusCode).toBe(HttpCode.CREATED));

  test(`Offers count is changed`, () => request(app).get(`/offers`)
    .expect((res) => expect(res.body.length).toBe(4)));

});

describe(`API refuses to create an offer if data is invalid`, () => {
  const newOffer = Object.assign({}, mockNewOffer);
  delete newOffer.userId;
  let app;

  beforeAll(async () => {
    app = await createAPI();
  });

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
  const newOffer = Object.assign({}, mockNewOffer, {comments: [3, 4]});

  let app;
  let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app).put(`/offers/3`).send(newOffer);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Offer is really changed`, () => request(app)
    .get(`/offers/3`)
    .expect((res) => expect(res.body.title).toBe(`Продаю коня`))
  );

});

test(`API returns status code 404 when trying to change non-existent offer`, async () => {
  const validOffer = Object.assign({}, mockNewOffer);
  const app = await createAPI();

  return request(app)
    .put(`/offers/100`)
    .send(validOffer)
    .expect(HttpCode.NOT_FOUND);

});

test(`API return status code 400 when trying to change an offer with invalid data`, async () => {
  const invalidOffer = Object.assign({}, mockNewOffer);
  delete invalidOffer.title;

  const app = await createAPI();

  return request(app)
    .put(`/offers/2`)
    .send(invalidOffer)
    .expect(HttpCode.BAD_REQUEST);
});

describe(`API correctly deletes an offer`, () => {
  let app;
  let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app).delete(`/offers/2`);
  });


  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns deleted status`, () => expect(response.body).toBe(true));

  test(`Offers count is 2 now`, () => request(app)
    .get(`/offers`)
    .expect((res) => expect(res.body.length).toBe(2))
  );
});

test(`API refuses to delete non-existent offer`, async () => {
  const app = await createAPI();

  return request(app)
    .delete(`/offers/100`)
    .expect(HttpCode.NOT_FOUND);
});

describe(`API returns a list of comments to given offer`, () => {
  let app;
  let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app).get(`/offers/3/comments`);
  });


  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Return a list of 3 comments`, () => expect(response.body.length).toBe(3));

  test(`First comment equals "Оплата наличными или перевод на карту?"`, () => expect(response.body[0].text).toEqual(`Оплата наличными или перевод на карту?`));
});

describe(`API creates a comment if data is valid`, () => {
  const newComment = {text: `Возможна ли рассрочка?`, userId: 1};
  let app;
  let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app).post(`/offers/3/comments`).send(newComment);
  });

  test(`Status code 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));

  test(`Comments count is changed`, () => request(app).get(`/offers/3/comments`)
    .expect((res) => expect(res.body.length).toBe(4))
  );
});

test(`API refuses to create a comment when data is invalid, and returns status code 400`, async () => {
  const app = await createAPI();

  return request(app)
    .post(`/offers/3/comments`)
    .send({})
    .expect(HttpCode.BAD_REQUEST);
});

test(`API refuses to create a comment to non-existent offer and returns status code 404`, async () => {
  const app = await createAPI();

  return request(app)
    .post(`/offers/100/comments`)
    .send({text: `test comment`})
    .expect(HttpCode.NOT_FOUND);
});

describe(`API correctly deletes a comment`, () => {
  let app;
  let response;
  let comments;
  let expectedCount = 0;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app).get(`/offers/1/comments`);
    comments = response.body;
    expectedCount = comments.length - 1;
    const {id} = comments[0];

    response = await request(app).delete(`/offers/1/comments/${id}`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns deleted status true`, () => expect(response.body).toEqual(true));

  test(`Comments count is ${expectedCount} now`, () => request(app)
    .get(`/offers/1/comments`)
    .expect((res) => expect(res.body.length).toBe(2))
  );
});

test(`API refuses to delete non-existent comment`, async () => {
  const app = await createAPI();

  return request(app)
    .delete(`/offers/1/comments/100`)
    .expect(HttpCode.NOT_FOUND);
});

test(`API refused to delete a comment to non-existent offer`, async () => {
  const app = await createAPI();

  return request(app)
    .delete(`/offers/100/comments/1`)
    .expect(HttpCode.NOT_FOUND);
});

test(`API return offers by category`, async () => {
  const app = await createAPI();

  return request(app).get(`/offers/category/1`).expect(HttpCode.OK);
});

