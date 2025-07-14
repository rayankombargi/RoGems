import './Login.css';
import { useState, useEffect } from 'react';
import {framerMotion} from 'framer-motion';
import axios from 'axios';
import NavBar from '../NavBar/NavBar';

axios.defaults.withCredentials = true;

function Login({getAdmin}) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const updateUsername = (event) => {
        setUsername(event.target.value);
    }
    const updatePassword = (event) => {
        setPassword(event.target.value);
    }

    const login = async (e) => {
        e.preventDefault();
        try {
            await axios.get('/api/auth/get_csrf_token/');
            await axios.post('/api/auth/login/', {
                username,
                password
            });
            getAdmin();
        } catch (error) {
            console.error("Login failed:", error);
            alert("Login failed. Please check your username and password.");
        }
    }

    return (
        <div className='Login'>
            <NavBar/>
            <div className='login-container'>
                <h1>Admin Login</h1>
                <div className='login-form'>
                    <p>Are you an admin? Log in now to access the panel!</p>
                    <input type='text' placeholder='Username' onChange={updateUsername} value={username} className='login-input-username'/>
                    <input type='password' placeholder='Password' onChange={updatePassword} value={password} className='login-input-password'/>
                    <label className='password-toggle'>
                        <input type='checkbox' className='password-checkbox' onChange={() => {
                                const passwordInput = document.querySelector('.login-input-password');
                                passwordInput.type = (passwordInput.type === 'password') ? 'text' : 'password';
                            }}
                        />
                        Show Password
                    </label>
                    <button onClick={login} className='login-button'>Login</button>
                </div>
            </div>
        </div>
    );
}

export default Login;