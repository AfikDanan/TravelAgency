const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const flightSchema = new Schema({
    date: {
        type: String,
        required: true
    },
    takeOffTime: {
        type: String,
        required: true
    },
    landing: {
        type: String,
        required: true
    },
    origin: {
        type: String,
        required: true
    },
    destinaton: {
        type: String,
        required: true
    },
    numOfSeats: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    imagePath: {
        type: String,
        required: true
    },

});

module.exports = mongoose.model('Flight', flightSchema);

