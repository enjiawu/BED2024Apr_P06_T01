const Joi = require("joi");

const validateCarbonFootprint = (req, res, next) => {
    const schema = Joi.object({
        carTravel: Joi.object({
            distance: Joi.number().default(0),
            vehicle: Joi.string().default('')
        }).default({ distance: 0, vehicle: '' }),
        flight: Joi.object({
            distance: Joi.number().default(0),
            type: Joi.string().default('')
        }).default({ distance: 0, type: '' }),
        motorBike: Joi.object({
            type: Joi.string().default(''),
            distance: Joi.number().default(0)
        }).default({ type: '', distance: 0 }),
        publicTransport: Joi.object({
            distance: Joi.number().default(0),
            type: Joi.string().default('')
        }).default({ distance: 0, type: '' })
        });

    const validation = schema.validate(req.body, { abortEarly: false }); // Validate request body

    if (validation.error) {
        const errors = validation.error.details.map((error) => error.message); //Errors are extracteed and formatted into an array of messages
        res.status(400).json({ message: "Validation error", errors });
        return; // Terminate middleware execution on validation error
    }

    next(); // If validation passes, proceed to the next route handler
};

module.exports = validateCarbonFootprint;

/*
{
    "carTravel": {
        "distance": 30,
        "vehicle": "SmallDieselCar"
    },
    "flight":{
        "distance": 40,
        "type": "DomesticFlight"
    },
    "motorBike": {
        "type": "SmallMotorBike",
        "distance": 400
    },
    "publicTransport": {
        "distance": 20,
        "type": "Taxi"
    }
}
*/