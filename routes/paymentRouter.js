// paymentRouter.js 
//Importing modules/packages
const express = require("express");

//Instatiating the app
const router = express.Router();

//Importing controllers
const paymentController = require('../controllers/paymentController.js');

//Importing middleware


//Donation Payment Routes
router.get('/get-donation-history/:userId', paymentController.getDonationHistoryByUser);
router.get('/get-lifetime-donation/:userId', paymentController.getLifetimeDonationByUser);
router.get('/get-average-donation/:userId', paymentController.getAverageDonationByUser);
router.get('/get-number-of-donations/:userId', paymentController.getNumberOfDonationsByUser);
router.post('/create-payment-intent', paymentController.createPaymentIntent);
router.post('/save-customer-payments', paymentController.saveCustomerPayments);

module.exports = router; // Export the router