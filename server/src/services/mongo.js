const mongoose = require('mongoose');

const MONGO_URL =
    'mongodb+srv://nasa-api:cCKTHMdtgT70kXpy@nasacluster.k3yzyat.mongodb.net/';

mongoose.connection.once('open', () => {
    console.log('MongoDB connection ready!!');
});

mongoose.connection.on('error', (err) => {
    console.error(`Could not connect to database : ${err}`);
});

async function connectToDB() {
    await mongoose.connect(MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
}

async function disconnectDB() {
    await mongoose.disconnect();
}

module.exports = {
    connectToDB,
    disconnectDB,
};
