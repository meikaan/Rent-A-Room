const express = require('express');
const router = express.Router();

const PropertiesController = require('../controllers/properties.controller');

let propertyController = new PropertiesController();

router.post('/', propertyController.create);
router.get('/:id', propertyController.read);
router.put('/:id', propertyController.update);
router.delete('/:id', propertyController.delete);
router.get('/', propertyController.index);

module.exports = router;