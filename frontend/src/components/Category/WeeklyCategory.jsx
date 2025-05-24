import './Category.css';
import ExperienceItem from '../ExperienceItem/ExperienceItem';
import { useState, useEffect } from 'react';
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

    const [experiencesPerPage, setExperiencesPerPage] = useState(6);

    useEffect(() => {
        const updateExperiencesPerPage = () => {
            if (window.innerWidth < 700) {
                setExperiencesPerPage(2);
            } else if (window.innerWidth < 800) {
                setExperiencesPerPage(3);
            } else if (window.innerWidth < 1000) {
                setExperiencesPerPage(4);
            } else if (window.innerWidth < 1200) {
                setExperiencesPerPage(5);
            } else if (window.innerWidth < 1300) {
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
    const handleCheckNextPage = () => {
        return experiences.length <= experiencesPerPage || currentPage === totalPages;
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
                <button onClick={handleNextPage} className='next-button' disabled={handleCheckNextPage}> Next </button>
            </div>
        </div>
    )
}

export default WeeklyCategory;