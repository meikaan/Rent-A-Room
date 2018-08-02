var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	var Property = require("../models/property.model");
	Property.find({}).then(result => {
		console.log(result);
		res.render('index', { title: 'Rent-A-Room App' });
	});
	
});

module.exports = router;
