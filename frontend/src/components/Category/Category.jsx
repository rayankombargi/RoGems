import './Category.css';
import ExperienceItem from '../ExperienceItem/ExperienceItem';
import { useEffect, useState } from 'react';

function Category({experiences, genre, onSelectExperience}) {

    const [filteredExperiences, setFilteredExperiences] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [experiencesPerPage, setExperiencesPerPage] = useState(6);
    const [totalPages, setTotalPages] = useState(1);

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
        exps = exps.filter(exp => exp.genre === genre || exp.genre_l1 === genre || exp.genre_l2 === genre);

        // Calculate total pages based on filtered experiences before slicing
        setTotalPages(Math.ceil(exps.length / experiencesPerPage));

        const firstIndex = (currentPage - 1) * experiencesPerPage;
        const lastIndex = firstIndex + experiencesPerPage;
        setFilteredExperiences(exps.slice(firstIndex, lastIndex));

    }, [experiences, genre, currentPage, experiencesPerPage]);
    
    const handleSelectExperience = (experience_id) => {
        onSelectExperience(experience_id);
    }

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

    return (
        <div className='Category'>
            <h1> {genre} </h1>
            <div className='category-list'>
                <button 
                    onClick={() => setCurrentPage(currentPage-1)} 
                    className='previous-button'
                    disabled={currentPage <= 1}
                >
                    Prev
                </button>
                {filteredExperiences.length > 0 ? (
                    <div className='experience-list'>
                        {filteredExperiences
                        .map((exp, index) => (
                                <ExperienceItem
                                    key={index}
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
                <button 
                    onClick={() => setCurrentPage(currentPage+1)} 
                    className='next-button'
                    disabled={currentPage >= totalPages}
                >
                    Next
                </button>
            </div>
        </div>
    )
}

export default Category;