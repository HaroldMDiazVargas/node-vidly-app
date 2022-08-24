const config = require('config');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Joi = require('joi');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 5,
        maxlength: 50,
        required: true
    },

    email: {
        type: String,
        minlength: 5,
        maxlength: 255,
        unique: true,
        required: true
    },

    password: {
        type: String,
        minlength: 5,
        maxlength: 255,
        required: true
    },

    isAdmin: Boolean
   
});

userSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({ _id: this._id, name:this.name, isAdmin: this.isAdmin}, config.get('jwtPrivateKey'), {expiresIn: 60});
    return token;

}

const User = mongoose.model('User', userSchema );


function validateUser(user){
    const schema = Joi.object({
        name: Joi.string().min(5).max(50).required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required()
    });
    return schema.validate(user);
}

module.exports.User = User;
module.exports.validate = validateUser;