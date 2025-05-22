import './Search.css';
import {useState, useEffect} from 'react';
import {Route, useNavigate} from 'react-router-dom';
import {motion} from 'framer-motion';
import axios from 'axios';
import NavBar from '../NavBar/NavBar';

function Search() {
    return (
        <div className='Search'>
            <NavBar />
            <motion.div
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 1, scale: 0 }}
                transition={{ duration: 0.8 }}
            >
                <h1> Search Experiences </h1>
            </motion.div>
        </div>
    )
}

export default Search;