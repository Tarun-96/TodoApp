import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Avatar, Button, TextField, Typography, Alert } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Login.css';

function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('http://localhost:3001/auth/login', form);
      localStorage.setItem('jwt_token', res.data.token);
      toast.success('Login successful!', { autoClose: 1500 });
      setTimeout(() => navigate('/'), 1600);
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="auth-container">
      <ToastContainer />
      <div className="auth-paper">
        <Avatar className="auth-avatar">
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5" className="auth-title">
          Login
        </Typography>
        {error && <Alert severity="error" style={{ width: '100%' }}>{error}</Alert>}
        <form className="auth-form" noValidate onSubmit={handleSubmit}>
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
            autoFocus
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
            autoComplete="current-password"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            style={{ marginTop: 24, marginBottom: 8 }}
          >
            Login
          </Button>
          <div className="auth-link">
            <Link to="/signup">
              <Button variant="text">Don't have an account? Sign Up</Button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;