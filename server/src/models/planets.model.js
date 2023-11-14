const fs = require('fs');
const { parse } = require('csv-parse');
const path = require('path');

const habitablePlanets = [];

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

function loadPlanets() {
    return new Promise((resolve, reject) => {
        fs.createReadStream(path.join(__dirname, '/kepler_data.csv'))
            .pipe(parser)
            .on('data', (data) => {
                if (isHabitable(data)) {
                    habitablePlanets.push(data);
                }
            })
            .on('error', (err) => {
                console.log(err);
                reject(err);
            })
            .on('end', () => {
                console.log(
                    `${habitablePlanets.length} habitable planets found`
                );
                console.log('END');
                resolve();
            });
    });
}

const httpGetAllPlanets = () => {
    return habitablePlanets;
};

module.exports = {
    loadPlanets,
    httpGetAllPlanets,
};
