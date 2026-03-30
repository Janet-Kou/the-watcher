import React, { useState } from 'react';
import { login } from '../services/api';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await login(credentials);
      // Save the tokens to local storage so the user stays logged in
      localStorage.setItem('token', response.data.access);
      localStorage.setItem('refresh', response.data.refresh);
      alert("Login Successful!");
      navigate('/'); // Send them to the Home/Search page
    } catch (err) {
      alert("Invalid username or password.");
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input type="text" placeholder="Username" 
          onChange={(e) => setCredentials({...credentials, username: e.target.value})} required />
        <br/><br/>
        <input type="password" placeholder="Password" 
          onChange={(e) => setCredentials({...credentials, password: e.target.value})} required />
        <br/><br/>
        <button type="submit">Log In</button>
      </form>
    </div>
  );
}

export default Login;