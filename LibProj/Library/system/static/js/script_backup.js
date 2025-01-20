const slots = ['8am-4pm', '4pm-12am', '12am-8am'];

// Separate seat data for each slot
const Seats = 30;
const seatsBySlot = {
  '8am-4pm': Array.from({ length: Seats }, (_, i) => ({
    id: i + 1,
    status: 'not-selected',
    booking: null,
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

let currentSlot = '8am-4pm';
let selectedSeat = null;
let selectedSlot = currentSlot;

const seatGrid = document.getElementById('seatGrid');
const summaryContent = document.getElementById('summaryContent');
const bookingForm = document.getElementById('bookingForm');
const overlay = document.getElementById('overlay');

// Renders the seats for the current slot
function renderSeats() {
  seatGrid.innerHTML = '';
  const currentSeats = seatsBySlot[currentSlot];
  currentSeats.forEach(seat => {
    const seatDiv = document.createElement('div');
    seatDiv.className = `seat ${seat.status}`;
    seatDiv.innerText = seat.id;

    if (seat.status === 'booked') {
      // Add hover effect with "Checkout" button
      const checkoutButton = document.createElement('button');
      checkoutButton.innerText = 'Checkout';
      checkoutButton.className = 'checkout-btn';
      checkoutButton.style.display = 'none';

      seatDiv.appendChild(checkoutButton);
      seatDiv.addEventListener('mouseenter', () => {
        checkoutButton.style.display = 'block';
      });
      seatDiv.addEventListener('mouseleave', () => {
        checkoutButton.style.display = 'none';
      });

      // Handle checkout logic
      checkoutButton.addEventListener('click', () => handleCheckout(seat));
    }

    // Make seats clickable
    seatDiv.addEventListener('click', () => handleSeatClick(seat));
    seatGrid.appendChild(seatDiv);
  });

  
}

// Handles seat selection logic
function handleSeatClick(seat) {
  if (seat.status === 'booked') {
    displaySummary(seat);
  } else if (seat.status === 'not-selected') {
    selectedSeat = seat;
    seat.status = 'selected'; // Mark seat as selected
    renderSeats(); // Re-render to update styles
    openBookingForm();
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

// Opens the booking form
function openBookingForm() {
  bookingForm.classList.add('active');
  overlay.classList.add('active');
}

// Closes the booking form
function closeBookingForm() {
  bookingForm.classList.remove('active');
  overlay.classList.remove('active');
}

function handleCheckout(seat) {
  const now = new Date();
  const checkoutDate = now.toISOString().split('T')[0];
  const checkoutTime = now.toTimeString().split(' ')[0];

  const bookingTime = new Date(`${seat.booking.date}T${seat.booking.time}`);
  const totalDuration = Math.round((now - bookingTime) / (1000 * 60)); // in minutes

  // Display the checkout summary
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
  renderSeats();
}

function searchSeatByNumber(seatNumber) {
  const seatElements = seatGrid.children; // All seat elements in the grid

  // Reset all highlights
  Array.from(seatElements).forEach(el => el.classList.remove('highlighted'));

  // Validate seat number
  if (!seatNumber || seatNumber < 1 || seatNumber > Seats) {
    alert('Invalid Seat Number');
    return;
  }

  // Find the seat object
  const seat = seatsBySlot[currentSlot].find(s => s.id === seatNumber);
  if (!seat) {
    alert('Seat not found.');
  } else if (seat.status !== 'booked') {
    alert('Seat is not booked.');
  } else {
    // Highlight the seat
    const targetSeatElement = seatElements[seatNumber - 1];
    targetSeatElement.classList.add('highlighted');
    targetSeatElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}


// Booking form submission
document.getElementById('submitBooking').addEventListener('click', () => {
  const name = document.getElementById('userName').value;
  const contact = document.getElementById('userContact').value;
  const email = document.getElementById('userEmail').value;
  const aadhaar = document.getElementById('userAadhaar').value;

  if (name && contact && email && aadhaar) {
    // Get current date and time
    const now = new Date();
    const bookingDate = now.toISOString().split('T')[0]; // Format: YYYY-MM-DD
    const bookingTime = now.toTimeString().split(' ')[0]; // Format: HH:MM:SS

    // Save booking details
    selectedSeat.status = 'booked';
    selectedSeat.booking = {
      id: `BKG${String(selectedSeat.id).padStart(3, '0')}`,
      name,
      contact,
      email,
      aadhaar,
      date: bookingDate,
      time: bookingTime,
    };
    renderSeats();
    closeBookingForm();
  } else {
    alert('Please fill in all details.');
  }
});

// Handles slot selection
document.getElementById('slotContainer').addEventListener('click', (e) => {
  if (e.target.classList.contains('slot')) {
    document.querySelectorAll('.slot').forEach(slot => slot.classList.remove('selected'));
    e.target.classList.add('selected');
    switchSlot(e.target.dataset.slot);
  }
});

// Switches the current slot and resets the grid
function switchSlot(slot) {
  currentSlot = slot;
  selectedSlot = slot;
  selectedSeat = null; // Reset selected seat
  renderSeats();
}

// Close booking form when clicking the overlay
overlay.addEventListener('click', closeBookingForm);

// Initialize the first slot's seats
renderSeats();

// Clear Selection functionality
document.getElementById('clearSelection').addEventListener('click', () => {
  // Deselect the seat if any seat is selected
  if (selectedSeat) {
    selectedSeat.status = 'not-selected'; // Reset seat status to not-selected
    selectedSeat = null; // Reset the selected seat
    renderSeats(); // Re-render seats to reflect changes
  }

  // Deselect the slot if any slot is selected
  document.querySelectorAll('.slot').forEach(slot => slot.classList.remove('selected'));

  // Reset the booking summary text
  summaryContent.textContent = 'Select a seat to view details.';
});
