'use strict';

const express = require(`express`);
const {HttpCode} = require(`../../constants`);
const offerValidator = require(`../middleware/offer-validator`);
const offerExist = require(`../middleware/offer-exists`);
const commentValidator = require(`../middleware/comment-validator`);

module.exports = (app, offerService, commentService) => {
  const route = new express.Router();

  route.get(`/`, async (req, res) => {
    const {comments} = req.query;
    const offers = await offerService.findAll(comments);

    if (!offers) {
      return res.status(HttpCode.NOT_FOUND).send(`Not found offers`);
    }

    return res.status(HttpCode.OK).json(offers);
  });

  route.get(`/:offerId`, async (req, res) => {
    const {offerId} = req.params;
    const {comments} = req.query;

    const offer = await offerService.findOne(offerId, comments);

    if (!offer) {
      return res.status(HttpCode.NOT_FOUND)
        .send(`Not found with ${offerId}`);
    }

    return res.status(HttpCode.OK).json(offer);
  });

  route.post(`/`, offerValidator, async (req, res) => {
    const offer = await offerService.create(req.body);

    return res.status(HttpCode.CREATED).json(offer);
  });

  route.put(`/:offerId`, offerValidator, async (req, res) => {
    const {offerId} = req.params;
    const offer = await offerService.findOne(offerId);

    if (!offer) {
      return res.status(HttpCode.NOT_FOUND)
        .send(`Not found offer with ${offerId} id`);
    }

    const result = await offerService.update(offerId, req.body);

    return res.status(HttpCode.OK).json(result);
  });

  route.delete(`/:offerId`, async (req, res) => {
    const {offerId} = req.params;
    const result = await offerService.drop(offerId);

    if (!result) {
      return res.status(HttpCode.NOT_FOUND)
        .send(`Not found offer with ${offerId} id`);
    }

    return res.status(HttpCode.OK).json(result);
  });

  route.get(`/:offerId/comments`, offerExist(offerService), async (req, res) => {
    const {offer} = res.locals;
    const comments = await commentService.findAll(offer.id);

    return res.status(HttpCode.OK).json(comments);
  });

  route.post(`/:offerId/comments`, [offerExist(offerService), commentValidator], async (req, res) => {
    const {offer} = res.locals;
    const comment = await commentService.create(offer.id, req.body);

    return res.status(HttpCode.CREATED).json(comment);
  });

  route.delete(`/:offerId/comments/:commentId`, offerExist(offerService), async (req, res) => {
    const {commentId} = req.params;
    const result = await commentService.drop(commentId);

    if (!result) {
      return res.status(HttpCode.NOT_FOUND).send(`Not found comment with ${commentId} id`);
    }
    return res.status(HttpCode.OK).json(result);
  });

  app.use(`/offers`, route);
};
