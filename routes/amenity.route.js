const express = require('express');
const router = express.Router();

const Amenity = require('../models/amenity.model');
const AmenitiesController = require('../controllers/amenities.controller');
let amenityController = new AmenitiesController(Amenity);

router.post('/', (...args) => amenityController.create(...args));
router.get('/:id', (...args) => amenityController.read(...args));
router.put('/:id', (...args) => amenityController.update(...args));
router.delete('/:id', (...args) => amenityController.delete(...args));
router.get('/', (...args) => amenityController.all(...args));

module.exports = router;