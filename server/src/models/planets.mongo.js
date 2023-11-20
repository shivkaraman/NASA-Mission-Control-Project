const mongoose = require('mongoose');

const planetsSchema = new mongoose.Schema({
    kepler_name: {
        type: String,
        required: true,
    },
});

//Connects planetSchema to the 'planets' collection of our db
module.exports = mongoose.model('Planet', planetsSchema);
