const sql = require("mssql");
const dbConfig = require("../dbConfig");
require("dotenv").config(); // Import dotenv package to read environment variables

const axios = require("axios"); // Import axios library to make HTTP requests to the API 

function createOptions(path, params) { // Function to create options for the HTTP request
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

class CarbonFootprintCalculator {
  constructor(data) {
    this.fuelUsage = data.fuelUsage;
    this.carTravel = data.carTravel;
    this.publicTransport = data.publicTransport;
    this.flight = data.flight;
    this.motorBike = data.motorBike;
    this.treeEquivalent = data.treeEquivalent;
  }

  // Calculate carbon footprint
  async calculateCarbonFootprint() {
    const options = [
      createOptions('/CarbonFootprintFromCarTravel', { distance: this.carTravel.distance, vehicle: this.carTravel.vehicle }),
      createOptions('/CarbonFootprintFromFlight', { distance: this.flight.distance, type: this.flight.type }),
      createOptions('/CarbonFootprintFromMotorBike', { type: this.motorBike.type, distance: this.motorBike.distance }),
      createOptions('/CarbonFootprintFromPublicTransit', { distance: this.publicTransport.distance, type: this.publicTransport.type }),
      createOptions('/FuelToC02e', { type: this.fuelUsage.type, litres: this.fuelUsage.litres }),
    ];

    const promises = options.map((option) => {
      return axios.get(`https://${option.hostname}${option.path}`, {
        headers: option.headers
      }).then((response) => {
        return response.data; // Extract only the response data
      });
    });

    const results = await Promise.all(promises);
    const totalCarbonFootprint = results.reduce((acc, current) => acc + current, 0);

    // Store the results in the database
    await this.storeCarbonFootprintInDatabase(totalCarbonFootprint);
  }

  // Store carbon footprint in database
  async storeCarbonFootprintInDatabase(totalCarbonFootprint) {
    const connection = await sql.connect(dbConfig);

    const sqlQuery = `INSERT INTO CarbonFootprints (fuelUsage, carTravel, publicTransport, flight, motorBike, treeEquivalent, totalCarbonFootprint) 
      VALUES (@fuelUsage, @carTravel, @publicTransport, @flight, @motorBike, @treeEquivalent, @totalCarbonFootprint)`;

    const request = connection.request();
    request.input("fuelUsage", this.fuelUsage.litres);
    request.input("carTravel", this.carTravel.distance);
    request.input("publicTransport", this.publicTransport.distance);
    request.input("flight", this.flight.distance);
    request.input("motorBike", this.motorBike.distance);
    request.input("treeEquivalent", this.treeEquivalent);
    request.input("totalCarbonFootprint", totalCarbonFootprint);

    await request.query(sqlQuery);

    connection.close();
  }
}

module.exports = CarbonFootprintCalculator;

/*
Carbon Footprint Calculator

General Features:
- Calculate carbon footprint: Calculate the user's carbon footprint based on fuel, car travel, public transprt, flight and motor bike usage using RapidAPI. 
- Get number of trees needed to offset carbon footprint: Calculate the number of trees needed to offset the user's carbon footprint using a RapidAPI.
- Load carbon footprint suggestions based on user input: Provide suggestions on how to reduce carbon footprint based on the user's input.
- Implement sharing feature: Allow users to share their carbon footprint and offsetting efforts on social media platforms.

- View carbon footprint in comparison to others: Display the user's carbon footprint in comparison to other users or the average carbon footprint in a chart or graph.
 */