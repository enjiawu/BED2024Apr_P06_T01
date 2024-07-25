const CarbonFootprint = require('../models/carbonFootprint');

// Calculate the carbon footprint based on the data provided
const calculateCarbonFootprint = async (req, res) => {
    try {
        const data = req.body; // Get the data from the request body
        
        console.log(data);

        const {individualCF, totalCarbonFootprint} = await CarbonFootprint.calculateCarbonFootprint(data.carTravel, data.publicTransport, data.flight, data.motorBike); // Calculate the carbon footprint

        console.log(individualCF, totalCarbonFootprint);
        
        const treeEquivalent = await CarbonFootprint.getTreeEquivalent(totalCarbonFootprint); // Get the tree equivalent

        console.log(treeEquivalent);

        const grade = totalCarbonFootprint <= 3000 ? "good" : totalCarbonFootprint <= 7000 ? "average" : "poor"; // Get the grade based on the carbon footprint
        /*
        According to Statistica (https://www.statista.com/statistics/268753/co2-emissions-per-capita-worldwide-since-1990/), in 2022, 
        the average carbon footprint per capita per year is around 4.7 metric tons (4700 kg). 
        Based on this, we can categorize the carbon footprint into 3 Grades:
        - Good: 0 - 3000 kg
        - Average: 3001 - 7000 kg
        - Poor: 7001 kg and above 
        */
        const tips = await CarbonFootprint.getTipsByGrade(grade); // Get the tips based on the grade
        const randomTips = tips.sort(() => Math.random() - 0.5).slice(0, 5);

        // Return the graph results
        const stats = await CarbonFootprint.compareStats(); // Get the stats for the chart

        // Update the carbon footprint
        await CarbonFootprint.updateCarbonFootprint(data.carTravel, data.publicTransport, data.flight, data.motorBike, treeEquivalent, totalCarbonFootprint); // Update the carbon footprint in the database
        
        res.json({'individualCF': individualCF, 'totalCarbonFootprint': totalCarbonFootprint, 'treeEquivalent': treeEquivalent, 'grade': grade, 'tips': randomTips, 'stats': stats}); // Return the results
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error calculating carbon footprint' });
    }
}

// Get the possible actions to reduce the carbon footprint
const getCarbonFootprintPossibleActions = async (req, res) => { 
    try {
        const actions = await CarbonFootprint.getCarbonFootprintPossibleActions(); // Get the possible actions
        res.json(actions); // Return the actions
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error retrieving possible actions' });
    }
}

// Get the possible actions to reduce the carbon footprint by ID
const getCarbonFootprintPossibleActionsById = async (req, res) => {
    const id = req.params.id;
    try {
        const action = await CarbonFootprint.getCarbonFootprintPossibleActionsById(id); // Get the action by ID
        if (!action) { // If the action is not found
            return res.status(404).json({ error: 'Action not found' });
        }
        res.json(action); // Return the action
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error retrieving action' });
    }
}

// Create, update and delete the possible actions to reduce the carbon footprint
const createCarbonFootprintPossibleAction = async (req, res) => {
    const action = req.body;
    try {
        await CarbonFootprint.createCarbonFootprintPossibleAction(action);
        res.status(201).json(action);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error creating action' });
    }
}

const updateCarbonFootprintPossibleAction = async (req, res) => {
    const id = req.params.id;
    const action = req.body;
    try {
        await CarbonFootprint.updateCarbonFootprintPossibleAction(id, action);
        res.json(action);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error updating action' });
    }
}

const deleteCarbonFootprintPossibleAction = async (req, res) => {
    const id = req.params.id;
    try {
        await CarbonFootprint.deleteCarbonFootprintPossibleAction(id);
        res.json({ message: 'Action deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error deleting action' });
    }
}

module.exports = {
    calculateCarbonFootprint,
    getCarbonFootprintPossibleActions,
    getCarbonFootprintPossibleActionsById,
    createCarbonFootprintPossibleAction,
    updateCarbonFootprintPossibleAction,
    deleteCarbonFootprintPossibleAction
};