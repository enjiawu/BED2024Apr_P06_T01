const form = document.getElementById('carbon-footprint-form'); // get the form element

form.addEventListener('submit', (e) => { 
    e.preventDefault();
    const carTravelSelected = document.getElementById('car-travel').value!== '0'; // check if car travel is selected
    const flightSelected = document.getElementById('flight').value!== '0'; // check if flight is selected
    const motorbikeSelected = document.getElementById('motorbike').value!== '0'; // check if motorbike is selected
    const publicTransitSelected = document.getElementById('public-transit').value!== '0'; // check if public transit is selected

    if (!(carTravelSelected || flightSelected || motorbikeSelected || publicTransitSelected)) { // check if at least one option is selected
      alert('Please select at least one option');
      return;
    }

    if (carTravelSelected && document.getElementById('car-travel-distance').value === '') { // check if distance is entered for car travel if they select the car travel option
      alert('Please enter distance for car travel'); 
      return;
    }

    if (flightSelected && document.getElementById('flight-travel-distance').value === '') { // check if distance is entered for flight if they select the flight option
      alert('Please enter distance for flight');
      return;
    }

    if (motorbikeSelected && document.getElementById('motorbike-travel-distance').value === '') { // check if distance is entered for motorbike if they select the motorbike option
      alert('Please enter distance for motorbike');
      return;
    }

    if (publicTransitSelected && document.getElementById('public-transit-travel-distance').value === '') { // check if distance is entered for public transit if they select the public transit option
      alert('Please enter distance for public transit');
      return;
    }

    // form is valid, submit it
    submitform();
});

async function submitform() {

    // Getting user inputs
    const typeOfCar = document.getElementById('car-travel').value != 0 ? document.getElementById('car-travel').value : null;
    const carTravelDistance = document.getElementById('car-travel-distance').value ? parseInt(document.getElementById('car-travel-distance').value) : 0;

    const typeOfFlight = document.getElementById('flight').value != 0 ? document.getElementById('flight').value : null;
    const flightDistance = document.getElementById('flight-travel-distance').value ? parseInt(document.getElementById('flight-travel-distance').value) : 0;

    const typeofMotorbike = document.getElementById('motorbike').value != 0 ? document.getElementById('motorbike').value : null;
    const motorbikeDistance = document.getElementById('motorbike-travel-distance').value ? parseInt(document.getElementById('motorbike-travel-distance').value) : 0;

    const typeOfPublicTransit = document.getElementById('public-transit').value != 0 ? document.getElementById('public-transit').value : null;
    const publicTransitDistance = document.getElementById('public-transit-travel-distance').value ? parseInt(document.getElementById('public-transit-travel-distance').value) : 0;
  
    const data = {
      carTravel: { distance: carTravelDistance, vehicle: typeOfCar },
      publicTransport: { distance: publicTransitDistance, type: typeOfPublicTransit },
      flight: { distance: flightDistance, type: typeOfFlight },
      motorBike: { distance: motorbikeDistance, type: typeofMotorbike }
    };
  
  try {
    const response = await fetch('/calculatecarbonfootprint', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const {individualCF, totalCarbonFootprint, treeEquivalent,  grade, tips, stats} = await response.json();

    // Pass the results to the output page
    localStorage.setItem('carbonFootprintOutput', JSON.stringify({individualCF, totalCarbonFootprint, treeEquivalent,  grade, tips, stats}));
    window.location.href = 'carbon-footprint-calculator-output.html';

  } catch (error) {
    console.error('Error calculating carbon footprint:', error);
  }
}
