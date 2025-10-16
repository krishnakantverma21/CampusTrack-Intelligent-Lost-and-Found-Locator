import React from 'react';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import '../styles/Auth.css';

export default function AuthPage() {
    return (
        <div className="auth-page">
            <div className="auth-layout">
                <div className="auth-column">
                    <LoginForm />
                </div>

                <div className="auth-divider" aria-hidden />

                <div className="auth-column">
                    <SignupForm />
                </div>
            </div>
        </div>
    );
}