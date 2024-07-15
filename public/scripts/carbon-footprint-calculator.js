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

    if (flightSelected && document.getElementById('flight-distance').value === '') { // check if distance is entered for flight if they select the flight option
      alert('Please enter distance for flight');
      return;
    }

    if (motorbikeSelected && document.getElementById('motorbike-distance').value === '') { // check if distance is entered for motorbike if they select the motorbike option
      alert('Please enter distance for motorbike');
      return;
    }

    if (publicTransitSelected && document.getElementById('public-transit-distance').value === '') { // check if distance is entered for public transit if they select the public transit option
      alert('Please enter distance for public transit');
      return;
    }

    // form is valid, submit it
    form.submit();
});