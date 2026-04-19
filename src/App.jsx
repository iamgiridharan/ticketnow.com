import React, { useState } from 'react';
import EventDetails from './components/EventDetails';
import BookingForm from './components/BookingForm';
import BookingSummary from './components/BookingSummary';
import './App.css';

function App() {
  const [event, setEvent] = useState({
    name: 'Tech Conference 2023',
    department: 'Computer Science',
    date: '2023-10-15',
    time: "10:00 AM",
    venue: 'Convention Center',
    price: 50,
    availableTickets: 100
  });
  const [booked, setBooked] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);

  const bookTickets = (numTickets, userData) => {
    setEvent(prevEvent => ({
      ...prevEvent,
      availableTickets: prevEvent.availableTickets - numTickets
    }));
    setBookingDetails({ ...userData, tickets: numTickets });
    setBooked(true);
  };

  return (
    <div className="App">
      <h1>Ticket Booking App</h1>
      <EventDetails event={event} />
      {booked && bookingDetails ? (
        <BookingSummary bookingDetails={bookingDetails} event={event} />
      ) : (
        <BookingForm event={event} onBook={bookTickets} />
      )}
    </div>
  );
}

export default App;