import React from 'react';

const EventDetails = ({ event }) => {
  return (
    <div>
      <h2>Event Details</h2>
      <p><strong>Name:</strong> {event.name}</p>
      <p><strong>Department:</strong> {event.department}</p>
      <p><strong>Date:</strong> {event.date}</p>
      <p><strong>Time:</strong> {event.time}</p>
      <p><strong>Venue:</strong> {event.venue}</p>
      <p><strong>Price:</strong> ${event.price}</p>
      <p><strong>Available Tickets:</strong> {event.availableTickets}</p>
    </div>
  );
};

export default EventDetails;