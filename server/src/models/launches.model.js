let launchesMap = new Map();

let flightNumber = 100;

const launch = {
    flightNumber: 100,
    mission: 'Kepler Exploration X',
    rocket: 'Explorer IS1',
    launchDate: new Date('December 10, 2026'),
    target: 'Kepler-442 b',
    customer: ['Shiv', 'NASA'],
    upcoming: true,
    success: true,
};
launchesMap.set(flightNumber, launch);

const httpGetAllLaunches = () => {
    const launchesArray = Array.from(launchesMap.values());
    return launchesArray;
};

const httpPutLaunch = (launch) => {
    flightNumber++;
    const newLaunch = {
        ...launch,
        flightNumber: flightNumber,
        customer: ['Shiv', 'NASA'],
        upcoming: true,
        success: true,
    };

    launchesMap.set(flightNumber, newLaunch);
    return newLaunch;
};

const launchExists = (launchId) => {
    return launchesMap.has(launchId);
};

const httpAbortLaunch = (launchId) => {
    const aborted = launchesMap.get(launchId);
    aborted.upcoming = false;
    aborted.success = false;
    return aborted;
};

module.exports = {
    httpGetAllLaunches,
    httpPutLaunch,
    launchExists,
    httpAbortLaunch,
};
