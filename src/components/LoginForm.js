import React, { useState } from 'react';
import '../styles/Auth.css';

export default function LoginForm({ onLogin }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            // TODO: replace with real auth request
            await new Promise((r) => setTimeout(r, 600));
            setLoading(false);
            if (onLogin) onLogin(email);
        } catch (err) {
            setLoading(false);
            setError('Login failed');
        }
    };

    return (
        <div className="auth-card auth-card--alt">
            <h2 className="auth-title">Welcome back</h2>

            <form onSubmit={handleSubmit} className="auth-form">
                <label className="input-group">
                    <span className="input-icon" aria-hidden>
                        {/* email icon */}
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path d="M3 6.5L12 13L21 6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                        </svg>
                    </span>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="auth-input"
                    />
                </label>

                <label className="input-group">
                    <span className="input-icon" aria-hidden>
                        {/* lock icon */}
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <rect x="3" y="11" width="18" height="10" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                            <path d="M7 11V8a5 5 0 0110 0v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                    </span>
                    <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="auth-input"
                    />
                    <button
                        type="button"
                        className="toggle-visibility"
                        onClick={() => setShowPassword((s) => !s)}
                        aria-label="Toggle password visibility"
                    >
                        {showPassword ? 'Hide' : 'Show'}
                    </button>
                </label>

                <div className="form-row">
                    <label className="remember">
                        <input type="checkbox" /> Remember me
                    </label>
                    <a className="forgot-link" href="#/forgot">Forgot?</a>
                </div>

                <button type="submit" className="btn-primary" disabled={loading}>
                    {loading ? 'Signing in...' : 'Sign in'}
                </button>

                {error && <p className="form-error">{error}</p>}
            </form>
        </div>
    );
}