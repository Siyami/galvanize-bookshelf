'use strict';

const bcrypt = require('bcrypt-as-promised');
const express = require('express');
const knex = require('../knex');
const {
  camelizeKeys
} = require('humps');

const router = express.Router();

router.post('/users', (req, res, next) => {
  bcrypt.hash(req.body.password, 12)
    .then((hashed_password) => {
      return knex('users')
        .insert({
          first_name: req.body.firstName,
          last_name: req.body.lastName,
          email: req.body.email,
          hashed_password: hashed_password
        }, '*');
    })
    .then((users) => {
      const user = users[0];

      delete user.hashed_password;

      res.set('Content-Type', 'application/json');
      res.send(camelizeKeys(user));
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;
