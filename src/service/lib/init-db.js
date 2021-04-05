'use strict';

const bcrypt = require(`bcrypt`);
const defineModels = require(`../model/define-models`);
const {shuffle, getRandomInt, getCreatedDate} = require(`../utils`);
const {SALT_ROUNDS} = require(`../const`);

const MAX_COMMENTS = 5;

module.exports = async (sequelize, {categories, offers, users, comments}, isRandom = false) => {

  const {Category, Offer, User, Comment} = defineModels(sequelize);

  await sequelize.sync({force: true});

  const categoryModels = await Category.bulkCreate(
      categories.map((item) => ({title: item}))
  );

  const salt = await bcrypt.genSalt(SALT_ROUNDS);

  const userModels = await User.bulkCreate(
      await Promise.all(users.map(async (item, index) => {
        const [firstname, lastname, email, pass] = item.split(` `);
        const crPass = await bcrypt.hash(pass, salt);
        return {
          firstname,
          lastname,
          email,
          password: crPass,
          avatar: `avatar0${index + 1}.jpg`,
        };
      }))
  );

  const offerPromises = offers.map(async (offer) => {
    const offerCategories = isRandom
      ? shuffle([...categoryModels]).slice(0, getRandomInt(1, categoryModels.length))
      : categoryModels;

    const offerUser = userModels[getRandomInt(0, userModels.length - 1)];

    const offerModel = await Offer.create(offer);
    await offerModel.setUser(offerUser);
    await offerModel.addCategories(offerCategories);


    const offerComments = isRandom
      ? Array.from({length: getRandomInt(2, MAX_COMMENTS)}, () => (
        shuffle(comments).slice(0, getRandomInt(1, 3)).join(` `)))
      : comments;

    const offerCommentsPromises = offerComments.map(async (comment) => {
      const commentUser = userModels[getRandomInt(0, userModels.length - 1)];

      const commentModel = await Comment.create({
        text: comment,
        createdAt: getCreatedDate(-2),
      });
      await commentModel.setUser(commentUser);
      await commentModel.setOffer(offerModel);
    });

    await Promise.all(offerCommentsPromises);
  });

  await Promise.all(offerPromises);
};
