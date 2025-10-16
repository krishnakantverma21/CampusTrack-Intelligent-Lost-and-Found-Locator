import React from 'react';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';

export default function AuthForm() {
    const [isLogin, setIsLogin] = React.useState(true);

    return (
        <div className='container'>
            <div className='form-container'>
                <div className='form-toggle'>
                    <button className={isLogin ? 'active' : ""} onClick={() => setIsLogin(true)}>Login</button>
                    <button className={!isLogin ? 'active' : ""} onClick={() => setIsLogin(false)}>Signup</button>
                </div>
                {isLogin ? <LoginForm /> : <SignupForm />}
            </div>  
        </div>
    );
}