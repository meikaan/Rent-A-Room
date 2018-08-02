const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let PropertySchema = new Schema({
    name: {type: String},
    description: {type: String},
    price: {type: Number},
    address: {type: String},
    latitude: {type: Number},
    longitude: {type: Number},
    rules: {type: String},
    minimum_days: {type: Number}  
});


module.exports = mongoose.model('Property', PropertySchema);