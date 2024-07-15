const CarbonFootprint = require('../models/carbonFootprint');

const calculateCarbonFootprint = async (req, res) => {
    try {
        const data = req.body; // Get the data from the request body
        const totalCarbonFootprint = await CarbonFootprint.calculateCarbonFootprint(data.carTravel, data.publicTransport, data.flight, data.motorBike);

        const treeEquivalent = await CarbonFootprint.getTreeEquivalent(totalCarbonFootprint);

        const grade = totalCarbonFootprint <= 3000 ? "good" : totalCarbonFootprint <= 5000 ? "average" : "poor";
        /*
        According to Statistica (https://www.statista.com/statistics/268753/co2-emissions-per-capita-worldwide-since-1990/), 
        the average carbon footprint per capita per year is around 4.7 metric tons (4700 kg). 

        Grades:
        - Good: 0 - 3000 kg
        - Average: 3001 - 5000 kg
        - Poor: 5001 kg and above 
        */
        const tips = await CarbonFootprint.getTipsByGrade(grade);
        
        res.json({totalCarbonFootprint, treeEquivalent, 'grade': grade, tips});
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error calculating carbon footprint' });
    }
}

module.exports = {
    calculateCarbonFootprint,
};