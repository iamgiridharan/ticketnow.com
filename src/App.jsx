import React, { useState, useEffect } from 'react';
import EventDetails from './components/EventDetails';
import BookingForm from './components/BookingForm';
import BookingSummary from './components/BookingSummary';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import AdminDashboard from './components/AdminDashboard';
import PaymentModal from './components/PaymentModal';
import './App.css';

const INITIAL_EVENTS = [
  { id: 1, name: 'Tech Conference 2024', department: 'Technology', date: '2024-06-15', time: '10:00 AM', venue: 'Convention Center', price: 50, availableTickets: 100, category: 'Conference' },
  { id: 2, name: 'Summer Music Festival', department: 'Entertainment', date: '2024-07-20', time: '6:00 PM', venue: 'Central Park', price: 75, availableTickets: 500, category: 'Concert' },
  { id: 3, name: 'Jazz Night Live', department: 'Music', date: '2024-05-10', time: '8:00 PM', venue: 'Blue Moon Theater', price: 40, availableTickets: 200, category: 'Concert' },
  { id: 4, name: 'Art & Design Expo', department: 'Arts', date: '2024-08-05', time: '9:00 AM', venue: 'Modern Art Gallery', price: 30, availableTickets: 300, category: 'Exhibition' },
];

function App() {
  const [page, setPage] = useState('login');
  const [currentUser, setCurrentUser] = useState(null);

  const [events, setEvents] = useState(INITIAL_EVENTS);
  const [selectedEvent, setSelectedEvent] = useState(INITIAL_EVENTS[0]);
  const [booked, setBooked] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Payment state
  const [paymentPending, setPaymentPending] = useState(false);
  const [pendingBookingData, setPendingBookingData] = useState(null);

  useEffect(() => {
    const handleMouseMove = (e) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // ── Fetch live ticket counts from backend ──────────────────
  const syncTicketCounts = async () => {
    try {
      const res = await fetch('http://localhost:9090/api/tickets');
      if (!res.ok) return;
      const counts = await res.json(); // { "1": 95, "2": 500, ... }
      setEvents(prev =>
        prev.map(ev => ({
          ...ev,
          availableTickets: counts[ev.id] !== undefined ? counts[ev.id] : ev.availableTickets,
        }))
      );
      // Also sync selected event
      setSelectedEvent(prev =>
        prev
          ? { ...prev, availableTickets: counts[prev.id] !== undefined ? counts[prev.id] : prev.availableTickets }
          : prev
      );
    } catch {
      // silently keep local state if backend unreachable
    }
  };

  const handleLogin = async (userData) => {
    setCurrentUser(userData);
    await syncTicketCounts(); // ← fix: always pull fresh counts on login
    setPage(userData.role === 'ADMIN' ? 'admin' : 'home');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setBooked(false);
    setBookingDetails(null);
    setPaymentPending(false);
    setPendingBookingData(null);
    setPage('login');
  };

  // ── Called when user clicks "Book Tickets" in the form ────
  const handleBookingFormSubmit = (numTickets, userData) => {
    setPendingBookingData({ numTickets, userData });
    setPaymentPending(true); // open payment modal
  };

  // ── Called after payment succeeds ─────────────────────────
  const handlePaymentSuccess = async () => {
    setPaymentPending(false);
    if (!pendingBookingData) return;
    await bookTickets(pendingBookingData.numTickets, pendingBookingData.userData);
    setPendingBookingData(null);
  };

  const handlePaymentCancel = () => {
    setPaymentPending(false);
    setPendingBookingData(null);
  };

  // ── Actual booking API call (runs AFTER payment) ──────────
  const bookTickets = async (numTickets, userData) => {
    try {
      const res = await fetch('http://localhost:9090/api/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: userData.name,
          email: userData.email,
          department: userData.department,
          numberOfTickets: numTickets,
          eventId: selectedEvent.id,
        }),
      });
      if (!res.ok) throw new Error('Booking failed');
      const result = await res.json();
      if (result.success) {
        // Update both selectedEvent and the events array
        setSelectedEvent(prev => ({ ...prev, availableTickets: result.remainingTickets }));
        setEvents(prev =>
          prev.map(ev =>
            ev.id === selectedEvent.id ? { ...ev, availableTickets: result.remainingTickets } : ev
          )
        );
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

  const resetBooking = () => {
    setBooked(false);
    setBookingDetails(null);
  };

  // ── Page routing ──────────────────────────────────────────
  if (page === 'login') return <LoginPage onLogin={handleLogin} onGoToSignup={() => setPage('signup')} />;
  if (page === 'signup') return <SignupPage onSignupSuccess={() => setPage('login')} onGoToLogin={() => setPage('login')} />;
  if (page === 'admin') return <AdminDashboard user={currentUser} onLogout={handleLogout} />;

  // ── Home (user booking page) ──────────────────────────────
  return (
    <div className="App" style={{ '--mouse-x': `${mousePos.x}px`, '--mouse-y': `${mousePos.y}px` }}>
      <div className="animated-bg"></div>

      {/* Payment Modal overlay */}
      {paymentPending && pendingBookingData && (
        <PaymentModal
          event={selectedEvent}
          tickets={pendingBookingData.numTickets}
          totalAmount={pendingBookingData.numTickets * selectedEvent.price}
          onSuccess={handlePaymentSuccess}
          onCancel={handlePaymentCancel}
        />
      )}

      <header className="header">
        <div className="logo-container">
          <h1 className="logo">🎫 TicketNow</h1>
          <p className="tagline">Your Gateway to Amazing Events</p>
        </div>
        <div className="header-user">
          <span className="header-username">👤 {currentUser?.username}</span>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </header>

      <div className="container">
        <div className="events-sidebar">
          <h2>Featured Events</h2>
          <div className="events-list">
            {events.map(event => (
              <div
                key={event.id}
                className={`event-card-small ${selectedEvent?.id === event.id ? 'active' : ''}`}
                onClick={() => { setSelectedEvent(event); setBooked(false); }}
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
            <BookingSummary bookingDetails={bookingDetails} event={selectedEvent} onReset={resetBooking} />
          ) : (
            <>
              <div className="event-showcase">
                <EventDetails event={selectedEvent} />
              </div>
              <div className="booking-section">
                <BookingForm event={selectedEvent} onBook={handleBookingFormSubmit} />
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