// 'use strict';
//
// const bcrypt = require('bcrypt-as-promised');
// const express = require('express');
// const knex = require('../knex');
// const {
//   camelizeKeys
// } = require('humps');
//
// const router = express.Router();
//
// router.post('/users', (req, res, next) => {
//   bcrypt.hash(req.body.password, 12)
//     .then((hashed_password) => {
//       return knex('users')
//         .insert({
//           first_name: req.body.firstName,
//           last_name: req.body.lastName,
//           email: req.body.email,
//           hashed_password: hashed_password
//         }, '*');
//     })
//     .then((users) => {
//       const user = users[0];
//
//       delete user.hashed_password;
//
//       res.set('Content-Type', 'application/json');
//       res.send(camelizeKeys(user));
//     })
//     .catch((err) => {
//       next(err);
//     });
// });
//
// module.exports = router;


//RYAN'S SOLUTION


'use strict';

const bcrypt = require('bcrypt-as-promised');
const boom = require('boom');
const express = require('express');
const jwt = require('jsonwebtoken');
const knex = require('../knex');
const {
  camelizeKeys, decamelizeKeys
} = require('humps');

// eslint-disable-next-line new-cap
const router = express.Router();

router.post('/users', (req, res, next) => {
  const {
    email, password
  } = req.body;

  if (!email || !email.trim()) {
    return next(boom.create(400, 'Email must not be blank'));
  }

  if (!password || password.length < 8) {
    return next(boom.create(
      400,
      'Password must be at least 8 characters long'
    ));
  }

  knex('users')
    .where('email', email)
    .first()
    .then((user) => {
      if (user) {
        throw boom.create(400, 'Email already exists');
      }

      return bcrypt.hash(password, 12);
    })
    .then((hashedPassword) => {
      const {
        firstName, lastName
      } = req.body;
      const insertUser = {
        firstName, lastName, email, hashedPassword
      };

      return knex('users').insert(decamelizeKeys(insertUser), '*');
    })
    .then((rows) => {
      const user = camelizeKeys(rows[0]);

      const claim = {
        userId: user.id
      };
      const token = jwt.sign(claim, process.env.JWT_KEY, {
        expiresIn: '7 days' // Adds an expiration field to the payload
      });

      res.cookie('token', token, { // cookie is at the header
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // lives 7 days, if you don't include expires after you log out
        secure: router.get('env') === 'production' //forces the token only be sent as https
      });

      delete user.hashedPassword;

      res.send(user);
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;


// RYAN'S SOLUTION

// 'use strict';
//
// const bcrypt = require('bcrypt-as-promised');
// const boom = require('boom');
// const express = require('express');
// const jwt = require('jsonwebtoken');
// const knex = require('../knex');
// const { camelizeKeys, decamelizeKeys } = require('humps');
//
// // eslint-disable-next-line new-cap
// const router = express.Router();
//
// router.post('/users', (req, res, next) => {
//   const { email, password } = req.body;
//
//   if (!email || !email.trim()) {
//     return next(boom.create(400, 'Email must not be blank'));
//   }
//
//   if (!password || password.length < 8) {
//     return next(boom.create(
//       400,
//       'Password must be at least 8 characters long'
//     ));
//   }
//
//   knex('users')
//     .where('email', email)
//     .first()
//     .then((user) => {
//       if (user) {
//         throw boom.create(400, 'Email already exists');
//       }
//
//       return bcrypt.hash(password, 12);
//     })
//     .then((hashedPassword) => {
//       const { firstName, lastName } = req.body;
//       const insertUser = { firstName, lastName, email, hashedPassword };
//
//       return knex('users').insert(decamelizeKeys(insertUser), '*');
//     })
//     .then((rows) => {
//       const user = camelizeKeys(rows[0]);
//
//       delete user.hashedPassword;
//
//       res.send(user);
//     })
//     .catch((err) => {
//       next(err);
//     });
// });
//
// module.exports = router;
