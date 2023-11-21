const launches = require('./launches.mongo');
const planets = require('./planets.mongo');

let flightNumber = 100;

const firstLaunch = {
    flightNumber: 100,
    mission: 'Kepler Exploration X',
    rocket: 'Explorer IS1',
    launchDate: new Date('December 10, 2026'),
    target: 'Kepler-442 b',
    customer: ['Shiv', 'NASA'],
    upcoming: true,
    success: true,
};

saveLaunch(firstLaunch);

async function saveLaunch(launch) {
    //Checking if the target exoplanet for the launch is valid
    const planet = await planets.findOne({
        kepler_name: launch.target,
    });

    if (!planet) {
        throw new Error('No matching planet was found');
    }

    try {
        await launches.updateOne(
            {
                flightNumber: launch.flightNumber,
            },
            launch,
            {
                upsert: true,
            }
        );
    } catch (err) {
        console.error(`Coundnot add launch: ${err}`);
    }
}

async function httpGetAllLaunches() {
    const launchesArray = await launches.find(
        {},
        {
            __id: 0,
            __v: 0,
        }
    );
    return Array.from(launchesArray);
}

async function httpPutLaunch(launch) {
    flightNumber++;
    const newLaunch = {
        ...launch,
        flightNumber: flightNumber,
        customer: ['Shiv', 'NASA'],
        upcoming: true,
        success: true,
    };

    await saveLaunch(newLaunch);
    return await launches.findOne(
        { flightNumber: newLaunch.flightNumber },
        {
            __id: 0,
            __v: 0,
        }
    );
}

async function launchExists(launchId) {
    const launch = await launches.findOne({
        flightNumber: launchId,
    });
    return launch !== null;
}

async function httpAbortLaunch(launchId) {
    try {
        await launches.updateOne(
            {
                flightNumber: launchId,
            },
            {
                upcoming: false,
                success: false,
            }
        );
        return await launches.find(
            { flightNumber: launchId },
            {
                __id: 0,
                __v: 0,
            }
        );
    } catch (err) {
        console.error(`Coundnot add launch: ${err}`);
    }
}

module.exports = {
    httpGetAllLaunches,
    httpPutLaunch,
    launchExists,
    httpAbortLaunch,
};
