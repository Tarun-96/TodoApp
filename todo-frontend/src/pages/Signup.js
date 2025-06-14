import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Signup({ onSignup }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const [error, setError] = useState('');
  const navigate = useNavigate();
  

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
    //   const res = await axios.post('http://localhost:3001/auth/signup', formData);
     
      const loginRes = await axios.post('http://localhost:3001/auth/login', { email: formData.email, password: formData.password });
      localStorage.setItem('jwt_token', loginRes.data.token);
      onSignup && onSignup(loginRes.data.user);
      navigate("/login");
      alert('Signup successful! Please log in.');
      
    } catch (err) {
      setError(err.response?.data?.error || 'Signup failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: 'auto', padding: 20 }}>
      <h2>Sign Up</h2>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <input
        type="text"
        name="name"
        placeholder="Name"
        value={formData.name}
        onChange={handleChange}
        required
        style={{ display: 'block', width: '100%', marginBottom: 10 }}
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        required
        style={{ display: 'block', width: '100%', marginBottom: 10 }}
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        required
        style={{ display: 'block', width: '100%', marginBottom: 10 }}
      />
      <button type="submit">Sign Up</button>
    </form>
  );
}

export default Signup;