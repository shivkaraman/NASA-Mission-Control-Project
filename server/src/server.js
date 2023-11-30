const http = require('http');
const app = require('./app');
const { connectToDB } = require('./services/mongo');
const { loadPlanets } = require('./models/planets.model');
const { loadLaunchesData } = require('./models/launches.model');

const PORT = process.env.PORT || 8000;
const server = http.createServer(app);

async function startServer() {
    await connectToDB();
    await loadPlanets();
    await loadLaunchesData();

    server.listen(PORT, () => {
        console.log(`Listening on port ${PORT}`);
    });
}

startServer();
