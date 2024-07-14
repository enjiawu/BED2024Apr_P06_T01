const carbonFootprintCalculator = require('../models/carbonFootprintCalculator');

const calculateCarbonFootprint = async (req, res) => {
    try {
        const data = req.body; // assuming you're sending the data in the request body
        const results = await carbonFootprintCalculator.calculateCarbonFootprint(data);
        res.json(results);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error calculating carbon footprint' });
    }
}

module.exports = {
    calculateCarbonFootprint,
};