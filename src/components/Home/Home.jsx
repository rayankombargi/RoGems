import './Home.css';
import { useState } from 'react';
import { Route, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import NavBar from '../NavBar/NavBar';
import Discover from '../Discover/Discover';

function Home() {
    const navigate = useNavigate();
    const toDiscover = () => {
        navigate('/discover');
    }

    return (
        <div className='Home'>
            <NavBar />
            <motion.div
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 1, scale: 0 }}
                transition={{ duration: 0.8 }}
                className='home-content'
            >
                <div className='home-info'>
                    <h1> Welcome to the Experience Finder! </h1>
                    <img src={require('../Images/robloxMenu.png')} alt='Roblox Menu' className='home-image' />
                    <h2> Explore hidden experiences on the Roblox platform from amazing developers!</h2>
                    <button onClick={toDiscover} className='discover-button'>
                        Discover Now
                    </button>
                </div>
            </motion.div>
        </div>
    );
}

export default Home;