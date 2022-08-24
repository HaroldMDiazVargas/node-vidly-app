const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const { Rental } = require('../models/rental');
const { Movie } = require('../models/movie');
const express = require('express');
const router = express.Router();
const Joi = require('joi');




router.post('/',  [auth, validate(validateReturn)], async (req,res) => {
 
    const rental = await Rental.lookup(req.body.customerId, req.body.movieId);

    if (!rental) return res.status(404).send('The rental with the given customer/movie was not found');

    if(rental.dateReturned) return res.status(400).send('The rental with the given customer/movie already processed');

    rental.return();

    await rental.save();

    await Movie.updateOne({ _id: rental.movie }, {
        $inc: { numberInStock: 1}
    });
  
    return res.send(rental);

});


function validateReturn(req){
    const schema = Joi.object({
        customerId: Joi.objectId().required(),
        movieId: Joi.objectId().required()

    });
    
    return schema.validate(req);

}

module.exports = router;
