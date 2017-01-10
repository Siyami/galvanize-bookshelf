'use strict';

const boom = require('boom');
const bcrypt = require('bcrypt-as-promised');
const express = require('express');
const jwt = require('jsonwebtoken');
const knex = require('../knex');
const {
  camelizeKeys
} = require('humps');

const router = express.Router();

<<<<<<< HEAD
router.get('/token', (req, res) => {
  jwt.verify(req.cookies.token, process.env.JWT_SECRET, (err, claim) => {
    if (err) {
      return res.send(false);
    }
    res.send(true);
  });
});

router.post('/token', (req, res, next) => {
  let user;
=======
router.post('/token', (req, res, next) => {
>>>>>>> authentication

  const {
    email, password
  } = req.body;

  if (!email || !email.trim()) {
    return next(boom.create(400, 'Email must not be blank'));
  }

<<<<<<< HEAD
  if (!password || !email.trim()) {
    return next(boom.create(400, 'Password must not be blank'))
  }

=======
  if (!password || password.length < 8) {
    return next(boom.create(400, 'Password must not be blank'));
  }

  let user;

>>>>>>> authentication
  knex('users')
    .where('email', email)
    .first()
    .then((row) => {
      if (!row) {
        throw boom.create(400, 'Bad email or password');
      }

      user = camelizeKeys(row);

      return bcrypt.compare(password, user.hashedPassword);
    })
    .then(() => {
<<<<<<< HEAD
      const claim = {
        userId: user.id
      };
      const token = jwt.sign(claim, process.env.JWT_SECRET, {
        expiresIn: '7 days'
=======
      delete user.hashedPassword;

      const expiry = new Date(Date.now() + 1000 * 60 * 60 * 3); // 3 hours
      const token = jwt.sign({
        userId: user.id
      }, process.env.JWT_SECRET, {
        expiresIn: '3h'
>>>>>>> authentication
      });

      res.cookie('token', token, {
        httpOnly: true,
<<<<<<< HEAD
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 days lives
        secure: router.get('env') === 'production'
      });
      delete user.hashedPassword;
=======
        expires: expiry,
        secure: router.get('env') === 'production'
      });
>>>>>>> authentication

      res.send(user);
    })
    .catch(bcrypt.MISMATCH_ERROR, () => {
      throw boom.create(400, 'Bad email or password');
    })
    .catch((err) => {
      next(err);
    });
});

<<<<<<< HEAD
router.delete('/token', (req, res) => {
  res.clearCookie('token');
  res.end();
=======
router.delete('/token', (req, res, next) => {
  res.clearCookie('token');
  res.send(true);
>>>>>>> authentication
});

module.exports = router;


<<<<<<< HEAD
=======

>>>>>>> authentication
// 'use strict';
//
// const boom = require('boom');
// const bcrypt = require('bcrypt-as-promised');
// const express = require('express');
<<<<<<< HEAD
// const jwt = require('jsonwebtoken');
// const knex = require('../knex');
//
// const router = express.Router();
//
// router.get('/token', (req, res) => {
//   jwt.verify(req.cookies.token, process.env.JWT_KEY, (err, claim) => {
//     if (err) {
//       return res.send(false);
//     }
//
//     res.send(true);
//   });
// });
//
// router.post('/token', (req, res, next) => {
//   let user;
//
//   knex('users')
//     .where('email', req.body.email)
=======
// const knex = require('../knex');
// const {
//   camelizeKeys
// } = require('humps');
//
// // eslint-disable-next-line new-cap
// const router = express.Router();
//
// router.post('/token', (req, res, next) => {
//   let user;
//
//   const {
//     email, password
//   } = req.body;
//
//   knex('users')
//     .where('email', email)
>>>>>>> authentication
//     .first()
//     .then((row) => {
//       if (!row) {
//         throw boom.create(400, 'Bad email or password');
//       }
//
//       user = camelizeKeys(row);
//
<<<<<<< HEAD
//       return bcrypt.compare(req.body.password, user.hashedPassword);
//     })
//     .then(() => {
//       const claim = {
//         userId: user.id
//       };
//       const token = jwt.sign(claim, process.env.JWT_KEY, {
//         expiresIn: '7 days'
//       });
//
//       res.cookie('token', token, {
//         httpOnly: true,
//         expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 days, if you don't set expires after you log out
//         secure: router.get('env') === 'production'
//       });
//
//       delete user.hashedPassword;
//
=======
//       return bcrypt.compare(password, user.hashedPassword);
//     })
//     .then(() => {
//       delete user.hashedPassword;
//
//       res.set('Content-Type', 'application/json');
>>>>>>> authentication
//       res.send(user);
//     })
//     .catch(bcrypt.MISMATCH_ERROR, () => {
//       throw boom.create(400, 'Bad email or password');
//     })
//     .catch((err) => {
//       next(err);
//     });
// });
//
<<<<<<< HEAD
// router.delete('/token', (req, res) => {
//   res.clearCookie('token');
//   res.end();
// });
//
=======
>>>>>>> authentication
// module.exports = router;
