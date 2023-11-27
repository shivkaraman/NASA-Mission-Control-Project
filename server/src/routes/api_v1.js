const express = require('express');

const { planetsRouter } = require('./planets/planets.router');
const { launchRouter } = require('./launches/launches.router');
const v1Router = express.Router();

v1Router.use('/planets', planetsRouter);
v1Router.use('/launches', launchRouter);

module.exports = { v1Router };
