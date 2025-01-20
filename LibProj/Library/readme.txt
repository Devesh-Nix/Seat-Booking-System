Key Features:
1. Multiple Slots Management:

2. The seatsBySlot object separates seat data for each slot (8am-4pm, 4pm-12am, and 12am-8am).
   Seat Rendering:

3. Seats for the current slot are rendered dynamically using renderSeats().
   Different states for seats (not-selected, selected, booked) are visually distinguished.
   Booking System:

4. A booking form collects user details (name, contact, email, and Aadhaar) when a seat is selected.
   Booked seats are assigned a unique booking ID and marked as booked.
   Checkout Process:

5.  A booked seat can be checked out, which resets its status to not-selected and removes booking details.
    Checkout includes a summary showing session duration and other details.
    Slot Switching:

6.  Allows switching between time slots. Each slot's seat statuses are managed independently.
    Clear Selection:

7.  Deselects any selected seat and clears the booking summary.