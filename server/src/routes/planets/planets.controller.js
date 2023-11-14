const { httpGetAllPlanets } = require('../../models/planets.model');

function getAllPlanets(req, res) {
    const planets = httpGetAllPlanets();
    return res.status(200).json(planets);
}

module.exports = {
    getAllPlanets,
};
