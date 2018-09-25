'use strict';

let _ = require("lodash");
let mongoose = require('mongoose');

let connection = mongoose.connect('mongodb://localhost/rentaroom_test');
const Schema = mongoose.Schema;

let SpecialPriceSchema = new Schema({
    price: {
    	type: Number, 
    	required: true, 
    	min: 100,
    	max: 5000,
    	//Todo
    	//validate: {validator: Number.isInteger, message: '{VALUE} is not an integer'}
    },
    startDate: {
    	type: Date, 
    	required: true 
    },
    endDate: {
    	type: Date, 
    	required: true, 
    	validate: [dateValidator, 'startDate must be less than endDate']
    }  
});

const SpecialPrice = mongoose.model('SpecialPrice', SpecialPriceSchema);

// function that validate the startDate and endDate
function dateValidator(endDate){
	// `this` is the mongoose document
	return this.startDate < endDate;
}

class SpecialPricesController{
	
	create(req, res) {
        return SpecialPrice.create(req.body)
            .then(result => res.send(result));
    }

    _update(id, data) {
        return SpecialPrice.findByIdAndUpdate(id, {$set: data}, {runValidators: true})
        	.then(result => { return SpecialPrice.findById(id)
        		.then(object => { return object; }); 
        	});
    }

    update(req, res) {
        return this._update(req.params.id, req.body)
        .then(updatedObject => { res.send(updatedObject); });
    }

}

