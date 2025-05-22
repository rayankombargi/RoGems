import './Category.css';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

function Category({experiences, genre, onSelectExperience}) {

    const handleSelectExperience = (experience_id) => {
        onSelectExperience(experience_id);
    }

    const [experiencesPerPage, setExperiencesPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(Math.ceil(experiences.length / experiencesPerPage));
    useEffect(() => {
        const total = Math.ceil(experiences.length / experiencesPerPage);
        setTotalPages(total);
    }, []);


    const handlePreviousPage = () => {
        currentPage === 1 ? setCurrentPage(1) : setCurrentPage(currentPage - 1);
    }
    const handleCheckPreviousPage = () => {
        return currentPage === 1;
    }

    const handleNextPage = () => {
        currentPage === totalPages ? setCurrentPage(totalPages) : setCurrentPage(currentPage + 1);
    }
    const handleCheckNextPage = () => {
        return currentPage === totalPages;
    }

    return (
        <div className='Category'>
            <h1> {genre} </h1>
            <div className='category-list'>
                <button onClick={handlePreviousPage} className='previous-button' disabled={handleCheckPreviousPage()}> Prev </button>
                {experiences.length > 0 ? (
                    <div className='experience-list'>
                        {experiences
                        .filter(exp => exp.genre === genre || exp.genre_l1 === genre || exp.genre_l2 === genre)
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
                <button onClick={handleNextPage} className='next-button' disabled={handleCheckNextPage()}> Next </button>
            </div>
        </div>
    )
}

export default Category;