const {
    httpGetAllLaunches,
    httpPutLaunch,
    launchExists,
    httpAbortLaunch,
} = require('../../models/launches.model');

async function getAllLaunches(req, res) {
    const launches = await httpGetAllLaunches();
    return res.status(200).json(launches);
}

async function putNewLaunch(req, res) {
    const newLaunch = req.body;

    //Input Validation
    if (
        !newLaunch.mission ||
        !newLaunch.rocket ||
        !newLaunch.launchDate ||
        !newLaunch.target
    ) {
        return res.status(400).json({
            error: 'Missing required launch property',
        });
    }

    newLaunch.launchDate = new Date(newLaunch.launchDate);
    if (isNaN(newLaunch.launchDate)) {
        return res.status(400).json({
            error: 'Invalid launch date',
        });
    }

    const response = await httpPutLaunch(newLaunch);
    return res.status(201).json(response);
}

function abortLaunch(req, res) {
    const launchId = Number(req.params.id);
    if (!launchExists(launchId)) {
        return res.status(404).json({
            error: 'Launch Not Found',
        });
    }

    const response = httpAbortLaunch(launchId);
    return res.status(200).json(response);
}

module.exports = {
    getAllLaunches,
    putNewLaunch,
    abortLaunch,
};
