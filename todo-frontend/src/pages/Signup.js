import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Avatar, Button, TextField, Typography, Alert } from '@mui/material';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Signup.css';

function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.name.trim() || !form.email.trim() || !form.password.trim()) {
      setError('All fields are required');
      return;
    }
    try {
      await axios.post('http://localhost:3001/auth/signup', form);
      toast.success('Signup successful! Redirecting to login...', { autoClose: 1500 });
      setTimeout(() => navigate('/login'), 1600);
    } catch (err) {
      setError(err.response?.data?.error || 'Signup failed');
    }
  };

  return (
    <div className="auth-container">
      <ToastContainer />
      <div className="auth-paper">
        <Avatar className="auth-avatar">
          <PersonAddAltIcon />
        </Avatar>
        <Typography component="h1" variant="h5" className="auth-title">
          Sign Up
        </Typography>
        {error && <Alert severity="error" style={{ width: '100%' }}>{error}</Alert>}
        <form className="auth-form" noValidate onSubmit={handleSubmit}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="name"
            label="Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            value={form.email}
            onChange={handleChange}
            autoComplete="email"
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            value={form.password}
            onChange={handleChange}
            autoComplete="new-password"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            style={{ marginTop: 24, marginBottom: 8 }}
          >
            Sign Up
          </Button>
          <div className="auth-link">
            <Link to="/login">
              <Button variant="text">Already have an account? Login</Button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;