const Property = require('../models/property.model');

module.exports = class PropertyController {

	create(params) {
        let data = params.body;
		return Property.create(data);
	}


}

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

