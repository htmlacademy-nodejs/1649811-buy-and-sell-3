'use strict';

const express = require(`express`);
const request = require(`supertest`);
const {beforeAll, describe, test, expect} = require(`@jest/globals`);
const {Sequelize} = require(`sequelize`);
const user = require(`./user`);
const DataService = require(`../data-service/user`);
const RefreshTokenService = require(`../data-service/refresh-token`);
const initDb = require(`../lib/init-db`);
const {HttpCode} = require(`../const`);


const mockUser = {
  firstname: `Ivan`,
  lastname: `Ivanov`,
  email: `ivan@mail.com`,
  password: `ivanov`,
  repeat: `ivanov`,
  avatar: `avatar-01.jpg`,
};

const createAPI = async () => {
  const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});
  await initDb(mockDB, {
    categories: [],
    offers: [],
    users: [],
    comments: [],
  });
  const app = express();
  app.use(express.json());

  user(app, new DataService(mockDB), new RefreshTokenService(mockDB));

  return app;
};

test(`Should return status code 201`, async () => {
  const app = await createAPI();
  const response = await request(app).post(`/user`).send(mockUser);
  return expect(response.statusCode).toBe(HttpCode.CREATED);
});

describe(`API refuses to create an user if data is invalid`, () => {
  const newUser = Object.assign({}, mockUser);
  let app;

  beforeAll(async () => {
    app = await createAPI();
  });

  test(`Without any required property response code is 400 & message is required`, async () => {


    for (const key of Object.keys(newUser)) {
      const badUser = {...newUser};
      delete badUser[key];

      const response = await request(app).post(`/user`).send(badUser);

      expect(response.statusCode).toBe(400);
      const {message} = JSON.parse(response.text);

      if (key === `password`) {
        expect(message.join(`. `)).toBe(`"${key}" is required. "repeat" must be [ref:password]`);
        continue;
      }

      expect(message.join(`. `)).toBe(`"${key}" is required`);
    }
  });
});

describe(`API refuses to create an user if user exist`, () => {
  const newUser = Object.assign({}, mockUser);
  let app;
  let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app).post(`/user`).send(newUser);
  });

  test(`400`, async () => {
    response = await request(app).post(`/user`).send(newUser);
    return expect(response.statusCode).toBe(400);
  });
});

describe(`Login`, () => {
  const newUser = Object.assign({}, mockUser);
  let app;
  let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app).post(`/user`).send(newUser);
  });

  test(`Should return accessToken & refreshToken`, async () => {
    response = await request(app).post(`/login`).send({
      email: mockUser.email,
      password: mockUser.password,
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty(`accessToken`);
    expect(response.body).toHaveProperty(`refreshToken`);
  });

  test(`Should return User with email bad@mail.com not found`, async () => {
    response = await request(app).post(`/login`).send({
      email: `bad@mail.com`,
      password: mockUser.password,
    });

    expect(response.statusCode).toBe(404);
    expect(response.body).toStrictEqual({"message": [`User with email bad@mail.com not found`]});
  });

  test(`Should return Wrong password`, async () => {
    response = await request(app).post(`/login`).send({
      email: mockUser.email,
      password: `1234567890`,
    });

    expect(response.statusCode).toBe(401);
    expect(response.body).toStrictEqual({"message": [`Wrong password`]});
  });
});

describe(`Logout`, () => {
  const newUser = Object.assign({}, mockUser);
  let app;
  let response;

  beforeAll(async () => {
    app = await createAPI();
    await request(app).post(`/user`).send(newUser);
  });

  test(`Should return 200`, async () => {
    response = await request(app).post(`/login`).send({
      email: mockUser.email,
      password: mockUser.password,
    });

    const {accessToken, refreshToken} = response.body;

    response = await request(app)
      .delete(`/logout`).send(refreshToken)
      .set(`Authorization`, `Bearer: ${accessToken}`);


    expect(response.statusCode).toBe(200);
  });
});
