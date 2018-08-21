'use strict';

const Property = require('../models/property.model');

module.exports = class PropertyController {

    create(req, res) {
        return Property.create(req.body).then(result => res.send(result));
    }

    index(req, res) {
        return Property.find({})
            .then(result => {
                res.send(result);
            });
    }

    read(req, res) {
        return Property.findById(req.params.id)
            .then(result => res.send(result));
    }

    delete(req, res) {
        return Property.findByIdAndRemove(req.params.id)
            .then(result => res.send(result));
    }

    update(req, res) {
        //TODO: Figure out how to send the updated result in the promise resolution
        return Property.findByIdAndUpdate({_id: req.params.id}, {$set: req.body})
            .then(result => res.send(result));
    }
}


