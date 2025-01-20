// Time slot definitions
const slots = ['8am-4pm', '4pm-12am', '12am-8am'];

// Total number of seats per slot
const Seats = 30;

// Separate seat data for each time slot
const seatsBySlot = {
  '8am-4pm': Array.from({ length: Seats }, (_, i) => ({
    id: i + 1, // Seat ID
    status: 'not-selected', // Initial status of each seat
    booking: null, // Booking details for the seat (null if not booked)
  })),
  '4pm-12am': Array.from({ length: Seats }, (_, i) => ({
    id: i + 1,
    status: 'not-selected',
    booking: null,
  })),
  '12am-8am': Array.from({ length: Seats }, (_, i) => ({
    id: i + 1,
    status: 'not-selected',
    booking: null,
  })),
};

// Default slot and seat selection variables
let currentSlot = '8am-4pm';
let selectedSeat = null; // Currently selected seat
let selectedSlot = currentSlot;

// DOM elements
const seatGrid = document.getElementById('seatGrid'); // Container for seat grid
const summaryContent = document.getElementById('summaryContent'); // Booking summary
const bookingForm = document.getElementById('bookingForm'); // Booking form overlay
const overlay = document.getElementById('overlay'); // Overlay for the booking form

// Function to render seats for the current slot
function renderSeats() {
  seatGrid.innerHTML = ''; // Clear existing seat elements

  // Get seats for the current slot
  const currentSeats = seatsBySlot[currentSlot];

  // Create a div element for each seat
  currentSeats.forEach(seat => {
    const seatDiv = document.createElement('div');
    seatDiv.className = `seat ${seat.status}`; // Add class based on seat status
    seatDiv.innerText = seat.id; // Display seat ID

    // If seat is booked, add hover effect with "Checkout" button
    if (seat.status === 'booked') {
      const checkoutButton = document.createElement('button');
      checkoutButton.innerText = 'Checkout';
      checkoutButton.className = 'checkout-btn';
      checkoutButton.style.display = 'none';

      // Add button to the seat div
      seatDiv.appendChild(checkoutButton);

      // Show/hide the button on hover
      seatDiv.addEventListener('mouseenter', () => {
        checkoutButton.style.display = 'block';
      });
      seatDiv.addEventListener('mouseleave', () => {
        checkoutButton.style.display = 'none';
      });

      // Add click event for checkout button
      checkoutButton.addEventListener('click', () => handleCheckout(seat));
    }

    // Add click event to handle seat selection
    seatDiv.addEventListener('click', () => handleSeatClick(seat));

    // Append the seat div to the seat grid
    seatGrid.appendChild(seatDiv);
  });
}

// Handles seat selection logic
function handleSeatClick(seat) {
  if (seat.status === 'booked') {
    // If seat is booked, display booking summary
    displaySummary(seat);
  } else if (seat.status === 'not-selected') {
    // If seat is available, mark it as selected
    selectedSeat = seat;
    seat.status = 'selected';
    renderSeats(); // Re-render seats to update UI
    openBookingForm(); // Open the booking form
  }
}

// Displays booking summary for a booked seat
function displaySummary(seat) {
  if (seat.booking) {
    summaryContent.innerHTML = `
      <strong>Booking ID:</strong> ${seat.booking.id}<br>
      <strong>Name:</strong> ${seat.booking.name}<br>
      <strong>Contact:</strong> ${seat.booking.contact}<br>
      <strong>Email:</strong> ${seat.booking.email}<br>
      <strong>Aadhaar:</strong> XXXX-XXXX-${seat.booking.aadhaar.slice(-4)}<br><br>
      <strong>Slot:</strong> ${currentSlot}<br>
      <strong>Date:</strong> ${seat.booking.date}<br>
      <strong>Time:</strong> ${seat.booking.time}
    `;
  }
}

// Opens the booking form overlay
function openBookingForm() {
  bookingForm.classList.add('active'); // Show the form
  overlay.classList.add('active'); // Show the overlay
}

// Closes the booking form overlay
function closeBookingForm() {
  bookingForm.classList.remove('active'); // Hide the form
  overlay.classList.remove('active'); // Hide the overlay
}

// Handles the checkout process
function handleCheckout(seat) {
  const now = new Date();
  const checkoutDate = now.toISOString().split('T')[0]; // Current date
  const checkoutTime = now.toTimeString().split(' ')[0]; // Current time

  const bookingTime = new Date(`${seat.booking.date}T${seat.booking.time}`);
  const totalDuration = Math.round((now - bookingTime) / (1000 * 60)); // Session duration in minutes

  // Display checkout summary
  alert(`
    Checkout Summary:

    - Booking ID: ${seat.booking.id}
    - Booking Date: ${seat.booking.date}
    - Booking Time: ${seat.booking.time}
    - Checkout Date: ${checkoutDate}
    - Checkout Time: ${checkoutTime}
    - Session Time: ${totalDuration} minutes
  `);

  // Make the seat available again
  seat.status = 'not-selected';
  seat.booking = null;
  renderSeats(); // Re-render seats to reflect changes
}

// Booking form submission handler
document.getElementById('submitBooking').addEventListener('click', () => {
  const name = document.getElementById('userName').value;
  const contact = document.getElementById('userContact').value;
  const email = document.getElementById('userEmail').value;
  const aadhaar = document.getElementById('userAadhaar').value;

  if (name && contact && email && aadhaar) {
    const now = new Date();
    const bookingDate = now.toISOString().split('T')[0];
    const bookingTime = now.toTimeString().split(' ')[0];

    // Save booking details to the selected seat
    selectedSeat.status = 'booked';
    selectedSeat.booking = {
      id: `BKG${String(selectedSeat.id).padStart(3, '0')}`, // Unique booking ID
      name,
      contact,
      email,
      aadhaar,
      date: bookingDate,
      time: bookingTime,
    };
    renderSeats(); // Re-render seats to reflect booking
    closeBookingForm(); // Close the booking form
  } else {
    alert('Please fill in all details.');
  }
});

// Handles slot selection
// Allows switching between different time slots
document.getElementById('slotContainer').addEventListener('click', (e) => {
  if (e.target.classList.contains('slot')) {
    // Deselect previously selected slot
    document.querySelectorAll('.slot').forEach(slot => slot.classList.remove('selected'));

    // Mark clicked slot as selected
    e.target.classList.add('selected');
    switchSlot(e.target.dataset.slot);
  }
});

// Switches the current slot and re-renders the seat grid
function switchSlot(slot) {
  currentSlot = slot;
  selectedSlot = slot;
  selectedSeat = null; // Reset selected seat
  renderSeats(); // Re-render seats for the new slot
}

// Close the booking form when clicking the overlay
overlay.addEventListener('click', closeBookingForm);

// Initialize the first slot's seats
renderSeats();

// Clear selection functionality
document.getElementById('clearSelection').addEventListener('click', () => {
  if (selectedSeat) {
    selectedSeat.status = 'not-selected'; // Reset seat status to not-selected
    selectedSeat = null; // Reset the selected seat
    renderSeats(); // Re-render seats to reflect changes
  }

  // Deselect any selected slot
  document.querySelectorAll('.slot').forEach(slot => slot.classList.remove('selected'));

  // Reset the booking summary text
  summaryContent.textContent = 'Select a seat to view details.';
});
