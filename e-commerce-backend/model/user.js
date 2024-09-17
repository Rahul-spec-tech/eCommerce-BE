const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    _id: {
        //type: String,
        type: String,
        auto: true 
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        firstname: {
            type: String,
            required: true
        },
        lastname: {
            type: String,
            required: true
        }
    },
    address: {
        city: String,
        street: String,
        number: Number,
        zipcode: String,
        geolocation: {
            lat: String,
            long: String
        }
    },
    phone: String
});

module.exports = mongoose.model('User', userSchema); 
