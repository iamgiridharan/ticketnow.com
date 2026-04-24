import React from 'react';

const BookingSummary = ({ bookingDetails, event, onReset }) => {
  const totalAmount = bookingDetails.tickets * event.price;

  return (
    <div className="booking-summary">
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <span style={{ fontSize: '3rem' }}>🎉</span>
        <h2 style={{ marginTop: '12px' }}>Booking Confirmed!</h2>
        <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>
          Your tickets have been successfully booked.
        </p>
      </div>

      <div className="summary-details">
        <p><strong>User Name:</strong> {bookingDetails.name}</p>
        <p><strong>Email:</strong> {bookingDetails.email}</p>
        <p><strong>Department:</strong> {bookingDetails.department}</p>
        <p><strong>Event Name:</strong> {event.name}</p>
        <p><strong>Number of Tickets:</strong> {bookingDetails.tickets}</p>
        <p><strong>Total Amount:</strong> ${totalAmount}</p>
      </div>

      <button
        onClick={onReset}
        style={{ marginTop: '28px' }}
      >
        🔄 Book Another Ticket
      </button>
    </div>
  );
};

export default BookingSummary;