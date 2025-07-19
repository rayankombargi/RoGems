import './Category.css';
import ExperienceItem from '../ExperienceItem/ExperienceItem';
import { useState, useEffect } from 'react';
import axios from 'axios';

function WeeklyCategory({experiences, onSelectExperience }) {

    const [experiencesPerPage, setExperiencesPerPage] = useState(6);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [filteredExperiences, setFilteredExperiences] = useState([]);

    useEffect(() => {
        if (currentPage < 1) {
            setCurrentPage(1);
        }
        if (currentPage > totalPages && totalPages > 0) {
            setCurrentPage(totalPages);
        }
    }, [currentPage, totalPages]);

    useEffect(() => {
        let exps = [...experiences];
        setTotalPages(Math.ceil(exps.length / experiencesPerPage));
        let firstIndex = (currentPage - 1) * experiencesPerPage;
        let lastIndex = firstIndex + experiencesPerPage;
        setFilteredExperiences(exps.slice(firstIndex, lastIndex));
    }, [experiences, currentPage, experiencesPerPage]);


    useEffect(() => {
        const updateExperiencesPerPage = () => {
            if (window.innerWidth < 700) {
                setExperiencesPerPage(1);
            } else if (window.innerWidth < 800) {
                setExperiencesPerPage(2);
            } else if (window.innerWidth < 900) {
                setExperiencesPerPage(3);
            } else if (window.innerWidth < 1000) {
                setExperiencesPerPage(4);
            } else if (window.innerWidth < 1300) {
                setExperiencesPerPage(5);
            } else if (window.innerWidth < 1400) {
                setExperiencesPerPage(6);
            } else {
                setExperiencesPerPage(7);
            }
        }
        updateExperiencesPerPage();
        window.addEventListener('resize', updateExperiencesPerPage);
        return () => {
            window.removeEventListener('resize', updateExperiencesPerPage);
        }
    }, []);

    const handleSelectExperience = (experience_id) => {
        onSelectExperience(experience_id);
    }

    return (
<div className='Category'>
            <h1> Featured This Week </h1>
            <div className='category-list'>
                <button onClick={() => setCurrentPage(currentPage-1)} className='previous-button' disabled={currentPage <= 1}> Prev </button>
                {experiences.length > 0 ? (
                    <div className='experience-list'>
                        {experiences
                        .slice(currentPage * experiencesPerPage - experiencesPerPage, currentPage * experiencesPerPage)
                        .map((exp, index) => (
                                <ExperienceItem 
                                    key={exp.rootPlaceId} 
                                    experience={exp} 
                                    onSelectExperience={(experience_id) => handleSelectExperience(experience_id)}
                                />
                            ))}
                    </div>
                ) : (
                    <div className='empty-list'>
                        <h2 > No experiences found </h2>
                    </div>
                )}
                <button onClick={() => setCurrentPage(currentPage+1)} className='next-button' disabled={currentPage >= totalPages}> Next </button>
            </div>
        </div>
    )
}

export default WeeklyCategory;