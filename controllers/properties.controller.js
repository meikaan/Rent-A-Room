'use strict';

const Property = require('../models/property.model');

module.exports = class PropertyController {

    create(params) {
        let property = params.body;
		return Property.create(property);
	}

    index(params) {
        let properties = Property.find({});
        return properties;
    }

    read(params) {
        let property = Property.findById(params.id);
        return property;
    }

    delete(params) {
        let property = Property.findByIdAndRemove(params.id);
        return property;
    }

    update(params) {
        let property = Property.findByIdAndUpdate(params.id, {$set: params.body});
        return property;
    }
}


