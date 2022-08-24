const auth = require('../middleware/auth');
const { Rental, validate } = require('../models/rental');
const { Customer } = require('../models/customer');
const { Movie } = require('../models/movie');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');


// const Fawn = require('fawn');

// Fawn.init(mongoose);
router.get('/', auth, async (req,res) => {
    const rentals = await Rental.find().sort('-dateOut');
    res.send(rentals);
    
});

router.get('/:id', auth, async (req, res) => {
    const rental = await Rental.findById(req.params.id);
    if (!rental) return res.status(404).send('The rental with the given ID was not found')

    res.send(rental);

});
router.post('/', auth, async (req,res) => {

    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);


    
    const customer = await Customer.findById(req.body.customerId);
    if (!customer) return res.status(404).send('The customer with the given ID was not found');

    const movie = await Movie.findById(req.body.movieId);
    if (!movie) return res.status(404).send('The movie with the given ID was not found');


    if (movie.numbersInStock === 0) return res.status(400).send('Movie not in stock');
    // res.send(genre);


    let rental = new Rental ({
        customer: {
            _id: customer._id,
            name: customer.name,
            isGold: customer.isGold,
            phone: customer.phone
        },

        movie: {
            _id: movie._id,
            title: movie.title,
            // genre: movie.genre,
            // numberInStock: movie.numberInStock,
            dailyRentalRate: movie.dailyRentalRate

        }
    });
    const session = await mongoose.startSession();
    session.startTransaction();

    try{

        await rental.save({ session });

        movie.numberInStock--;
        await movie.save({ session });

        res.send(rental);
        // new Fawn.task()
        // .save('rentals', rental)
        // .update('movies', { _id: movie._id }, {
        //     $inc: {numberInStock: -1}
        // })
        // .run();

        // res.send(rental);
        await session.commitTransaction();
        session.endSession();
    }
    catch(ex){
        
        await session.abortTransaction();
        session.endSession();
        res.status(500).send('Something failed');
    }
        
});

router.put('/:id', auth, async (req, res) => {
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const genre = await Genre.findById(req.body.genreId);
    if (!genre) return res.status(404).send('The genre with the given ID was not found');

    const movie = await Movie.findOneAndUpdate({_id: req.params.id}, {
        $set: {
            'title': req.body.title,
            'genre.name': genre.name,
            'numberInStock': req.body.numberInStock,
            'dailyRentalRate': req.body.dailyRentalRate 
        }
    }, {new: true})

    // const movie = await Movie.findByIdAndUpdate(req.params.id, req.body,
    //      {
    //     new: true
    // });

    if (!movie) return res.status(404).send('The movie with the given ID was not found')
    res.send(movie);

});


router.delete('/:id', auth, async (req, res) => {
    const rental = await Rental.findByIdAndDelete(req.params.id );
    if (!rental) return res.status(404).send('The rental with the given ID was not found')

    res.send(rental);
});


module.exports = router;