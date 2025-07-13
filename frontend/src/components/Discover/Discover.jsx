import './Discover.css';
import { useState, useEffect } from 'react';
import { Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

import NavBar from '../NavBar/NavBar';
import ExperiencePage from '../ExperiencePage/ExperiencePage';
import Category from '../Category/Category';
import DailyCategory from '../Category/DailyCategory';
import WeeklyCategory from '../Category/WeeklyCategory';

function Discover() {

    const [experiences, setExperiences] = useState([]);
    const [dailyExperiences, setDailyExperiences] = useState([]);
    const [weeklyExperiences, setWeeklyExperiences] = useState([]);

    const fetchExperiences = async () => {
        try {
            const response = await axios.get('/api/experiences/fetch_experiences/');
            setExperiences(response.data);
        } catch(error) {
            console.error('Error fetching experiences:', error);
        }
    }

    const fetchDailyExperiences = async () => {
        try {
            const response = await axios.get('/api/experiences/fetch_daily_experiences/');
            setDailyExperiences(response.data);
        } catch(error) {
            console.error('Error fetching daily experiences:', error);
        }
    }

    const fetchWeeklyExperiences = async () => {
        try {
            const response = await axios.get('/api/experiences/fetch_weekly_experiences/');
            setWeeklyExperiences(response.data);
        } catch(error) {
            console.error('Error fetching weekly experiences:', error);
        }
    }

    useEffect(() => {
        fetchExperiences();
        fetchDailyExperiences();
        fetchWeeklyExperiences();
    }, [])

    const [categories, setCategories] = useState([]);
    const fetchCategories = async () => {
        try {
            const response = await axios.get('/api/categories/fetch_categories/');
            setCategories(response.data);
        } catch(error) {
            console.error('Error fetching categories:', error);
        }
    }
    useEffect(() => {
        fetchCategories();
    }, [])

    const [selectedExperience, setSelectedExperience] = useState(null);
    const [showExperiencePage, setShowExperiencePage] = useState(false);

    const handleSelectExperience = (experience_id) => {
        setSelectedExperience(
            experiences.find((exp) => exp.rootPlaceId === experience_id)
        );
        setShowExperiencePage(true);
    };

    const handleCloseExperience = () => {
        setSelectedExperience(null);
        setShowExperiencePage(false);
    };

    return (
        <div className='Discover'>
            <NavBar />
            <div className='discover-container'>
                <motion.div
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 1, scale: 0 }}
                    transition={{ duration: 0.8 }}
                    className='discover-header'
                >
                    <h1> Discover Experiences </h1>
                </motion.div>
                {categories.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.7 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 1, scale: 0 }}
                        transition={{ duration: 0.8 }}
                        className='empty-category-set'
                    >
                        <h2> No categories found </h2>
                    </motion.div>
                ) : (
                    <>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.7 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 1, scale: 0 }}
                            transition={{ duration: 0.8 }}
                            className='discover-content'
                        >
                            {(() => {
                                const category = categories.find(category => category.name === "Experiences Of The Day");
                                if (category && dailyExperiences.length > 0) {
                                    return (
                                        <DailyCategory 
                                            experiences={experiences.filter(exp => dailyExperiences.some(dailyExp => dailyExp.experience === exp.id))}
                                            onSelectExperience={(experience_id) => handleSelectExperience(experience_id)}
                                        />
                                    );
                                }
                                return null;
                            })()}
                            {(() => {
                                const category = categories.find(category => category.name === "Featured This Week");
                                if (category && weeklyExperiences.length > 0) {
                                    return (
                                        <WeeklyCategory 
                                            experiences={experiences.filter(exp => weeklyExperiences.some(weeklyExp => weeklyExp.experience === exp.id))}
                                            onSelectExperience={(experience_id) => handleSelectExperience(experience_id)}
                                        />
                                    )
                                }
                                return null;
                            })()}
                            {
                                categories
                                    .filter((category) => category.name !== "Experiences Of The Day" && category.name !== "Featured This Week")
                                    .map((category) => {
                                        const filteredExperiences = experiences.filter((experience) => 
                                            experience.genre === category.name
                                            || experience.genre_l1 === category.name
                                            || experience.genre_l2 === category.name
                                        );
                                        if (filteredExperiences.length === 0) {
                                            return null;
                                        }
                                        return (
                                            <Category 
                                                key={category.name}
                                                experiences={experiences} 
                                                genre={category.name}
                                                onSelectExperience={(experience_id) => handleSelectExperience(experience_id)}
                                            />
                                        )
                                    }
                            )}
                        </motion.div> 
                    </>
                )}
            </div>
            <AnimatePresence>
                {showExperiencePage && selectedExperience && <ExperiencePage experience={selectedExperience} onClose={handleCloseExperience} />}
            </AnimatePresence>
        </div>
    );
}

export default Discover;