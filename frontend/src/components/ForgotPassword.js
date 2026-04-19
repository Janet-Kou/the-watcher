import React, { useState } from 'react';
import { requestPasswordReset } from '../services/api';
import { Link } from 'react-router-dom';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await requestPasswordReset(email);
    } catch (err) {
      // Still show success message to avoid revealing whether email exists
    }
    setSubmitted(true);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Forgot My Password</h2>
      {submitted ? (
        <div>
          <p>If an account with that email exists, a reset link has been sent.</p>
          <p>Check the Django terminal for the email.</p>
          <Link to="/login">Back to Login</Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <br /><br />
          <button type="submit">Send Reset Link</button>
          <br /><br />
          <Link to="/login">Back to Login</Link>
        </form>
      )}
    </div>
  );
}

export default ForgotPassword;
