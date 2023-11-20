const mongoose = require('mongoose');

const launchesSchema = new mongoose.Schema({
    flightNumber: {
        type: Number,
        required: true,
    },
    mission: {
        type: String,
        required: true,
    },
    rocket: {
        type: String,
        required: true,
    },
    launchDate: {
        type: String,
        required: true,
    },
    target: {
        type: String,
        required: true,
    },
    customer: [String],
    upcoming: {
        type: Boolean,
        required: true,
        default: true,
    },
    success: {
        type: Boolean,
        required: true,
        default: true,
    },
});

//Connects launchesSchema to the 'launches' collection of our db
modules.export = mongoose.model('Launch', launchesSchema);
