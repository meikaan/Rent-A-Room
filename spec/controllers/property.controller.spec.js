let PropertyController = require("../../controllers/property.controller");
let Property = require("../../models/property.model");
let _ = require("lodash");

let mongoose = require('mongoose');
let connection = mongoose.connect('mongodb://localhost/rentaroom_test');

describe("PropertyController", () => {
	afterEach(() => {
		console.log(mongoose.connection.dropDatabase());
	})
	// describe("Create", ()=> {
		it("should create property with all the fields", () => {
			let validData = {
				name: "Paradise",
				description: "Luxury hotel with swimming pools",
				price: 4000,
				latitude: 12334,
				longitude: 3444,
				address: "12, some street, city",
				rules: "Do this and don't do that",
				minimum_days: 2 
			};

			let propertyController = new PropertyController();
			
			let newProperty = {};
			
			return propertyController.create(validData).then(result => {
				return Property.findOne(validData).then(newProperty => {
					_.each(validData, (validValue, currentKey) => {
						// expect(!newProperty[currentKey]).toBeFalsy();
						expect(newProperty[currentKey]).toEqual(validValue);
					})
				}).catch(e => {
					console.log(e);
				});
			});

		})
	// })
})