import React, { useState } from 'react';
import { signup } from '../services/authService';
import PasswordStrengthMeter from '../components/PasswordStrengthMeter';
import RoleSelector from '../components/RoleSelector';
import '../styles/Auth.css';
import signupImage from '../assets/signup-illustration.png';

const SignupPage = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    passwordHash: '',
    role: 'student',
  });

  const isCampusEmail = (email) => email.endsWith('@university.edu');

  const handleSubmit = async () => {
    if (!isCampusEmail(form.email)) {
      alert('Use your campus email (@university.edu)');
      return;
    }
    try {
      const res = await signup(form);
      alert(res.data.message);
      window.location.href = '/';
    } catch (err) {
      alert(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-illustration">
        <img src={signupImage} alt="Signup" />
      </div>
      <div className="auth-form">
        <h2>Welcome!</h2>
        <input
          type="text"
          placeholder="Your name"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
        />
        <input
          type="email"
          placeholder="Your e-mail"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Create password"
          value={form.passwordHash}
          onChange={e => setForm({ ...form, passwordHash: e.target.value })}
        />
        <PasswordStrengthMeter password={form.passwordHash} />
        <RoleSelector role={form.role} setRole={(role) => setForm({ ...form, role })} />
        <button className="orange-btn" onClick={handleSubmit}>Create Account</button>
        <button className="blue-btn" onClick={() => window.location.href = '/'}>Sign In</button>
      </div>
    </div>
  );
};

export default SignupPage;