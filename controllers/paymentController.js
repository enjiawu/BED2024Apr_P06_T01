const stripe = require('stripe')(process.env.STRIPE_SK); 
const Payment = require('../models/payment');
require("dotenv").config(); // Import dotenv package to read environment variables
//Create Payment Intent on stripe
const createPaymentIntent = async (req, res) => {
  const { email, name, amount, organization } = req.body;

  try {
    // Retrieve customers with the given email
    const existingCustomers = await stripe.customers.list({
      email: email,
      limit: 1
    });

    let customer;
    if (existingCustomers.data.length > 0) {
      // Use the existing customer
      customer = existingCustomers.data[0];
    } else {
      // Create a new customer
      customer = await stripe.customers.create({
        email: email,
        name: name,
      });
    }

    // Create a PaymentIntent with the donation details
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount, // Amount in cents (e.g., 2000 for $20.00)
      currency: 'usd',
      customer: customer.id,
      metadata: {
        organization: organization,
        description: 'Donation for a specific cause'
      }
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      customerId: customer.id
    });
  } catch (error) {
    console.error('Error creating PaymentIntent:', error);
    res.status(500).json({ error: error.message });
  }
};
//Get all customer ids
const getAllCustomerIds = async () => {
  try {
    const customers = [];
    let startingAfter = null;

    do {
      const response = await stripe.customers.list({
        limit: 100, // Adjust limit as needed
        starting_after: startingAfter || undefined
      });

      customers.push(...response.data);
      startingAfter = response.data.length > 0 ? response.data[response.data.length - 1].id : null;
    } while (startingAfter);

    return customers.map(customer => customer.id);
  } catch (error) {
    console.error('Error fetching customer IDs from Stripe:', error);
    throw error;
  }
};
//Get payment details by customer
const getPaymentDetailsByCustomer = async (customerId) => {
  try {
    const paymentIntents = await stripe.paymentIntents.list({
      customer: customerId,
      limit: 100, // Adjust the limit as necessary
    });

    const customer = await stripe.customers.retrieve(customerId);

    return paymentIntents.data.map((paymentIntent) => ({
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      customer: paymentIntent.customer,
      email: customer.email,
      name: customer.name,
      organization: paymentIntent.metadata.organization || 'Unknown',
      status: paymentIntent.status,
      time: paymentIntent.created
    }));
  } catch (error) {
    console.error('Error retrieving payment intents:', error);
    throw error;
  }
};

//Get all payment details
const getAllPaymentDetails = async () => {
  try {
    const customerIds = await getAllCustomerIds();
    const paymentDetailsPromises = customerIds.map(id => getPaymentDetailsByCustomer(id));
    const allPaymentDetails = await Promise.all(paymentDetailsPromises);

    // Flatten the array of arrays
    return allPaymentDetails.flat();
  } catch (error) {
    console.error('Error retrieving all payment details:', error);
    throw error;
  }
};
//Timestamp conversion
const convertUnixTimestamp = (timestamp) => {
  const date = new Date(timestamp * 1000); // Multiply by 1000 to convert seconds to milliseconds
  return date.toISOString(); // Format to ISO 8601 string
};
//Save customer payments
const saveCustomerPayments = async (req, res) => {
  try {
    // Retrieve all customer IDs
    const customerIds = await getAllCustomerIds();

    // Fetch and save payment details for each customer
    for (const customerId of customerIds) {
      const paymentDetailsList = await getPaymentDetailsByCustomer(customerId);

      for (const paymentDetails of paymentDetailsList) {
        const formattedPaymentDetails = {
          customer: paymentDetails.customer,
          amount: paymentDetails.amount,
          currency: paymentDetails.currency,
          email: paymentDetails.email || 'Unknown',
          name: paymentDetails.name || 'Unknown',
          organization: paymentDetails.organization || 'Unknown',
          status: paymentDetails.status,
          time: convertUnixTimestamp(paymentDetails.time)
        };

        await Payment.savePaymentDetails(formattedPaymentDetails);
      }
    }

    res.status(200).json({ message: 'All customer payment details saved successfully' });
  } catch (error) {
    console.error('Error saving all customer payment details:', error);
    res.status(500).json({ error: error.message });
  }
};
//Retrieve donation history by user
const getDonationHistoryByUser = async (req, res) => {
  const userId = parseInt(req.params.userId);
  try {
    const donationHistory = await Payment.getDonationHistorybyUser(userId);
    res.json(donationHistory);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving donation history.");
  }
};
// Retrieve lifetime donation by user
const getLifetimeDonationByUser = async (req, res) => {
  const userId = parseInt(req.params.userId);
  try {
    const lifetimeDonation = await Payment.getLifetimeDonationByUser(userId);
    res.json(lifetimeDonation);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving lifetime donation.");
  }
};
// Retrieve average donation by user
const getAverageDonationByUser = async (req, res) => {
  const userId = parseInt(req.params.userId);
  try {
    const averageDonation = await Payment.getAverageDonationByUser(userId);
    res.json(averageDonation);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving average donation.");
  }
};
//Get number of donations by user
const getNumberOfDonationsByUser = async (req, res) => {
  const userId = parseInt(req.params.userId);
  try {
    const numberofDonations = await Payment.getNumberOfDonationsByUser(userId);
    res.json(numberofDonations);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving number of donations.");
  }
};

module.exports = {
  createPaymentIntent,
  getAllCustomerIds,
  saveCustomerPayments,
  getAllPaymentDetails,
  getDonationHistoryByUser,
  getLifetimeDonationByUser,
  getAverageDonationByUser,
  getNumberOfDonationsByUser
};
