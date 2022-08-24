const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const Joi = require('joi');

const Genre = mongoose.model('Genre', new mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 5,
        max: 50
    }
}));





// const genres = [
//     {id:1, name:'action'},
//     {id:2, name:'thriller'},
//     {id:3, name:'terror'},
//     {id:4, name:'drama'}
// ];

router.get('/', async (req,res) => {
    const genres = await Genre.find().sort('name');
    res.send(genres);
    
});

router.get('/:id', async (req, res) => {
    const genre = await Genre.findById(req.params.id);
    // const genre = genres.find(g => g.id === parseInt(req.params.id));
    if (!genre) return res.status(404).send('The genre with the given ID was not found')

    res.send(genre);

});
router.post('/', async (req,res) => {
    
    const { error } = validateGenre(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    // const genre = {
    //     id: genres.length + 1,
    //     name: req.body.name
    // }
    
    let genre = new Genre ({
        name: req.body.name
    });

    try{
        genre = await genre.save();
        // console.log(genre);
        res.send(genre);
        }

    catch(ex){
        console.log(ex.message);

    }

    // genres.push(genre);
    // res.send(genre);
});

router.put('/:id', async (req, res) => {

    
    const { error } = validateGenre(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const genre = await Genre.findByIdAndUpdate(req.params.id, req.body,
         {
        new: true
    });



    // const genre = await Genre.findByIdAndUpdate(req.params.id, {
    //     $set: {
    //         name: req.body
    //     }
    // }, {
    //     new: true
    // });

    // const genre = genres.find(g => g.id === parseInt(req.params.id));
    if (!genre) return res.status(404).send('The genre with the given ID was not found')

    // genre.name = req.body.name;
    res.send(genre);

});


router.delete('/:id', async (req, res) => {
    const genre = await Genre.findByIdAndDelete(req.params.id );
    // const genre = genres.find(g => g.id === parseInt(req.params.id));
    if (!genre) return res.status(404).send('The genre with the given ID was not found')

    // const index = genres.indexOf(genre);
    // genres.splice(index, 1);

    res.send(genre);
});

function validateGenre(genre){
    const schema = Joi.object({
        name: Joi.string().min(5).max(50).required()
    });
    
    return schema.validate(genre);

}

module.exports = router;