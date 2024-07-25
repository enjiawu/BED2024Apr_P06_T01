// Initialize Stripe.js
const stripe = Stripe('pk_test_51PafdERucNRVvUvRpdPvjSLNivtwutwBMPlLM9fxBbDKXw4OiqkMsgfQV5fjO9xOA0Nsw0cdEH5PF2vyuPZnsvjI00tTy2FDsg'); // Replace with your Stripe publishable key
const elements = stripe.elements();
const cardElement = elements.create('card');
cardElement.mount('#card-element');

const form = document.getElementById('payment-form');
form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const email = form.email.value;
  const name = form.name.value;
  const organization = form.organization.value;
  const amount = form.amount.value * 100;

  // Create a PaymentIntent on the stripe server
  const response = await fetch('/payment/create-payment-intent', {
    method: 'POST',
    
    
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email: email,
      name: name,
      amount: amount, // Amount in cents
      organization: organization
    })
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  const data = await response.json();
  const { clientSecret, customerId } = data;
  
  if (!clientSecret) {
    throw new Error('Missing client_secret from server response');
  }

  // Confirm the payment
  const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
    payment_method: {
      card: cardElement,
      billing_details: {
        name: name,
        email: email,
      }
    }
  });

  if (error) {
    // Display error.message in your UI
    document.getElementById('card-errors').textContent = error.message;
  } else if (paymentIntent.status === 'succeeded') {
    // Show a success message to your customer
    alert('Payment successful!');
    form.reset();
    displayFeedback('Thank you for your donation!', 'success')
    await saveCustomerPayments();
  }
});

const saveCustomerPayments = async () => {
  try {
    const response = await fetch('/payment/save-customer-payments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Error:', error.error);
      throw new Error(error.error);
    }

    if (response.ok) {
      const data = await response.json();
      console.log(data.message);
    } else {
      const error = await response.json();
      console.error('Error:', error.message);
    }
  } catch (error) {
    console.error('Error:', error);
  }
};


function displayFeedback(message, type) {
  const feedbackElement = document.getElementById('feedback');
  feedbackElement.innerText = message;
  feedbackElement.classList.remove('error', 'success');
  if (type === 'error') {
      feedbackElement.classList.remove('text-success');
      feedbackElement.classList.add('text-danger');    
  } else if (type === 'success') {
      feedbackElement.classList.remove('text-danger');
      feedbackElement.classList.add('text-success');
  }
}

saveCustomerPayments();