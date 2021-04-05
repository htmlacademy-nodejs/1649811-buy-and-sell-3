'use strict';

const {beforeAll, describe, test, expect} = require(`@jest/globals`);
const {Sequelize} = require(`sequelize`);
const defineRefreshToken = require(`../model/refresh-token`);
const RefreshTokenService = require(`../data-service/refresh-token`);
const jwt = require(`jsonwebtoken`);

const JWT_ACCESS_SECRET = `12345`;
const mockUser = {
  firstname: `Ivan`,
  lastname: `Ivanov`,
  email: `ivan@mail.com`,
  password: `ivanov`,
  repeat: `ivanov`,
  avatar: `avatar-01.jpg`,
};

const createService = async () => {
  const sequelize = new Sequelize(`sqlite::memory:`, {logging: false});
  const model = defineRefreshToken(sequelize);
  await sequelize.sync({force: true});
  return [new RefreshTokenService(sequelize), model];
};

describe(`RefreshTokenService`, () => {
  let service;
  let model;
  beforeAll(async () => {
    [service, model] = await createService();
  });

  test(`Test create, find, delete`, async () => {

    const token = jwt.sign(mockUser, JWT_ACCESS_SECRET);

    const isCreated = await service.create(token);
    expect(isCreated).toBe(true);

    const modelToken = await service.find(token);
    expect(modelToken).toBeInstanceOf(model);
    expect(modelToken.token).toEqual(token);

    const isDeleted = await service.drop(token);
    expect(isDeleted).toBe(true);
  });
});
