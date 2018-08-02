const Property = require('../models/property.model');

//module.exports = class PropertyController {

	//create(params) {
		//return Property.create(params);
		// return Promise.resolve();
	//}
//}


exports.property_create = function (req, res) {
    let property = new Property(
        {
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            address: req.body.address,
            latitude: req.body.latitude,
            longitude: req.body.longitude,
            rules: req.body.rules,
            minimum_days: req.body.minimum_days,
        }
    );

    property.save(function (err) {
        if (err) {
            return next(err);
        }
        res.send('Property Created successfully')
    })
};

exports.property_details = function (req, res) {
    Property.findById(req.params.id, function (err, property) {
        if (err) return next(err);
        res.send(property);
    })
};

exports.property_update = function (req, res) {
    Property.findByIdAndUpdate(req.params.id, {$set: req.body}, function (err, property) {
        if (err) return next(err);
        res.send('Property udpated.');
    });
};

exports.property_delete = function (req, res) {
    Property.findByIdAndRemove(req.params.id, function (err) {
        if (err) return next(err);
        res.send('Deleted successfully!');
    })
};

exports.properties = function (req, res) {
    Property.find(req.params, function (err, property) {
        if (err) return next(err);
        res.send(property);
    })
};

