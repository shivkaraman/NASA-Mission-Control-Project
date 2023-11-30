const launches = require('./launches.mongo');
const planets = require('./planets.mongo');
const axios = require('axios');

const DEFAULT_FLIGHT_NUMBER = 0;

// Documentation: https://github.com/r-spacex/SpaceX-API/blob/master/docs/queries.md
const SPACEX_API_URL = 'https://api.spacexdata.com/v4/launches/query';

/*
    ___OUR_API____    ___SPACEX_API___
    flightNumber    : flight_number
    mission         : name
    rocket          : rocket.name
    launchDate      : date_local
    target          : NOT APPLiCABLE,
    customer        : payloads.customers
    upcoming        : upcoming
    success         : success
*/
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

async function populateLaunches() {
    console.log('Downloading launches data from SpaceX API');
    const response = await axios.post(SPACEX_API_URL, {
        query: {},
        options: {
            pagination: false,
            populate: [
                {
                    path: 'rocket',
                    select: {
                        name: 1,
                    },
                },
                {
                    path: 'payloads',
                    select: {
                        customers: 1,
                    },
                },
            ],
        },
    });

    if (response.status !== 200) {
        console.error('Problem downloading launches data');
        throw new Error('Launch Data Download Failed');
    }

    const launchDocs = response.data.docs;

    launchDocs.forEach(async (launchDoc) => {
        const payloads = launchDoc.payloads;
        //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flatMap
        const customers = payloads.flatMap((payload) => {
            return payload.customers;
        });

        const launch = {
            flightNumber: launchDoc.flight_number,
            mission: launchDoc.name,
            rocket: launchDoc.rocket.name,
            launchDate: launchDoc.date_local,
            target: '-',
            customer: customers,
            upcoming: launchDoc.upcoming,
            success: launchDoc.success,
        };

        await saveLaunch(launch);
    });
    console.log('Upoaded SpaceX launches to database!!');
}

async function loadLaunchesData() {
    //Populating the launches from spacex api only once
    const firstSpacexLaunch = await launches.findOne({
        flightNumber: 1,
        rocket: 'Falcon 1',
        mission: 'FalconSat',
    });

    if (firstSpacexLaunch) {
        console.log('Launches already loaded to database');
        return;
    }

    await populateLaunches();
}

async function getLatestFlightNumber() {
    const latestLaunch = await launches.findOne().sort('-flightNumber');
    if (!latestLaunch) return DEFAULT_FLIGHT_NUMBER;
    return latestLaunch.flightNumber;
}

async function saveLaunch(launch) {
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

async function httpGetAllLaunches(skip, limit) {
    const launchesArray = await launches
        .find(
            {},
            {
                __id: 0,
                __v: 0,
            }
        )
        .sort({ flightNumber: 1 })
        .skip(skip)
        .limit(limit);
    return Array.from(launchesArray);
}

async function httpPutLaunch(launch) {
    //Checking if the target exoplanet for the launch is valid
    const planet = await planets.findOne({
        kepler_name: launch.target,
    });

    if (!planet) {
        throw new Error('No matching planet was found');
    }

    const newFlightNo = (await getLatestFlightNumber()) + 1;
    const newLaunch = {
        ...launch,
        flightNumber: newFlightNo,
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
    loadLaunchesData,
    httpGetAllLaunches,
    httpPutLaunch,
    launchExists,
    httpAbortLaunch,
};
