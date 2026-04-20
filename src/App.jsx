import React, { useState, useEffect } from 'react';
import EventDetails from './components/EventDetails';
import BookingForm from './components/BookingForm';
import BookingSummary from './components/BookingSummary';
import './App.css';

function App() {
  const [events, setEvents] = useState([
    {
      id: 1,
      name: 'Tech Conference 2024',
      department: 'Technology',
      date: '2024-06-15',
      time: '10:00 AM',
      venue: 'Convention Center',
      price: 50,
      availableTickets: 100,
      category: 'Conference'
    },
    {
      id: 2,
      name: 'Summer Music Festival',
      department: 'Entertainment',
      date: '2024-07-20',
      time: '6:00 PM',
      venue: 'Central Park',
      price: 75,
      availableTickets: 500,
      category: 'Concert'
    },
    {
      id: 3,
      name: 'Jazz Night Live',
      department: 'Music',
      date: '2024-05-10',
      time: '8:00 PM',
      venue: 'Blue Moon Theater',
      price: 40,
      availableTickets: 200,
      category: 'Concert'
    },
    {
      id: 4,
      name: 'Art & Design Expo',
      department: 'Arts',
      date: '2024-08-05',
      time: '9:00 AM',
      venue: 'Modern Art Gallery',
      price: 30,
      availableTickets: 300,
      category: 'Exhibition'
    }
  ]);

  const [selectedEvent, setSelectedEvent] = useState(events[0]);
  const [booked, setBooked] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const bookTickets = async (numTickets, userData) => {
    try {
      const bookingData = {
        name: userData.name,
        email: userData.email,
        department: userData.department,
        numberOfTickets: numTickets
      };

      const response = await fetch('http://localhost:9090/api/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(bookingData)
      });

      if (!response.ok) {
        throw new Error('Booking failed');
      }

      const result = await response.json();

      if (result.success) {
        setSelectedEvent(prevEvent => ({
          ...prevEvent,
          availableTickets: result.remainingTickets
        }));
        setBookingDetails({ ...userData, tickets: numTickets });
        setBooked(true);
      } else {
        alert('Booking Error: ' + result.message);
      }
    } catch (err) {
      console.error('Error booking tickets:', err);
      alert('Failed to book tickets. Please try again.');
    }
  };

  return (
    <div className="App" style={{
      '--mouse-x': `${mousePos.x}px`,
      '--mouse-y': `${mousePos.y}px`
    }}>
      <div className="animated-bg"></div>
      
      <header className="header">
        <div className="logo-container">
          <h1 className="logo">🎫 TicketNow</h1>
          <p className="tagline">Your Gateway to Amazing Events</p>
        </div>
      </header>

      <div className="container">
        <div className="events-sidebar">
          <h2>Featured Events</h2>
          <div className="events-list">
            {events.map(event => (
              <div 
                key={event.id}
                className={`event-card-small ${selectedEvent.id === event.id ? 'active' : ''}`}
                onClick={() => {
                  setSelectedEvent(event);
                  setBooked(false);
                }}
              >
                <div className="event-badge">{event.category}</div>
                <h3>{event.name}</h3>
                <p className="event-date">{event.date}</p>
                <p className="event-price">${event.price}</p>
              </div>
            ))}
          </div>
        </div>

        <main className="main-content">
          {booked && bookingDetails ? (
            <BookingSummary bookingDetails={bookingDetails} event={selectedEvent} />
          ) : (
            <>
              <div className="event-showcase">
                <EventDetails event={selectedEvent} />
              </div>
              <div className="booking-section">
                <BookingForm event={selectedEvent} onBook={bookTickets} />
              </div>
            </>
          )}
        </main>
      </div>

      <footer className="footer">
        <p>&copy; 2024 TicketNow. All rights reserved. | Experience the Magic ✨</p>
      </footer>
    </div>
  );
}

export default App;