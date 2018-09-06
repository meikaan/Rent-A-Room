'use strict';

const Property = require('../models/property.model');

module.exports = class PropertyController {

    create(req, res) {
        return Property.create(req.body)
            .then(result => res.send(result));
    }

    index(req, res) {
        return Property.find({})
            .then(result => res.send(result));
    }

    read(req, res) {
        return Property.findById(req.params.id)
            .then(result => res.send(result));
    }

    delete(req, res) {
        return Property.findByIdAndRemove(req.params.id)
            .then(result => res.send(result));
    }

    _update(id, data) {
        return Property.findByIdAndUpdate(id, {$set: data})
            .then(result => {
                    return Property.findById(id).then(property => {
                        return property;
                    })
                })
    }

    update(req, res) {
        this._update(req.params.id, req.body).then(updatedProperty => {
            res.send(updatedProperty);
        });
    }

}

