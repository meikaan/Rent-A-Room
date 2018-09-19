'use strick';

let _ = require("lodash");
let mongoose = require('mongoose');

let connection = mongoose.connect('mongodb://localhost/rentaroom_test');
const Schema = mongoose.Schema;

let SpecialPriceSchema = new Schema({
    price: {type: Number, required: true},
    startDate: {type: Date, required: true},
    endDate: {type: Date, required: true}  
});
SpecialPrice = mongoose.model('SpecialPrice', SpecialPriceSchema);

class SpecialPricesController{
	create(req, res) {
        return SpecialPrice.create(req.body)
            .then(result => res.send(result));
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
				startDate: new Date("2018-10-27"),
				endDate: new Date("2018-10-30")
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

		xit('should create record if field length is less than specified limit', () => {

			let data = {
				price: 15000000,
				startDate: new Date("2018-10-27"),
				endDate: new Date("2018-10-30")
			};

			let specialPricesController = new SpecialPricesController();
					
		});

		xit('should not create record if field length is zero, greater than or equal to specified limit', () => {

		});

		xit('should create record if price is numerical', () => {

		});

		xit('should not create record if price is not numerical', () => {

		});

		xit('should create record if startDate is less than endDate', () => {

		});

		xit('should not create record if startDate is greater than or equals to endDate', () => {

		});

		xit('should create record if startDate and endDate format is MM/DD/YY', () => {

		});

		xit('should not create record if startDate and endDate format is not MM/DD/YY', () => {

		});

	});

});