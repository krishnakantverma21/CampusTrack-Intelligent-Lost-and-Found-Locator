import React, { useState } from 'react';
import '../styles/Auth.css';

export default function SignupForm() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (username.trim().length === 0) {
            setError('Please enter a user name.');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        // TODO: replace with real signup request
        setMessage('Signed up successfully (demo)');
        setUsername('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
    };

    const passwordsMatch = password === confirmPassword || confirmPassword === '';
    const isPasswordValid = password.length >= 6;
    const isFormValid = username.trim() !== '' && email.trim() !== '' && isPasswordValid && passwordsMatch;

    return (
        <div className="auth-card">
            <h2 className="auth-title">Create account</h2>

            <form onSubmit={handleSubmit} className="auth-form" noValidate>
                <label className="input-group">
                    <span className="input-icon" aria-hidden>
                        {/* user icon */}
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path d="M12 12a5 5 0 100-10 5 5 0 000 10z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M3 21a9 9 0 0118 0" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </span>
                    <input
                        type="text"
                        placeholder="User name"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className="auth-input"
                        aria-label="username"
                    />
                </label>

                <label className="input-group">
                    <span className="input-icon" aria-hidden>
                        {/* email icon */}
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path d="M3 6.5L12 13L21 6.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                            <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.2"/>
                        </svg>
                    </span>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="auth-input"
                        aria-label="email"
                    />
                </label>

                <label className="input-group">
                    <span className="input-icon" aria-hidden>
                        {/* lock icon */}
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <rect x="3" y="11" width="18" height="10" rx="2" stroke="currentColor" strokeWidth="1.2"/>
                            <path d="M7 11V8a5 5 0 0110 0v3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                        </svg>
                    </span>
                    <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Password (min 6 chars)"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="auth-input"
                        aria-describedby="pw-help"
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

                <div id="pw-help" style={{ fontSize: 13, color: isPasswordValid ? '#2b7a0f' : '#b00020', margin: '2px 4px 0' }}>
                    {password.length > 0 ? (isPasswordValid ? 'Password length OK' : 'Password must be at least 6 characters') : 'Use 6 or more characters'}
                </div>

                <label className="input-group">
                    <span className="input-icon" aria-hidden>
                        {/* lock icon */}
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <rect x="3" y="11" width="18" height="10" rx="2" stroke="currentColor" strokeWidth="1.2"/>
                            <path d="M7 11V8a5 5 0 0110 0v3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                        </svg>
                    </span>
                    <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Confirm password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="auth-input"
                        aria-label="confirm-password"
                    />
                </label>

                {!passwordsMatch && (
                    <p className="field-error">Passwords do not match</p>
                )}

                <button
                    type="submit"
                    className="btn-primary"
                    disabled={!isFormValid}
                >
                    Create account
                </button>

                {error && <p className="form-error">{error}</p>}
                {message && <p className="form-success">{message}</p>}
            </form>
        </div>
    );
}