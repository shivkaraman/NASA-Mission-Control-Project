const { httpGetAllPlanets } = require('../../models/planets.model');

async function getAllPlanets(req, res) {
    const planets = await httpGetAllPlanets();
    return res.status(200).json(planets);
}

module.exports = {
    getAllPlanets,
};
