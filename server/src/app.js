const express = require('express');
const cors = require('cors');
const path = require('path');
const morgan = require('morgan');

//Routers
const { planetsRouter } = require('./routes/planets/planets.router');
const { launchRouter } = require('./routes/launches/launches.router');

const app = express();
app.use(express.json()); //Parses incoming JSON string to object
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(
    cors({
        origin: 'http://localhost:3000', //Allowing Cross origin requests from port 3000 (Front end)
    })
);
app.use(morgan('combined')); //https://www.npmjs.com/package/morgan

//Serving Requests
app.use('/planets', planetsRouter);
app.use('/launches', launchRouter);
app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

module.exports = app;
