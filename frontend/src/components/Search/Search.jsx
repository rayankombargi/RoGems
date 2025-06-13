import './Search.css';
import {useState, useEffect} from 'react';
import {motion, AnimatePresence} from 'framer-motion';
import axios from 'axios';
import NavBar from '../NavBar/NavBar';
import ExperienceItem from '../ExperienceItem/ExperienceItem';
import ExperiencePage from '../ExperiencePage/ExperiencePage';

function Search() {

    const [ experiences, setExperiences ] = useState([]);
    const [ filteredExperiences, setFilteredExperiences ] = useState([]);
    const [ Categories, setCategories ] = useState([]);
    const [ subcategories, setSubcategories ] = useState([]);

    const [ searchQuery, setSearchQuery ] = useState('');
    const [ genre, setGenre ] = useState('All');
    const [ subGenre, setSubGenre ] = useState('All');
    const [ maxPlayers, setMaxPlayers ] = useState(null);
    const [ year, setYear ] = useState('All');

    useEffect(() => {
        const fetchExperiences = async () => {
            try {
                const response = await axios.get('/api/experiences/fetch_experiences/');
                setExperiences(response.data)
            } catch(error) {
                console.error("Error fetching experiences:", error)
            }
        }
        fetchExperiences();
        const fetchCategories = async () => {
            try {
                const response = await axios.get('/api/categories/fetch_categories/');
                setCategories(response.data);
            } catch(error) {
                console.error("Error fetching categories:", error);
            }
        }
        fetchCategories();
        const fetchSubcategories = async () => {
            try {
                const response = await axios.get('/api/categories/fetch_subcategories/');
                setSubcategories(response.data);
            } catch(error) {
                console.error("Error fetching subcategories:", error);
            }
        }
        fetchSubcategories();
        
        const handleFilterExperiences = () => {
            // if (searchQuery) {
            //     filtered = filtered.filter(experience => 
            //             experience.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
            //             experience.description.toLowerCase().includes(searchQuery.toLowerCase())
            //         )
            // }
            // if (genre && genre !== 'All') {
            //     filtered = filtered.filter(experience => experience.genre === genre)
            // }
            // if (subGenre && subGenre !== 'All') {
            //     filtered = filtered.filter(experience => experience.genre_l1 === subGenre || experience.genre_l2 === subGenre)
            // }
            // if (maxPlayers && maxPlayers !== '') {
            //     filtered = filtered.filter(experience =>
            //         (experience.maxPlayers <= maxPlayers)
            //     )
            // }
            // if (year && year !== 'All') {
            //     filtered = filtered.filter(experience => {
            //         const expYear = new Date(experience.release_date).getFullYear();
            //         return expYear === Number(year);
            //     });
            // }
            setFilteredExperiences(experiences);
        }
        handleFilterExperiences();
    }, []);

    const [ selectedExperience, setSelectedExperience ] = useState(null);
    const [ showExperiencePage, setShowExperiencePage ] = useState(false);

    const handleSelectExperience = (experience_id) => {
        setSelectedExperience(
            filteredExperiences.find((exp) => exp.rootPlaceId === experience_id)
        )
        setShowExperiencePage(true);
    }

    const handleCloseExperience = () => {
        setSelectedExperience(null);
        setShowExperiencePage(false);
    }

    return (
        <div className='Search'>
            <NavBar />
            <motion.div
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 1, scale: 0 }}
                transition={{ duration: 0.8 }}
                className='search-container'
            >
                <h1> Search Experiences </h1>
                <div className='search-parameters'>
                    <form className='search-form'>
                        <input type='text' placeholder='Search for experiences...' className='search-input' onChange={(e) => setSearchQuery(e.target.value)} />
                    </form>
                    <div className='search-filters'>
                        <select className='genre-filter' value={genre} onChange={(e) => setGenre(e.target.value)}>
                            <option className='genre-filter-option' value='All'>All</option>
                            {Categories.filter((category) => category.name !== 'Experience Of The Day' && category.name !== 'Featured This Week')
                                .map((category) => {
                                    return (
                                        <option className='genre-filter-option' value={category.name}>{category.name}</option>
                                    )
                                })
                            }
                        </select>
                        <select className='subgenre-filter' value={subGenre} onChange={(e) => setSubGenre(e.target.value)}>
                            <option className='subgenre-filter-option' value='All'>All</option>
                            {subcategories.filter((subcategory) => subcategory.category === genre)
                                .map((subcategory) => {
                                    return (
                                        <option className='subgenre-filter-option' value={subcategory.name}>{subcategory.name}</option>
                                    )
                                })
                            }
                        </select>
                        <input type='number' placeholder='Max Players' className='max-players-filter' value={maxPlayers} onChange={(e) => setMaxPlayers(e.target.value)} />
                        <select className='year-filter' value={(year)} onChange={(e) => setYear(e.target.value)}>
                            <option className='year-filter-option' value='All'>All</option>
                            {Array.from(new Set(filteredExperiences.map((experience) => new Date(experience.release_date).getFullYear())))
                                .sort((a, b) => b - a)
                                .map((year) => {
                                    return (
                                        <option className='year-filter-option' value={year}>{year}</option>
                                    )
                                })
                            }
                        </select>
                    </div>
                </div>
                <div className='search-results'>
                    {
                        filteredExperiences.length > 0 ? (
                            filteredExperiences.map((experience) => {
                                return (
                                    <ExperienceItem 
                                    key={experience.id} 
                                    experience={experience} 
                                    onSelectExperience={(experience_id) => handleSelectExperience(experience_id)}/>
                                )
                            })
                        ) : (
                            <p>No experiences found</p>
                        )
                    }

                </div>
            </motion.div>
            <AnimatePresence>
                { showExperiencePage && selectedExperience && 
                    <ExperiencePage
                        experience={selectedExperience} 
                        onClose={handleCloseExperience}    
                    />
                }
            </AnimatePresence>
        </div>
    );
}

export default Search;