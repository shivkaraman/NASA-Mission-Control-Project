const fs = require('fs');
const { parse } = require('csv-parse');
const path = require('path');

const planets = require('./planets.mongo'); //Importing planets model from mongoose schema

const parser = parse({
    comment: '#',
    columns: true,
});

function isHabitable(planet) {
    return (
        planet['koi_disposition'] == 'CONFIRMED' &&
        planet['koi_insol'] > 0.36 &&
        planet['koi_insol'] < 1.11 &&
        planet['koi_prad'] < 1.6
    );
}

async function savePlanet(data) {
    //upsert = insert+update -> Used to insert/upload data into a collection if it doenst already exist. If a document already exists, it updates with what we pass now
    try {
        await planets.updateOne(
            {
                kepler_name: data.kepler_name,
            },
            {
                kepler_name: data.kepler_name,
            },
            {
                upsert: true,
            }
        );
    } catch (err) {
        console.error(`Coundnot save this planet: ${err}`);
    }
}

function loadPlanets() {
    return new Promise((resolve, reject) => {
        fs.createReadStream(path.join(__dirname, '/kepler_data.csv'))
            .pipe(parser)
            .on('data', async (data) => {
                if (isHabitable(data)) {
                    savePlanet(data);
                }
            })
            .on('error', (err) => {
                console.log(err);
                reject(err);
            })
            .on('end', async () => {
                const countPlanetsFound = (await httpGetAllPlanets()).length;
                console.log(`${countPlanetsFound} habitable planets found`);
                console.log('END');
                resolve();
            });
    });
}

const httpGetAllPlanets = async () => {
    return await planets.find({});
};

module.exports = {
    loadPlanets,
    httpGetAllPlanets,
};
