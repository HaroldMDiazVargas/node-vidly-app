const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const { Genre, validate } = require('../models/genre');
const express = require('express');
const  mongoose = require('mongoose');
const router = express.Router();
const validateObjectId = require('../middleware/validateObjectId');

router.get('/', async (req,res) => {
    // throw new Error('Could not get the genres.');
    const genres = await Genre.find().sort('name');
    res.send(genres);
    
});

router.get('/:id', validateObjectId, async (req, res) => {

    const genre = await Genre.findById(req.params.id);
    if (!genre) return res.status(404).send('The genre with the given ID was not found')

    res.send(genre);

});
router.post('/', async (req,res) => {
// router.post('/', auth, async (req,res) => {
    
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    
    const genre = new Genre ({
        name: req.body.name
    });

    try{
        await genre.save();
        res.send(genre);
        }

    catch(ex){
        console.log(ex.message);

    }

});

// router.put('/:id', auth, async (req, res) => {
router.put('/:id', validateObjectId, async (req, res) => {
    
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const genre = await Genre.findByIdAndUpdate(req.params.id, req.body,
         {
        new: true
    });

    if (!genre) return res.status(404).send('The genre with the given ID was not found')

    res.send(genre);

});


// router.delete('/:id', [auth, admin], async (req, res) => {
    
router.delete('/:id',validateObjectId, async (req, res) => {
    const genre = await Genre.findByIdAndDelete(req.params.id );
    if (!genre) return res.status(404).send('The genre with the given ID was not found')

    res.send(genre);
});


module.exports = router;