'use strict';

const boom = require('boom');
const express = require('express');
const jwt = require('jsonwebtoken');
const knex = require('../knex');
const {
  camelizeKeys
} = require('humps');

// eslint-disable-next-line new-cap
const router = express.Router();

const authorize = function(req, res, next) {
  jwt.verify(req.cookies.token, process.env.JWT_KEY, (err, payload) => {
    if (err) {
      return next(boom.create(401, 'Unaithorized'));
    }

    req.claim = payload;

    next();
  });
};

router.get('/favorites', authorize, (req, res, next) => {
  knex('favorites')
    .innerJoin('books', 'books.id', 'favorites.book_id')
    .where('favorites.user_id', req.claim.userId)
    .then((rows) => {
      const favorites = camelizeKeys(rows);

      res.send(favorites);
    })
    .catch((err) => {
      next(err);
    });
});

// router.get('/favorites:id', authorize, (req, res, next) => {
//   knex('favorites')
//     .innerJoin('books', 'books.id', 'favorites.book_id')
//     .where('favorites.user_id', req.params.id)
//     .then((row) => {
//       const favorite = camelizeKeys(row);
//
//       res.send(favorite);
//     })
//     .catch((err) => {
//       next(err);
//     });
// });

module.exports = router;
