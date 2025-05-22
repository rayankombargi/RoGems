import "./ExperiencePage.css";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function ExperiencePage({experience, onClose}) {

    useEffect(() => {
        if (experience) {
            console.log("rootPlaceId: ", experience.rootPlaceId);
            console.log("name: ", experience.name);
            console.log("url: ", experience.url);
            console.log("description: ", experience.description);
            console.log("creator: ", experience.creator);
            console.log("genre: ", experience.genre);
            console.log("genre_l1: ", experience.genre_l1);
            console.log("genre_l2: ", experience.genre_l2);
            console.log("maxPlayers: ", experience.maxPlayers);
            console.log("created: ", experience.created);
            console.log("icon: ", experience.icon);
        }
    }, [experience]);

    const handleExperienceUrlDirection = (experience_url) => {
        if (experience_url) {
            window.open(experience_url, "_blank");
        } else {
            console.error("Experience URL is empty");
        }
    };

    const handleClose = () => {
        onClose();
    }

    return (
        <div className="modal-overlay" style={{ backdropFilter: "blur(8px)" }}>
            <motion.div
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="modal-content"
            >
                <h1 className="experience-page-name">{experience.name}</h1>
                <div className="experience-details">
                    <img src={experience.icon} className="experience-icon" />
                    <p className="experience-creator">By {experience.creator}</p>
                    <button className="url-button" onClick={handleExperienceUrlDirection.bind(this, experience.url)}>
                        View on Roblox
                    </button>
                    {experience.description === "" || experience.description === null ? null : 
                    (
                        <div className="experience-description">
                            <h1>Description</h1>
                            <p>{experience.description}</p>
                        </div>
                    )}
                    <div className="experience-minor-details">
                        <p className="experience-genre">Genre 1: {experience.genre}</p>
                        {experience.genre_l1 === "" || experience.genre_l1 === null ? null : <p className="experience-genre-l1">Genre 2: {experience.genre_l1}</p>}
                        {experience.genre_l2 === "" || experience.genre_l2 === null ? null : <p className="experience-genre-l2">Genre 3: {experience.genre_l2}</p>}
                        <p className="experience-maxPlayers">Max Players: {experience.maxPlayers}</p>
                        <p className="experience-created">Created: {new Date(experience.created).toLocaleDateString()}</p>
                    </div>
                    <button className="modal-close" onClick={handleClose}>Close</button>
                </div>
            </motion.div>
        </div>
    );
}

export default ExperiencePage;