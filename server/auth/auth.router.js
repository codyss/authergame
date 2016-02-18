'use strict';

var router = require('express').Router();

var HttpError = require('../utils/HttpError');
var User = require('../api/users/user.model');
var crypto = require('crypto');

var salt;
var hashedPW;






router.post('/login', function (req, res, next) {
	User.findOne({email: req.body.email}).exec()
	.then(user=> {
		console.log(req.body)
		console.log(user)
		var saltToUse = user.salt
		var newHashed = crypto.pbkdf2Sync(req.body.password, saltToUse, 100, 512, 'sha512').toString('hex')
		if(newHashed === user.password) {
			req.login(user, function () {
				res.json(user);
			});
		} else {
			throw HttpError(401)
		}
	})
	.then(null, next);
});

router.post('/signup', function (req, res, next) {
	salt = crypto.randomBytes(256).toString('hex')
	hashedPW = crypto.pbkdf2Sync(req.body.password, salt, 100, 512, 'sha512').toString('hex')
	var userToCreate = {
		salt: salt,
		password: hashedPW,
		email: req.body.email
	};
	User.create(userToCreate)
	.then(function (user) {
		req.login(user, function () {
			res.status(201).json(user);
		});
	})
	.then(null, next);
});

router.get('/me', function (req, res, next) {
	res.json(req.user);
	console.log(req.user);
});

router.delete('/me', function (req, res, next) {
	req.logout();
	res.status(204).end();
});

router.use('/google', require('./google.oauth'));

router.use('/twitter', require('./twitter.oauth'));

router.use('/github', require('./github.oauth'));

module.exports = router;