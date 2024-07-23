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
    const roundedTotalCarbonFootprint = parseFloat(totalCarbonFootprint.toFixed(2));

    return {'individualCF': results, 'totalCarbonFootprint' : roundedTotalCarbonFootprint};
  }

  // Get number of trees needed to offset carbon footprint
  static async getTreeEquivalent(weight) {
    const option = createOptions('/TreeEquivalent', { weight: weight.toString(), unit: "kg"});

    const response = await axios.get(`https://${option.hostname}${option.path}`, {
      headers: option.headers
    });

    
    const treeEquivalent = response.data.numberOfTrees;
    const roundedTreeEquivalent = Math.ceil(treeEquivalent);

    return roundedTreeEquivalent;
  }

  // Load carbon footprint suggestions based on user's carbon footprint grade
  static async getTipsByGrade(grade) {
     const connection = await sql.connect(dbConfig);

    const sqlQuery = `SELECT * FROM CarbonFootprintPossibleActions WHERE grade = @grade`;

    const request = connection.request();
    request.input("grade", grade);

    const result = await request.query(sqlQuery);
    connection.close();

    return result.recordset;
  }

  static async updateCarbonFootprint(carTravel, publicTransport, flight, motorBike, treeEquivalent, totalCarbonFootprint) {
    const connection = await sql.connect(dbConfig);
  
    // Make sure that the inputs are correctly inputed into the database
    const sqlQuery = `
      INSERT INTO CarbonFootprints (
        carTravel,
        publicTransport,
        flight,
        motorBike,
        treeEquivalent,
        totalCarbonFootprint
      )
      VALUES (
        @carTravel,
        @publicTransport,
        @flight,
        @motorBike,
        @treeEquivalent,
        @totalCarbonFootprint
      )
      SELECT SCOPE_IDENTITY() AS id
    `;
  
    const request = connection.request();
    if (carTravel !== null && carTravel !== 0) {
      request.input("carTravel", parseFloat(carTravel));
    }
    else{
      request.input("carTravel", 0);
    }

    if (publicTransport !== null && publicTransport !== 0) {
      request.input("publicTransport", parseFloat(publicTransport));
    }
    else{
      request.input("publicTransport", 0);
    }

    if (flight !== null && flight !== 0) {
      request.input("flight", parseFloat(flight));
    }
    else{
      request.input("flight", 0);
    }

    if (motorBike !== null && motorBike !== 0) {
      request.input("motorBike", parseFloat(motorBike));
    }else{
      request.input("motorBike", 0);
    }
    
    request.input("treeEquivalent", parseFloat(treeEquivalent));
    request.input("totalCarbonFootprint", parseFloat(totalCarbonFootprint));
  
    await request.query(sqlQuery);
    connection.close();
  }
    
  static async compareStats() {
    const connection = await sql.connect(dbConfig);
  
    const sqlQuery = ` 
      SELECT 
        AVG(carTravel) AS avgCarTravel,
        AVG(publicTransport) AS avgPublicTransport,
        AVG(flight) AS avgFlight,
        AVG(motorBike) AS avgMotorBike,
        AVG(treeEquivalent) AS avgTreeEquivalent,
        AVG(totalCarbonFootprint) AS avgTotalCarbonFootprint
      FROM CarbonFootprints
    `; // Get the average of all current carbon footprints
  
    const request = connection.request();
  
    const result = await request.query(sqlQuery);
    connection.close();
  
    return result.recordset[0];
  }

  static async getCarbonFootprintPossibleActions() {
    const connection = await sql.connect(dbConfig);

    const sqlQuery = `SELECT * FROM CarbonFootprintPossibleActions`;

    const result = await connection.request().query(sqlQuery);

    return result.recordset;
  }

  static async getCarbonFootprintPossibleActionsById(actionId) {
    const connection = await sql.connect(dbConfig);

    const sqlQuery = `SELECT * FROM CarbonFootprintPossibleActions WHERE actionId = @actionId`;

    const request = connection.request();

    request.input("actionId", actionId);

    const result = await request.query(sqlQuery);

    return result.recordset[0];
  }

  static async createCarbonFootprintPossibleAction(possibleAction) {
    const connection = await sql.connect(dbConfig);

    const sqlQuery = `
      INSERT INTO CarbonFootprintPossibleActions (title, description, grade)
      VALUES (@title, @description, @grade)
      SELECT SCOPE_IDENTITY() AS id;`;

    const request = connection.request();

    request.input("title", possibleAction.title);
    request.input("description", possibleAction.description);
    request.input("grade", possibleAction.grade);

    const results = await request.query(sqlQuery);
    connection.close();

    return results.recordset[0];
  }

  static async updateCarbonFootprintPossibleAction(actionId, possibleAction) {
    const connection = await sql.connect(dbConfig);

    const sqlQuery = `
      UPDATE CarbonFootprintPossibleActions
      SET title = @title, description = @description, grade = @grade
      WHERE actionId = @actionId`;
    
    const request = connection.request();

    request.input("actionId", actionId);
    request.input("title", possibleAction.title || null);
    request.input("description", possibleAction.description) || null;
    request.input("grade", possibleAction.grade || null);

    await request.query(sqlQuery);

    return await CarbonFootprint.getCarbonFootprintPossibleActionsById(actionId);
  }

  static async deleteCarbonFootprintPossibleAction(actionId) {
    const connection = await sql.connect(dbConfig);

    const sqlQuery = `DELETE FROM CarbonFootprintPossibleActions WHERE actionId = @actionId`;

    const request = connection.request();
    request.input("actionId", actionId);

    const result = await request.query(sqlQuery);

    return result.rowsAffected[0];
  }
}

// Function to create options for the API request based on the path and parameters
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
- Calculate carbon footprint: Calculate the user's carbon footprint based on fuel, car travel, public transprt, flight and motor bike usage using RapidAPI. [x]
- Get number of trees needed to offset carbon footprint: Calculate the number of trees needed to offset the user's carbon footprint using a RapidAPI. [x]
- Load carbon footprint suggestions based on user input: Provide suggestions on how to reduce carbon footprint based on the user's input. [x]
- View carbon footprint in comparison to others: Display the user's carbon footprint in comparison to other users or the average carbon footprint in a chart or graph. [x]
 */