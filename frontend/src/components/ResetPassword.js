import React, { useState } from 'react';
import { confirmPasswordReset } from '../services/api';
import { useParams, useNavigate } from 'react-router-dom';

function ResetPassword() {
  const { uid, token } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      await confirmPasswordReset(uid, token, newPassword);
      alert('Password has been reset successfully!');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || 'This reset link is invalid or has expired.');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Reset Your Password</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <br /><br />
        <input
          type="password"
          placeholder="Confirm New Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <br /><br />
        <button type="submit">Reset Password</button>
      </form>
    </div>
  );
}

export default ResetPassword;
