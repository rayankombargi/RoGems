import './Services.css';
import NavBar from '../NavBar/NavBar';
import NotBar from '../NotBar/NotBar';
import React, { useState, useEffect } from 'react';
import { useNavigation } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

function Services() {

    const [notification, setNotification] = useState(false);
    const [notDetails, setNotDetails] = useState({});
    const [experienceURLRequest, setExperienceURLRequest] = useState('');

    const handleExperienceURLRequestChange = (event) => {
        setExperienceURLRequest(event.target.value);
    }

    const [Username, setUsername] = useState('Anonymous');
    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    }
    const handleInsertExperienceRequest = async () => {
        try {
            const response = await axios.post('/api/requests/insert_experience_request/', {
                experience_url: experienceURLRequest,
                username: Username,
            })
            if (response.status === 404) {
                console.error("Error inserting experience request:", response.statusText);
                setNotDetails({ message: "Error inserting experience request", status: "error" });
                setNotification(true);
            } else {
                setNotDetails({ message: "Experience request inserted successfully", status: "success" });
                setNotification(true);
            }
        } catch (error) {
            setNotDetails({ message: "Error inserting experience request", status: "error" });
            setNotification(true);
        }
        setExperienceURLRequest('');
    }
    return (
        <div className="services">
            {notification && <NotBar message={notDetails.message} status={notDetails.status} setNotification={setNotification} setNotDetails={setNotDetails}/>}
            <NavBar />
            <div className="services-container">
                <motion.div
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 1, scale: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h1> Services </h1>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 1, scale: 0 }}
                    transition={{ duration: 0.8 }}
                    className="services-content"
                >
                    <div className="services-list">
                        <div className='request-experience'>
                            <h2>Request Experience</h2>
                            <p>You can request to showcase experiences by sending their url links down below.</p>
                            <p>They will be individually reviewed and added to the platform.</p>
                            <p>It is optional to write your Roblox username in the first input.</p>
                            <p>Experiences containing innapropriate themes are prohibited, they will be rejected.</p>
                            <p>Also, make sure to not input links of those that are already on the platform.</p>
                            <p>Thank you for your support!</p>
                            <div className='request-ui'>
                                <input type="text" placeholder="RBLX Username (Optional)" value={Username} onChange={handleUsernameChange} className="username-input"/>
                                <input type="text" placeholder="Experience URL" value={experienceURLRequest} onChange={handleExperienceURLRequestChange} className="experience-input"/>
                                <button onClick={handleInsertExperienceRequest} className='insert-button'>Insert</button>                     
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

export default Services;