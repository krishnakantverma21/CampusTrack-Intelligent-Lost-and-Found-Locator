import React, { useState } from 'react';
import { login } from '../services/authService';
import '../styles/Auth.css';
import listImage from '../assets/ListF.png';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [passwordHash, setPasswordHash] = useState('');

  const handleLogin = async () => {
    try {
      const res = await login({ email, passwordHash });
      const user = res.data.user;

      localStorage.setItem('userEmail', user.email);
      localStorage.setItem('userRole', user.role);
      localStorage.setItem('userName', user.name);
      localStorage.setItem('profileImageUrl', user.profileImageUrl || '/assets/default-profile.png');

      alert(res.data.message);

      if (user.email === 'kkverma@university.edu') {
        window.location.href = '/admin';
      } else {
        window.location.href = '/dashboard';
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-illustration">
        <img src={listImage} alt="Login" />
      </div>
      <div className="auth-form">
        <h2>Welcome Back!</h2>
        <input
          type="email"
          placeholder="Your e-mail"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Your password"
          value={passwordHash}
          onChange={e => setPasswordHash(e.target.value)}
        />
        <button className="blue-btn" onClick={handleLogin}>
          Sign In
        </button>
        <p>
          Don't have an account? <a href="/signup">Create Account</a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;