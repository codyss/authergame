'use strict';

var router = require('express').Router(),
	_ = require('lodash');

var HttpError = require('../../utils/HttpError');
var User = require('./user.model');

router.param('id', function (req, res, next, id) {
	User.findOne({_id: id}, '_id name phone email isAdmin photo stories').exec()
	.then(function (user) {
		if (!user) throw HttpError(404);
		req.requestedUser = user;
		next();
	})
	.then(null, next);
});

router.get('/', function (req, res, next) {
	if(req.user) {
		User.find({}, '_id name phone email isAdmin photo').exec()
		.then(function (users) {
			res.json(users);
			console.log('user: ', req.user)
		})
		.then(null, next);
	} else {
		res.sendStatus(403)
	}
});

router.post('/', function (req, res, next) {
	if(req.user.isAdmin) {
		User.create(req.body)
		.then(function (user) {
			res.status(201).json(user);
		})
		.then(null, next);
	} 
	else {
		res.sendStatus(403);
	}
});

router.get('/:id', function (req, res, next) {
	if(req.user) {
		req.requestedUser.getStories()
		.then(function (stories) {
			var obj = req.requestedUser.toObject();
			obj.stories = stories;
			res.json(obj);
		})
		.then(null, next);
	} else {
		res.sendStatus(403)
	}
});

router.put('/:id', function (req, res, next) {
	if(req.user.isAdmin) {
		_.extend(req.requestedUser, req.body);
		req.requestedUser.save()
		.then(function (user) {
			res.json(user);
		})
		.then(null, next);
	} else {
		res.sendStatus(403);
	}
});

router.delete('/:id', function (req, res, next) {
	if(req.user.isAdmin) {
		req.requestedUser.remove()
		.then(function () {
			res.status(204).end();
		})
		.then(null, next);
	} else {
		res.sendStatus(403)
	}
});

module.exports = router;