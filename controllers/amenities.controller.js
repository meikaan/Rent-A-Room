'use strict';

const Amenity = require('../models/amenity.model');

module.exports = class AmenityController {

    create(req, res) {
        return Amenity.create(req.body)
            .then(result => res.send(result));
    }

    index(req, res) {
        return Amenity.find({})
            .then(result => res.send(result));
    }

    read(req, res) {
        //console.log(req);
        return Amenity.findById(req.params.id)
            .then(result => {res.send(result)});
    }

    delete(req, res) {
        return Amenity.findByIdAndRemove(req.params.id)
            .then(result => res.send(result));
    }

    _update(id, data) {
        return Amenity.findByIdAndUpdate(id, {$set: data})
            .then(result => {
                    return Amenity.findById(id).then(amenity => {
                        return amenity;
                    })
                })
    }

    update(req, res) {
        this._update(req.params.id, req.body).then(updatedAmenity => {
            res.send(updatedAmenity);
        });
    }

}