const express = require('express');
const {
    putNewLaunch,
    getAllLaunches,
    abortLaunch,
} = require('./launches.controller');

const launchRouter = express.Router();

launchRouter.get('/', getAllLaunches);
launchRouter.post('/', putNewLaunch);
launchRouter.delete('/:id', abortLaunch);

module.exports = {
    launchRouter,
};
