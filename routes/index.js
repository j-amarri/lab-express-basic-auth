const { Router } = require('express');
const router = Router();
const bcrypt = require('bcrypt');
const User = require('./../models/user');
const routeAuthenticationGuard = require('./../middleware/route-authentication-guard');

router.get('/', (req, res) => {
  res.render('index');
});

router.get('/sign-up', (req, res) => {
  res.render('sign-up');
});

router.post('/sign-up', (req, res, next) => {
  const { username, password } = req.body;
  if (password.length === 0) {
    const error = new Error('Password not defined.');
    next(error);
  }
  bcrypt
    .hash(password, 10)
    .then(hashAndSalt => {
      return User.create({
        username,
        passwordHashAndSalt: hashAndSalt
      });
    })
    .then(user => {
      res.redirect('/');
    })
    .catch(error => {
      next(error);
    });
});

router.get('/sign-in', (req, res) => {
  res.render('sign-in');
});

router.post('/sign-in', (req, res, next) => {
  const { email, password } = req.body;
  let user;
  User.findOne({ email })
    .then(document => {
      user = document;
      const passwordHashAndSalt = user.passwordHashAndSalt;
      return bcrypt.compare(password, passwordHashAndSalt);
    })
    .then(comparison => {
      if (comparison) {
        req.session.userId = user._id;
        res.redirect('/private');
      }
    })
    .catch(error => {
      next(error);
    });
});

router.get('/private', routeAuthenticationGuard, (req, res) => {
  res.render('private');
});

module.exports = router;
