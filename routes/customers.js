const auth = require('../middleware/auth');
const { Customer, validate } = require('../models/customer');
const express = require('express');
const router = express.Router();


router.get('/', auth, async (req,res) => {
    const customers = await Customer.find().sort('name');
    res.send(customers);
    
});

router.get('/:id', auth, async (req, res) => {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).send('The genre with the given ID was not found')

    res.send(customer);

});
router.post('/', auth, async (req,res) => {
    
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const customer = new Customer ({
        isGold: req.body.isGold,
        name: req.body.name,
        phone: req.body.phone
    });

    try{
        await customer.save();
        res.send(customer);
        }

    catch(ex){
        console.log(ex.message);

    }

});

router.put('/:id', auth, async (req, res) => {
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const customer = await Customer.findByIdAndUpdate(req.params.id, req.body,
         {
        new: true
    });

    if (!customer) return res.status(404).send('The customer with the given ID was not found')
    res.send(customer);

});


router.delete('/:id', auth, async (req, res) => {
    const customer = await Customer.findByIdAndDelete(req.params.id );
    if (!customer) return res.status(404).send('The customer with the given ID was not found')

    res.send(customer);
});


module.exports = router;