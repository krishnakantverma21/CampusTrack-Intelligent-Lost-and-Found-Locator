import React, { useState, useEffect } from 'react';
import { login, signup } from '../services/authService';
import PasswordStrengthMeter from '../components/PasswordStrengthMeter';
import RoleSelector from '../components/RoleSelector';
import '../styles/Auth.css';
import listImage from '../assets/clg.png';

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    const savedPassword = localStorage.getItem('rememberedPassword');
    if (savedEmail && savedPassword) {
      setForm(prev => ({ ...prev, email: savedEmail, password: savedPassword }));
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async () => {
    try {
      if (isLogin) {
        const res = await login({ email: form.email, passwordHash: form.password });
        const user = res.data.user;

        localStorage.setItem('userEmail', user.email);
        localStorage.setItem('userRole', user.role);
        localStorage.setItem('userName', user.name);
        localStorage.setItem('profileImageUrl', user.profileImageUrl || '/assets/default-profile.png');

        if (rememberMe) {
          localStorage.setItem('rememberedEmail', form.email);
          localStorage.setItem('rememberedPassword', form.password);
        } else {
          localStorage.removeItem('rememberedEmail');
          localStorage.removeItem('rememberedPassword');
        }

        setSuccessMsg('✅ You have successfully logged in to your account!');
        setTimeout(() => {
          if (user.email === 'kkverma@university.edu') {
            window.location.href = '/admin';
          } else {
            window.location.href = '/dashboard';
          }
        }, 1500);
      } else {
        if (form.password !== form.confirmPassword) {
          alert('Passwords do not match');
          return;
        }

        const payload = {
          name: form.name,
          email: form.email,
          passwordHash: form.password,
          role: form.role,
        };

        const res = await signup(payload);
        setSuccessMsg('🎉 Account created successfully!');
        setTimeout(() => {
          setIsLogin(true);
          setSuccessMsg('');
        }, 2000);
      }
    } catch (err) {
      alert(isLogin ? 'Login failed' : 'Signup failed');
      console.error(err);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-illustration">
        <img src={listImage} alt="Campus Background" />
      </div>
      <div className={`auth-form glass ${isLogin ? 'fade-login' : 'fade-signup'}`}>
        <div className="toggle-buttons">
          <button className={isLogin ? 'active' : ''} onClick={() => setIsLogin(true)}>
            Login
          </button>
          <button className={!isLogin ? 'active' : ''} onClick={() => setIsLogin(false)}>
            Signup
          </button>
        </div>

        <h2>{isLogin ? 'Welcome Back!' : 'Create Account'}</h2>

        {!isLogin && (
          <input
            type="text"
            placeholder="Your name"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
          />
        )}

        <input
          type="email"
          placeholder="Your e-mail"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
        />

        <div className="password-field">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Your password"
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
          />
          <span onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? '🙈' : '👁️'}
          </span>
        </div>

        {!isLogin && (
          <div className="password-field">
            <input
              type={showConfirm ? 'text' : 'password'}
              placeholder="Confirm password"
              value={form.confirmPassword}
              onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
            />
            <span onClick={() => setShowConfirm(!showConfirm)}>
              {showConfirm ? '🙈' : '👁️'}
            </span>
          </div>
        )}

        {!isLogin && <PasswordStrengthMeter password={form.password} />}
        {!isLogin && <RoleSelector role={form.role} setRole={role => setForm({ ...form, role })} />}

        {isLogin && (
          <label className="remember-me">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
            />
            Remember Me
          </label>
        )}

        {successMsg && <div className="success-msg">{successMsg}</div>}

        <button className="blue-btn" onClick={handleSubmit}>
          {isLogin ? 'Sign In' : 'Create Account'}
        </button>
      </div>
    </div>
  );
};

export default AuthForm;