import './Category.css';
import ExperienceItem from '../ExperienceItem/ExperienceItem';
import { useState, useEffect } from 'react';

function DailyCategory({ experiences, onSelectExperience }) {

    const handleSelectExperience = (experience_id) => {
        onSelectExperience(experience_id);
    }

    return (
        <div className='Category'>
            <h1> Experiences Of The Day </h1>
            <div className='category-list'>
                {experiences.length > 0 ? (
                    <div className='experience-list'>
                        {experiences
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
            </div>
        </div>
    )
}

export default DailyCategory;