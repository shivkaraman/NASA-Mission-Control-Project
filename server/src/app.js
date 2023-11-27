const express = require('express');
const cors = require('cors');
const path = require('path');
const morgan = require('morgan');

//Routers
const { v1Router } = require('./routes/api_v1');

const app = express();

//Parses incoming JSON string to object
app.use(express.json());

//Serving static files
app.use(express.static(path.join(__dirname, '..', 'public')));

//Allowing Cross origin requests from port 3000 (Front end)
app.use(
    cors({
        origin: 'http://localhost:3000',
    })
);

//Logging middleware
app.use(morgan('combined')); //https://www.npmjs.com/package/morgan

//Serving Requests
app.use('/v1', v1Router);

//Leaving front end to handle rest of the routes
app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

module.exports = app;
