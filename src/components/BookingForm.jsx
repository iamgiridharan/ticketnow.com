import React, { useState } from 'react';

const BookingForm = ({ event, onBook }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    tickets: ''
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: ''
    }));
    setSuccessMessage('');
  };

  const validate = () => {
    const validationErrors = {};
    const name = formData.name.trim();
    const email = formData.email.trim();
    const department = formData.department.trim();
    const rawTickets = formData.tickets.toString().trim();
    const tickets = Number(rawTickets);
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name) {
      validationErrors.name = 'Name is required.';
    }

    if (!email) {
      validationErrors.email = 'Email is required.';
    } else if (!emailPattern.test(email)) {
      validationErrors.email = 'Email must be a valid address.';
    }

    if (!department) {
      validationErrors.department = 'Department is required.';
    }

    if (!rawTickets) {
      validationErrors.tickets = 'Number of tickets is required.';
    } else if (Number.isNaN(tickets) || tickets <= 0) {
      validationErrors.tickets = 'Tickets must be a positive number.';
    } else if (!Number.isInteger(tickets)) {
      validationErrors.tickets = 'Please enter a whole number of tickets.';
    } else if (tickets > event.availableTickets) {
      validationErrors.tickets = `Only ${event.availableTickets} tickets available.`;
    }

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    const ticketCount = Number(formData.tickets);
    const bookingData = {
      ...formData,
      tickets: ticketCount
    };

    onBook(ticketCount, bookingData);
    setFormData({ name: '', email: '', department: '', tickets: '' });
    setErrors({});
    setSuccessMessage(`Successfully booked ${ticketCount} ticket(s)!`);
  };

  return (
    <div>
      <h2>Booking Form</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Name:
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </label>
          {errors.name && <p style={{ color: 'red' }}>{errors.name}</p>}
        </div>

        <div>
          <label>
            Email:
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </label>
          {errors.email && <p style={{ color: 'red' }}>{errors.email}</p>}
        </div>

        <div>
          <label>
            Department:
            <input
              type="text"
              name="department"
              value={formData.department}
              onChange={handleChange}
            />
          </label>
          {errors.department && <p style={{ color: 'red' }}>{errors.department}</p>}
        </div>

        <div>
          <label>
            Number of Tickets:
            <input
              type="number"
              name="tickets"
              value={formData.tickets}
              onChange={handleChange}
              min="1"
            />
          </label>
          {errors.tickets && <p style={{ color: 'red' }}>{errors.tickets}</p>}
        </div>

        <button type="submit">Submit Booking</button>
      </form>
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
    </div>
  );
};

export default BookingForm;
