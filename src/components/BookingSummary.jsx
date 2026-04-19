import React from 'react';

const BookingSummary = ({ bookingDetails, event }) => {
  const totalAmount = bookingDetails.tickets * event.price;

  return (
    <div>
      <h2>Booking Confirmed</h2>
      <p><strong>User Name:</strong> {bookingDetails.name}</p>
      <p><strong>Email:</strong> {bookingDetails.email}</p>
      <p><strong>Department:</strong> {bookingDetails.department}</p>
      <p><strong>Event Name:</strong> {event.name}</p>
      <p><strong>Number of Tickets:</strong> {bookingDetails.tickets}</p>
      <p><strong>Total Amount:</strong> ${totalAmount}</p>
    </div>
  );
};

export default BookingSummary;