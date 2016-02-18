'use strict';

var express = require('express'),
	router = express.Router(),
	path = require('path');

var rootPath = path.join(__dirname, '..', '..');

var publicPath = path.join(rootPath, 'public');


router.use(express.static(publicPath));

// router.use(express.static(rootPath));
var publicPath = path.join(rootPath, 'public');
var publicPath2 = path.join(rootPath, 'node_modules');
var publicPath3 = path.join(rootPath, 'browser');
var publicPath4 = path.join(rootPath, 'bower_components');

router.use(express.static(publicPath));
router.use("/public",express.static(publicPath));
router.use("/node_modules",express.static(publicPath2));
router.use("/browser",express.static(publicPath3));
router.use("/bower_components",express.static(publicPath4));

module.exports = router;