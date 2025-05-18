import './Discover.css';
import { useState } from 'react';
import { Link, Route } from 'react-router-dom';
import { motion } from 'framer-motion';

import NavBar from '../NavBar/NavBar';

function Discover() {
    return (
        <div className='Discover'>
            <NavBar />
            <motion.div
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 1, scale: 0 }}
                transition={{ duration: 0.8 }}
                className='discover-content'
            >
                <h1> Discover Experiences </h1>

            </motion.div>
        </div>
    );
}

export default Discover;