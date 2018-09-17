const express = require('express');
const router = express.Router();

const Property = require('../models/property.model');
const PropertiesController = require('../controllers/properties.controller');
let propertyController = new PropertiesController(Property);

router.post('/', (...args) => propertyController.create(...args));
router.get('/:id', (...args) => propertyController.read(...args));
router.put('/:id', (...args) => propertyController.update(...args));
router.delete('/:id', (...args) => propertyController.delete(...args));
router.get('/', (...args) => propertyController.all(...args));

module.exports = router;