import './Category.css';
import ExperienceItem from '../ExperienceItem/ExperienceItem';
import { useEffect, useState } from 'react';

function Category({experiences, fetchExperiences, genre, onSelectExperience}) {

    const [filteredExperiences, setFilteredExperiences] = useState([]);
    useEffect(() => {
        fetchExperiences();
        setFilteredExperiences(experiences.filter(exp => exp.genre === genre || exp.genre_l1 === genre || exp.genre_l2 === genre))
    }, []);
    
    const handleSelectExperience = (experience_id) => {
        onSelectExperience(experience_id);
    }

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

    const [totalPages, setTotalPages] = useState(Math.ceil(filteredExperiences.length / experiencesPerPage));
    useEffect(() => {
        const total = Math.ceil(filteredExperiences.length / experiencesPerPage);
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
        return filteredExperiences.length <= experiencesPerPage || currentPage === totalPages;
    }

    return (
        <div className='Category'>
            <h1> {genre} </h1>
            <div className='category-list'>
                <button onClick={handlePreviousPage} className='previous-button' disabled={handleCheckPreviousPage()}> Prev </button>
                {filteredExperiences.length > 0 ? (
                    <div className='experience-list'>
                        {filteredExperiences
                        .slice(currentPage * experiencesPerPage - experiencesPerPage, currentPage * experiencesPerPage)
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
                <button onClick={handleNextPage} className='next-button' disabled={handleCheckNextPage()}> Next </button>
            </div>
        </div>
    )
}

export default Category;