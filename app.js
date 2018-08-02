
var express = require('express');
var bodyParser = require('body-parser');

const property = require('./routes/property.route');
var app = express();

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/rentaroom');

mongoose.Promise = global.Promise;

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use('/properties', property);

var port = 3000;

app.listen(port, () => {
    console.log('Server is up and running on port number ' + port);
});

//app.get('/', function(req, res, next) {
	//var Property = require("./models/property.model");
	//console.log(Property);
	//Property.find({}).then(result => {
		//console.log(result);
		//res.send(result);
	//});
	// res.send({ title: 'Rent-A-Room App' });
//});
