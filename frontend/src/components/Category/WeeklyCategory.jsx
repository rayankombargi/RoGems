import './Category.css';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

function WeeklyCategory({ onSelectExperience }) {

    const handleSelectExperience = (experience_id) => {
        onSelectExperience(experience_id);
    }

    const [experiences, setExperiences] = useState([]);
    const fetchExperiences = async () => {
        try {
            const response = await axios.get('/api/experiences/fetch_weekly_experiences/');
            setExperiences(response.data);
        } catch(error) {
            console.error('Error fetching experiences:', error);
        }
    }
    useEffect(() => {
        fetchExperiences();
    }, [])

    const [experiencesPerPage, setExperiencesPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(Math.ceil(experiences.length / experiencesPerPage));
    useEffect(() => {
        const total = Math.ceil(experiences.length / experiencesPerPage);
        setTotalPages(total);
    })

    const handlePreviousPage = () => {
        currentPage === 1 ? setCurrentPage(1) : setCurrentPage(currentPage - 1);
    }
    const handleNextPage = () => {
        currentPage === totalPages ? setCurrentPage(totalPages) : setCurrentPage(currentPage + 1);
    }

    return (
<div className='Category'>
            <h1> Featured This Week </h1>
            <div className='category-list'>
                <button onClick={handlePreviousPage} className='previous-button' > Prev </button>
                {experiences.length > 0 ? (
                    <div className='experience-list'>
                        {experiences
                        .slice(currentPage * experiencesPerPage - experiencesPerPage, currentPage * experiencesPerPage)
                        .map((exp, index) => (
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.7 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 1, scale: 0 }}                                
                                    key={index} onClick={() => handleSelectExperience(exp.rootPlaceId)} className='experience-item'
                                >
                                    <img src={exp.icon} className='experience-icon' />
                                    <h2 className='experience-name'>{exp.name}</h2>
                                </motion.div>
                            ))}
                    </div>
                ) : (
                    <div className='empty-list'>
                        <h2 > No experiences found </h2>
                    </div>
                )}
                <button onClick={handleNextPage} className='next-button' > Next </button>
            </div>
        </div>
    )
}

export default WeeklyCategory;