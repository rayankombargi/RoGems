import './Services.css';
import NavBar from '../NavBar/NavBar';
import React, { useState, useEffect } from 'react';
import { useNavigation } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';

function Services() {
    const [experience_url, setExperienceUrl] = useState('');
    const handleExperienceUrlChange = (event) => {
        setExperienceUrl(event.target.value);
    }

    // Function to call backend API function that takes argument experience_url if not empty
    const handleInsertExperience = async () => {
        try {
            if (experience_url){
                
                const fetchResponse = await axios.get('/api/experiences/fetch_data/', {params: { url: experience_url }});
                const {game_data, icon} = fetchResponse.data;         
                
                console.log("Place ID:", game_data.rootPlaceId);
                console.log("Name:", game_data.name);
                console.log("URL:", experience_url);
                console.log("Creator:", game_data.creator.name);
                console.log("Description:", game_data.description);
                console.log("Genre:", game_data.genre);
                console.log("Genre_l1:", game_data.genre_l1);
                console.log("Genre_l2:", game_data.genre_l2);
                console.log("maxPlayers:", game_data.maxPlayers);
                console.log("Created:", game_data.created);
                console.log("Icon:", icon);

                const response = await axios.post('/api/experiences/insert/', {
                    rootPlaceId: game_data.rootPlaceId,
                    name: game_data.name,
                    url: experience_url,
                    creator: game_data.creator.name,
                    description: game_data.description,
                    genre: game_data.genre,
                    genre_l1: game_data.genre_l1,
                    genre_l2: game_data.genre_l2,
                    maxPlayers: game_data.maxPlayers,
                    created: game_data.created,
                    icon : icon,
                });
                if (response.status === 201) {
                    console.log("Experience inserted successfully");
                    setExperienceUrl('');
                } else {
                    console.error("Error inserting experience:", response.statusText);
                }
            } else {
                console.error("Experience URL is empty");
            }
        } catch (error) {
            console.error("Error inserting experience:", error);
        }
    }

    return (
        <div className="services">
            <NavBar />
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
                    <div className="insert-experience">
                        <h2>Insert Experience</h2>
                        <div className="experience-input-ui">
                            <input type="text" placeholder="Experience URL" onChange={handleExperienceUrlChange} className="experience-input"/>
                            <button onClick={handleInsertExperience} className='insert-button'>Insert</button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

export default Services;