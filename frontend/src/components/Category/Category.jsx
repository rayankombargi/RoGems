import './Category.css';
import ExperienceItem from '../ExperienceItem/ExperienceItem';
import { useEffect, useState } from 'react';

function Category({experiences, genre, onSelectExperience, loading}) {

    const [filteredExperiences, setFilteredExperiences] = useState([]);

    useEffect(() => {
        let exps = [...experiences];
        exps = exps.filter(exp => exp.genre === genre || exp.genre_l1 === genre || exp.genre_l2 === genre);
        setFilteredExperiences(exps);

    }, [experiences, genre]);
    
    const handleSelectExperience = (experience_id) => {
        onSelectExperience(experience_id);
    }


    return (
        <div className='Category'>
            <h1> {genre} </h1>
            <div className='category-content'>
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
                        <h2 > {loading ? 'Loading...' : 'No experiences found'} </h2>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Category;