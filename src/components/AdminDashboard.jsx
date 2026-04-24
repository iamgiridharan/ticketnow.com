import React, { useState, useEffect } from 'react';

const AdminDashboard = ({ user, onLogout }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:9090/api/admin/stats');
      const data = await res.json();
      setStats(data);
    } catch {
      setError('Failed to load stats. Is the backend running?');
    }
    setLoading(false);
  };

  useEffect(() => { fetchStats(); }, []);

  return (
    <div className="admin-page">
      {/* Header */}
      <header className="admin-header">
        <div className="admin-logo">🎫 TicketNow <span className="admin-badge">Admin</span></div>
        <div className="admin-user-info">
          <span>👤 {user.username}</span>
          <button className="logout-btn" onClick={onLogout}>Logout</button>
        </div>
      </header>

      <div className="admin-container">
        <h2 className="admin-page-title">📊 Dashboard</h2>

        {loading && <p className="admin-loading">Loading stats...</p>}
        {error && <p className="auth-error">{error}</p>}

        {stats && (
          <>
            {/* Stats Cards */}
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">📋</div>
                <div className="stat-value">{stats.totalBookings}</div>
                <div className="stat-label">Total Bookings</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">🎟️</div>
                <div className="stat-value">{stats.totalTicketsSold}</div>
                <div className="stat-label">Tickets Sold</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">💰</div>
                <div className="stat-value">${stats.totalRevenue.toFixed(2)}</div>
                <div className="stat-label">Total Revenue</div>
              </div>
            </div>

            {/* Event Availability */}
            <div className="admin-section">
              <h3>🎪 Event Ticket Availability</h3>
              <div className="event-availability-grid">
                {Object.entries(stats.availableTickets).map(([id, count]) => (
                  <div key={id} className="event-avail-card">
                    <div className="event-avail-name">{stats.eventNames[id]}</div>
                    <div className={`event-avail-count ${count < 50 ? 'low' : ''}`}>{count} left</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bookings Table */}
            <div className="admin-section">
              <div className="section-header">
                <h3>📝 All Bookings</h3>
                <button className="refresh-btn" onClick={fetchStats}>↻ Refresh</button>
              </div>
              {stats.bookings.length === 0 ? (
                <p className="no-data">No bookings yet.</p>
              ) : (
                <div className="table-wrapper">
                  <table className="bookings-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Department</th>
                        <th>Event</th>
                        <th>Tickets</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.bookings.map((b, i) => (
                        <tr key={b.id}>
                          <td>{i + 1}</td>
                          <td>{b.name}</td>
                          <td>{b.email}</td>
                          <td>{b.department}</td>
                          <td>{b.eventName || 'N/A'}</td>
                          <td><span className="ticket-badge">{b.numberOfTickets}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
