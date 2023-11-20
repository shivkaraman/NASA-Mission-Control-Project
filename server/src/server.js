const http = require('http');
const app = require('./app');
const mongoose = require('mongoose');
const { loadPlanets } = require('./models/planets.model');

const PORT = process.env.PORT || 8000;
const MONGO_URL =
    'mongodb+srv://nasa-api:cCKTHMdtgT70kXpy@nasacluster.k3yzyat.mongodb.net/';
const server = http.createServer(app);

mongoose.connection.once('open', () => {
    console.log('MongoDB connection ready!!');
});

mongoose.connection.on('error', (err) => {
    console.error(err);
});

async function startServer() {
    await mongoose.connect(MONGO_URL, {
        useNewUrlParser: true,
        useFindAndModify: false,
        useCreateIndex: true,
        useUnifiedTopology: true,
    });
    await loadPlanets();

    server.listen(PORT, () => {
        console.log(`Listening on port ${PORT}`);
    });
}

startServer();
