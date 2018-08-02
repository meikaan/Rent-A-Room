const express = require('express');
const router = express.Router();

const properties_controller = require('../controllers/properties.controller');

router.post('/create', properties_controller.property_create);
router.get('/:id', properties_controller.property_details);
router.put('/update/:id', properties_controller.property_update);
router.delete('/delete/:id', properties_controller.property_delete);
router.get('/', properties_controller.properties)

module.exports = router;