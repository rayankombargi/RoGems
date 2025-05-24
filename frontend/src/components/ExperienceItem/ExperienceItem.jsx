import './ExperienceItem.css';
import { motion } from 'framer-motion';

function ExperienceItem({ key, experience, onSelectExperience }) {

    const handleSelectExperience = () => {
        onSelectExperience(experience.rootPlaceId);
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            key={key}
            onClick={handleSelectExperience}
            className="ExperienceItem"
        >
            <img src={experience.icon} className='experience-icon' />
            <h2 className='experience-name'>{experience.name}</h2>
        </motion.div>

    );
}

export default ExperienceItem;