import './Services.css';
import NavBar from '../NavBar/NavBar';
import NotBar from '../NotBar/NotBar';
import React, { useState, useEffect } from 'react';
import { useNavigation } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';

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

    const [requests, setRequests] = useState([]);
    const [maxRequests, setMaxRequests] = useState(50); // Set the maximum number of requests allowed
    const getExperienceRequests = async () => {
        try {
            const response = await axios.get('/api/requests/fetch_experience_requests/');
            if (response.status === 200) {
                console.log("Requests fetched successfully")
                setRequests(response.data);
            } else {
                console.error("Failed to fetch experiences:", response.statusText);
            }
        } catch(error) {
            console.error("Error fetching experiences:", error);
        }
    }

    useEffect(() => {
        getExperienceRequests();
    }, []);

    const handleInsertExperienceRequest = async () => {
        try {
            const totalRequests = requests.length;
            if (totalRequests <= maxRequests) {
                const response = await axios.post('/api/requests/insert_experience_request/', {
                    experience_url: experienceURLRequest,
                    username: Username,
                })
                if (response.status === 404) {
                    console.error("Error submitting experience request:", response.statusText);
                    setNotDetails({ message: "Error submitting experience request", status: "error" });
                    setNotification(true);
                } else {
                    setNotDetails({ message: "Experience request successfully submitted", status: "success" });
                    setNotification(true);
                    await getExperienceRequests();
                }
            } else {
                setNotDetails({ message: "Requests are currently full. Please try again later or next week.", status: "error" });
                setNotification(true);
            }
        } catch (error) {
            setNotDetails({ message: "Error inserting experience request", status: "error" });
            setNotification(true);
        }
        setExperienceURLRequest('');
    }

    const CheckIfAlreadyExists = async () => {
        try {
            const response = await axios.get('/api/experiences/fetch_data/', {params: {url: experienceURLRequest}});
            if (response.status === 200) {
                const {game_data, icon} = response.data;
                const requestExists = await axios.get(`/api/requests/check_request_exists/${game_data.url}/`, {
                    validateStatus: () => true
                })
                if (requestExists.status === 404) {
                    const experienceExists = await axios.get(`/api/experiences/check_experience_exists/${game_data.rootPlaceId}/`, {
                        validateStatus: () => true
                    });
                    if (experienceExists.status === 404) {
                        await handleInsertExperienceRequest();
                    }
                    else {
                        setNotDetails({ message: "Experience already exists in the database", status: "error" });
                        setNotification(true);
                    }
                }
                else {
                    setNotDetails({ message: "Experience request already pending", status: "success" });
                    setNotification(true);
                    const updateRequestResponse = await axios.put(`/api/requests/update_experience_request/${game_data.rootPlaceId}/`, {
                        experience_url: game_data.url,
                        username: Username,
                    });
                }
            }
        } catch (error) {
            console.error("Error fetching experience data: ", error)
            setNotDetails({message: "Incorrect Experience URL", status: "error"});
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
                    className="services-header"
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
                            <p>Also, make sure to not input links of those that are already on this website.</p>
                            <p>Thank you for your support!</p>
                            <div className='request-ui'>
                                <input type="text" placeholder="RBLX Username (Optional)" value={Username} onChange={handleUsernameChange} className="username-input"/>
                                <input type="text" placeholder="Experience URL" value={experienceURLRequest} onChange={handleExperienceURLRequestChange} className="experience-input"/>
                                <button onClick={CheckIfAlreadyExists} className='insert-button'>Submit</button>                     
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

export default Services;