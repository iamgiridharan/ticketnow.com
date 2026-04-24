import React, { useState } from 'react';

const SignupPage = ({ onSignupSuccess, onGoToLogin }) => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors(prev => ({ ...prev, [e.target.name]: '' }));
    setSuccess('');
  };

  const validate = () => {
    const errs = {};
    if (!formData.username.trim()) errs.username = 'Username is required.';
    if (!formData.email.trim()) errs.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errs.email = 'Invalid email format.';
    if (formData.password.length < 6) errs.password = 'Password must be at least 6 characters.';
    if (formData.password !== formData.confirm) errs.confirm = 'Passwords do not match.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await fetch('http://localhost:9090/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: formData.username, email: formData.email, password: formData.password }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess('Account created! Redirecting to login...');
        setTimeout(onSignupSuccess, 1500);
      } else {
        setErrors({ submit: data.message || 'Registration failed.' });
      }
    } catch {
      setErrors({ submit: 'Cannot reach server. Is the backend running?' });
    }
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">🎫</div>
        <h1 className="auth-title">TicketNow</h1>
        <p className="auth-subtitle">Create your account</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Username</label>
            <input type="text" name="username" value={formData.username} onChange={handleChange} placeholder="Choose a username" />
            {errors.username && <p className="field-error">{errors.username}</p>}
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter your email" />
            {errors.email && <p className="field-error">{errors.email}</p>}
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Min. 6 characters" />
            {errors.password && <p className="field-error">{errors.password}</p>}
          </div>
          <div className="form-group">
            <label>Confirm Password</label>
            <input type="password" name="confirm" value={formData.confirm} onChange={handleChange} placeholder="Repeat your password" />
            {errors.confirm && <p className="field-error">{errors.confirm}</p>}
          </div>

          {errors.submit && <p className="auth-error">⚠ {errors.submit}</p>}
          {success && <p className="auth-success">✓ {success}</p>}

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account →'}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account?{' '}
          <button className="auth-link-btn" onClick={onGoToLogin}>Sign In</button>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
