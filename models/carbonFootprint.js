const sql = require("mssql");
const dbConfig = require("../dbConfig");
require("dotenv").config(); // Import dotenv package to read environment variables

const axios = require("axios"); // Import axios library to make HTTP requests to the API 

class CarbonFootprint {
  constructor(
    carTravel,
    publicTransport,
    flight,
    motorBike,
    treeEquivalent,
    grade
  ) {
    this.carTravel = carTravel;
    this.publicTransport = publicTransport;
    this.flight = flight;
    this.motorBike = motorBike;
    this.treeEquivalent = treeEquivalent;
    this.grade = grade;
  }
  
  // Calculate carbon footprint
  static async calculateCarbonFootprint(carTravel, publicTransport, flight, motorBike) {
    const options = [
      createOptions('/CarbonFootprintFromCarTravel', { distance: carTravel.distance, vehicle: carTravel.vehicle }),
      createOptions('/CarbonFootprintFromFlight', { distance: flight.distance, type: flight.type }),
      createOptions('/CarbonFootprintFromMotorBike', { type: motorBike.type, distance: motorBike.distance }),
      createOptions('/CarbonFootprintFromPublicTransit', { distance: publicTransport.distance, type: publicTransport.type }),
    ];
  
    const promises = options.map((option) => {
      return axios.get(`https://${option.hostname}${option.path}`, {
        headers: option.headers
      }).then((response) => {
        return response.data.carbonEquivalent; // Extract the carbon footprint value from the object
      });
    });
  
    const results = await Promise.all(promises);
    const totalCarbonFootprint = results.reduce((acc, current) => acc + current, 0);
    const roundedTotalCarbonFootprint = parseFloat(totalCarbonFootprint.toFixed(4));

    return roundedTotalCarbonFootprint;
  }

  // Get number of trees needed to offset carbon footprint
  static async getTreeEquivalent(weight) {
    const option = createOptions('/TreeEquivalent', { weight: weight.toString(), unit: "kg"});

    const response = await axios.get(`https://${option.hostname}${option.path}`, {
      headers: option.headers
    });

    
    const treeEquivalent = response.data.numberOfTrees;
    const roundedTreeEquivalent = parseFloat(treeEquivalent.toFixed(4));

    return roundedTreeEquivalent;
  }

  static async getTipsByGrade(grade) {
     const connection = await sql.connect(dbConfig);

    const sqlQuery = `SELECT * FROM CarbonFootprintPossibleActions WHERE grade = @grade`;

    const request = connection.request();
    request.input("grade", grade);

    const result = await request.query(sqlQuery);
    connection.close();

    return result.recordset;
  }
}

function createOptions(path, params) {
  return {
    method: 'GET',
    hostname: 'carbonfootprint1.p.rapidapi.com',
    port: null,
    path: `${path}?${Object.keys(params).map((key) => `${key}=${params[key]}`).join('&')}`,
    headers: {
      'x-rapidapi-key': process.env.CFC_API_KEY,
      'x-rapidapi-host': 'carbonfootprint1.p.rapidapi.com'
    }
  };
}

module.exports = CarbonFootprint;

/*
Carbon Footprint Calculator

General Features:
- Calculate carbon footprint: Calculate the user's carbon footprint based on fuel, car travel, public transprt, flight and motor bike usage using RapidAPI. 
- Get number of trees needed to offset carbon footprint: Calculate the number of trees needed to offset the user's carbon footprint using a RapidAPI.
- Load carbon footprint suggestions based on user input: Provide suggestions on how to reduce carbon footprint based on the user's input.
- Implement sharing feature: Allow users to share their carbon footprint and offsetting efforts on social media platforms.
- View carbon footprint in comparison to others: Display the user's carbon footprint in comparison to other users or the average carbon footprint in a chart or graph.
 */