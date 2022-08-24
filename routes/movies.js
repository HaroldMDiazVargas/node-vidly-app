const auth = require('../middleware/auth');
const { Movie, validate } = require('../models/movie');
const { Genre } = require('../models/genre');
const express = require('express');
const router = express.Router();


router.get('/', async (req,res) => {
    const movies = await Movie.find().sort('title');
    res.send(movies);
    
});

router.get('/:id', async (req, res) => {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).send('The movie with the given ID was not found')

    res.send(movie);

});
router.post('/', auth, async (req,res) => {

    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const genre = await Genre.findById(req.body.genreId);
    if (!genre) return res.status(404).send('The genre with the given ID was not found');

    // res.send(genre);


    const movie = new Movie ({
        title: req.body.title,
        genre: {
            _id: genre._id,
            name: genre.name
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate
    });

    try{
        await movie.save();
        res.send(movie);
        }

    catch(ex){
        console.log(ex.message);

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
    const movie = await Movie.findByIdAndDelete(req.params.id );
    if (!movie) return res.status(404).send('The movie with the given ID was not found')

    res.send(movie);
});


module.exports = router;