'use strict';

const express = require(`express`);
const {HttpCode} = require(`../../constants`);

const {asyncWrapper} = require(`../../utils`);
const offerSchema = require(`../middleware/offer-schema`);
const commentSchema = require(`../middleware/comment-schema`);

const offerExist = require(`../middleware/offer-exists`);
const offerIdValidator = require(`../middleware/offer-id-validator`);
const offerValidator = require(`../middleware/validator-middleware`);
const commentValidator = require(`../middleware/validator-middleware`);


module.exports = (app, offerService, commentService) => {
  const route = new express.Router();

  route.get(`/`, asyncWrapper(async (req, res) => {
    const {offset, limit, comments} = req.query;
    let result;

    if (limit || offset) {
      result = await offerService.findPage({limit, offset});
    } else {
      result = await offerService.findAll(comments);
    }

    if (!result) {
      return res.status(HttpCode.NOT_FOUND).send(`Not found offers`);
    }

    return res.status(HttpCode.OK).json(result);
  }));

  route.get(`/category/:id`, asyncWrapper(async (req, res) => {
    const {id} = req.params;
    const {limit, offset} = req.query;
    const offers = await offerService.findAllByCategory(id, {limit, offset});

    if (!offers) {
      return res.status(HttpCode.NOT_FOUND).send(`Not found offers`);
    }

    return res.status(HttpCode.OK).json(offers);
  }));

  route.get(`/:offerId`, [offerIdValidator, offerExist(offerService)], asyncWrapper(async (req, res) => {

    const {offer} = res.locals;

    return res.status(HttpCode.OK).json(offer);
  }));

  route.post(`/`, offerValidator(offerSchema), asyncWrapper(async (req, res) => {
    const offer = await offerService.create(req.body);

    return res.status(HttpCode.CREATED).json(offer);
  }));

  route.put(`/:offerId`, [offerExist(offerService), offerValidator(offerSchema)], asyncWrapper(async (req, res) => {
    const {offerId} = req.params;

    const result = await offerService.update(offerId, req.body);

    return res.status(HttpCode.OK).json(result);
  }));

  route.delete(`/:offerId`, asyncWrapper(async (req, res) => {
    const {offerId} = req.params;
    const result = await offerService.drop(offerId);

    if (!result) {
      return res.status(HttpCode.NOT_FOUND)
        .send(`Not found offer with ${offerId} id`);
    }

    return res.status(HttpCode.OK).json(result);
  }));

  route.get(`/:offerId/comments`, offerExist(offerService), asyncWrapper(async (req, res) => {
    const {offer} = res.locals;
    const comments = await commentService.findAll(offer.id);

    return res.status(HttpCode.OK).json(comments);
  }));

  route.post(`/:offerId/comments`, [offerExist(offerService), commentValidator(commentSchema)], asyncWrapper(async (req, res) => {
    const {offer} = res.locals;
    const comment = await commentService.create(offer.id, req.body);

    return res.status(HttpCode.CREATED).json(comment);
  }));

  route.delete(`/:offerId/comments/:commentId`, offerExist(offerService), asyncWrapper(async (req, res) => {
    const {commentId} = req.params;
    const result = await commentService.drop(commentId);

    if (!result) {
      return res.status(HttpCode.NOT_FOUND).send(`Not found comment with ${commentId} id`);
    }
    return res.status(HttpCode.OK).json(result);
  }));

  app.use(`/offers`, route);
};