describe('SpecialPricesController', () => {
    
    let res = { send: function() {}};
	beforeEach(() => {
		spyOn(res, 'send');
		return mongoose.connection.dropDatabase();
	});
    
    describe('Create', () => {
		
		it('should create record with all the fields', () => {
			
			let data = {
				price: 1500,
				startDate: new Date("2018-10-27"),
				endDate: new Date("2018-10-30")
			};
			let specialPricesController = new SpecialPricesController();
			let newSpecialPrice = {};
			return specialPricesController.create({ body: data }, res).then(result => {
				expect(res.send).toHaveBeenCalledTimes(1);
				return SpecialPrice.findOne(data).then(newSpecialPrice => {
					_.each(data, (value, key) => {
						expect(newSpecialPrice[key]).toEqual(value);
					});
				});
			});
		});

		it('should not create record if any field is missing', () => {
			
			let data = {
				price: 1500,
				startDate: "2018-10-27",
				endDate: "2018-10-30"
			};

			let fields = ["price", "startDate", "endDate"];
            let invalidData = Object.assign({}, data);
            let specialPricesController = new SpecialPricesController();

			_.each(fields, (field, index) => {
				delete invalidData[field];
				return specialPricesController.create({ body: invalidData }, res).then(result => {
				    fail("create shouldn't pass");}).catch(e => {
					expect(e.name).toEqual("ValidationError"); 
					expect(e.errors[field].message).toEqual(`Path \`${field}\` is required.`);
				});
			});
		});

		it('should not create record if price is greater than specified limit', () => {

			let data = {
				price: 6000,
				startDate: "2018-10-27",
				endDate: "2018-10-30"
			};

			let specialPricesController = new SpecialPricesController();

			return specialPricesController.create({body: data}, res).then(result => {
				fail("create shouldn't pass");}).catch(e => {
					expect(e.name).toEqual("ValidationError"); 
					expect(e.errors["price"].message).toEqual(`Path \`price\` (${data["price"]}) is more than maximum allowed value (5000).`); 
			});
		});

		//revisit this one
		it('should create record if price is numerical', () => {

			let data = {
				price: 1500,
				startDate: "2018-10-27",
				endDate: "2018-10-30"
			};

			let specialPricesController = new SpecialPricesController();

			return specialPricesController.create({body: data}, res).then(result => {
				return SpecialPrice.findOne(data).then(newSpecialPrice => {
					expect(typeof newSpecialPrice["price"]).toBe('number');
				});
			});
		});

		it('should create record if startDate is less than endDate', () => {

			let data = {
				price: 1500,
				startDate: "2018-10-27",
				endDate: "2018-10-30"
			};

			let specialPricesController = new SpecialPricesController();

			return specialPricesController.create({body: data}, res).then(result => {
				return SpecialPrice.findOne(data).then(newSpecialPrice => {
					expect(newSpecialPrice["startDate"]).toBeLessThan(newSpecialPrice["endDate"]);
				});
			});
		});

		it('should not create record if price is not numerical', () => {
			
			let data = {
				price: "xyz",
				startDate: "2018-10-27",
				endDate: "2018-10-30"
			};

			let specialPricesController = new SpecialPricesController();
			
			return specialPricesController.create({body: data}, res).then(result => {
				fail("create shouldn't pass");}).catch(e => { 
					expect(e.name).toEqual("ValidationError"); 
					expect(e.errors["price"].message).toEqual(`Cast to Number failed for value "${data["price"]}" at path "price"`);
			});
		
		});

		it('should not create record if price is less than specified limit', () => {
			
			let data = {
				price: 0,
				startDate: "2018-10-27",
				endDate: "2018-10-30"
			};

			let specialPricesController = new SpecialPricesController();
			
			return specialPricesController.create({body: data}, res).then(result => {
				fail("create shouldn't pass");}).catch(e => { 
					expect(e.name).toEqual("ValidationError"); 
					expect(e.errors["price"].message).toEqual(`Path \`price\` (${data["price"]}) is less than minimum allowed value (100).`); 

			});
		});
		
		it('should not create record if startDate is greater than or equal to endDate', () => {
			
			let data = {
				price: 1500,
				startDate: "2018-10-30",
				endDate: "2018-10-27"
			};

			let specialPricesController = new SpecialPricesController();
			
			return specialPricesController.create({body: data}, res).then(result => {
				fail("create shouldn't pass");}).catch(e => { 
					expect(e.name).toEqual("ValidationError"); 
					expect(e.errors["endDate"].message).toEqual('startDate must be less than endDate');
			});
		});

		it('should not create record if startDate and endDate is invalid', () => {

			let data = {
				price: 1500,
				startDate: "xyz",
				endDate: "xyz"
			};

			let specialPricesController = new SpecialPricesController();
			
			return specialPricesController.create({body: data}, res).then(result => {
				fail("create shouldn't pass");}).catch(e => {
					expect(e.name).toEqual("ValidationError"); 
					expect(e.errors["startDate"].message).toEqual(`Cast to Date failed for value "${data["startDate"]}" at path "startDate"`);
					expect(e.errors["endDate"].message).toEqual(`Cast to Date failed for value "${data["endDate"]}" at path "endDate"`);
			});
		});
	});
	
	describe('Update', () => {

		it('should find record by id and update the record', () => {

			let data = {
				price: 1500,
				startDate: "2018-10-27",
				endDate: "2018-10-30"
			};

			let specialPricesController = new SpecialPricesController();

			return SpecialPrice.create(data).then(newSpecialPrice => {
				return specialPricesController.update({params:{id: newSpecialPrice.id}, body: {price: 2000}}, res).then(_ => {
					SpecialPrice.findById(newSpecialPrice.id).then(updatedSpecialPrice => {
						expect(updatedSpecialPrice.price).toEqual(2000);
					});
				});
			});
		});

		it('should not update record if fields are empty', () => {

			let data = {
				price: 1500,
				startDate: "2018-10-27",
				endDate: "2018-10-30"
			};

			let specialPricesController = new SpecialPricesController();

			return SpecialPrice.create(data).then(newSpecialPrice => {
				return specialPricesController.update({params:{id: newSpecialPrice.id}, body: {price: ''}}, res).catch(e => {
					expect(e.name).toEqual("ValidationError");
					expect(e.errors["price"].message).toEqual("Path \`price\` is required.")
				});
			});
		});

		it('should not update record if price is less than specified limit', () => {

			let data = {
				price: 1500,
				startDate: "2018-10-27",
				endDate: "2018-10-30"
			};

			let specialPricesController = new SpecialPricesController();

			return SpecialPrice.create(data).then(newSpecialPrice => {
				return specialPricesController.update({params:{id: newSpecialPrice.id}, body: {price: 50}}, res).catch(e => {
					expect(e.name).toEqual("ValidationError");
					expect(e.errors["price"].message).toEqual(`Path \`price\` (${e.errors["price"].value}) is less than minimum allowed value (100).`);
				});
			});
		});

		it('should not update record if price is greater than specified limit', () => {

			let data = {
				price: 1500,
				startDate: "2018-10-27",
				endDate: "2018-10-30"
			};

			let specialPricesController = new SpecialPricesController();

			return SpecialPrice.create(data).then(newSpecialPrice => {
				return specialPricesController.update({params:{id: newSpecialPrice.id}, body: {price: 6000}}, res).catch(e => {
					expect(e.name).toEqual("ValidationError");
					expect(e.errors["price"].message).toEqual(`Path \`price\` (${e.errors["price"].value}) is more than maximum allowed value (5000).`);
				});
			});
		});

		xit('should error Record Not Found if id doesn’t match', () => {

		});
		
		xit('should update record if price is numerical', () => {

		});

		xit('should not update record if price is not numerical', () => {

		});

		xit('should update record if startDate is less than endDate', () => {

		});

		xit('should not update record if startDate is greater than or equals to endDate', () => {

		});

		xit('should not update record if startDate and endDate are invalid', () => {

		});

	});

});