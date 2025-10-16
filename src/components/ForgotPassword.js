import React, { useState } from 'react';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Here you would typically handle the password reset logic
        // For demonstration, we'll just show a success message
        setMessage(`Password reset link sent to ${email}`);
        setEmail('');
    };

    return (
        <div className='forgot-password-container'>
            <h2>Forgot Password</h2>
            <form onSubmit={handleSubmit}>
                <input 
                    type='email' 
                    placeholder='Enter your email' 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                />
                <button type='submit'>Send Reset Link</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
}