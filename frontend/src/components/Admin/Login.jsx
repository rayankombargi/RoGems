import './Login.css';
import NotBar from '../NotBar/NotBar';
import Loading from '../Loading/Loading';
import { useState, useEffect } from 'react';
import {motion} from 'framer-motion';
import axios from 'axios';
import NavBar from '../NavBar/NavBar';

axios.defaults.withCredentials = true;

function Login({getAdmin, isAuthenticated, sessionTime, setSessionTime}) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [notification, setNotification] = useState(false);
    const [notDetails, setNotDetails] = useState({});
    const [loading, setLoading] = useState(false);

    const updateUsername = (event) => {
        setUsername(event.target.value);
    }
    const updatePassword = (event) => {
        setPassword(event.target.value);
    }

    const handleEnterKey = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            event.currentTarget.querySelector('button[type="submit"]')?.click();
        }
    }

    const login = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (sessionTime > 0) {
                const csrfResponse = await axios.get('/api/auth/get_csrf_token/');
                await axios.post('/api/auth/login/', {
                    username,
                    password
                }, {
                    headers: {
                        'X-CSRFToken': csrfResponse.data.csrfToken,
                    },
                });
            } else {
                setNotDetails({ message: "Session expired. Please refresh the page and log in again", status: "error" });
                setNotification(true);
                return;
            }
            getAdmin();
        } catch (error) {
            console.error("Login failed:", error);
            setNotDetails({ message: "Login failed. Please check your credentials", status: "error" });
            setNotification(true);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (!isAuthenticated) {
            if (sessionTime <= 0) return;
            const timeout = setTimeout(() => {
                setSessionTime(sessionTime - 1);
            }, 1000);
            // console.log(`Session time remaining: ${sessionTime} seconds`);
            
            return () => clearTimeout(timeout);
        }
    }, [sessionTime, isAuthenticated]);

    return (
        <div className='Login'>
            {loading && <Loading />}
            {notification && <NotBar message={notDetails.message} status={notDetails.status} setNotification={setNotification} setNotDetails={setNotDetails}/>}
            <NavBar/>
            <div className='login-container'>
                        <motion.div
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 1, scale: 0 }}
                    transition={{ duration: 0.8 }}
                    className='login-header'
                >
                    <h1>Admin Login</h1>
                        </motion.div>
                <div className='login-content'>
                    <motion.form
                        onSubmit={login}
                        onKeyDown={handleEnterKey}
                        initial={{ opacity: 0, scale: 0.7 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 1, scale: 0 }}
                        transition={{ duration: 0.8 }}
                        className='login-form'
                    >
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
                        <button type='submit' className='login-button'>Login</button>
                    </motion.form>
                </div>
            </div>
        </div>
    );
}

export default Login;