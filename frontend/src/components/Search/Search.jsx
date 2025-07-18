import './Search.css';
import {useState, useEffect} from 'react';
import {motion, AnimatePresence} from 'framer-motion';
import axios from 'axios';
import NavBar from '../NavBar/NavBar';
import ExperienceItem from '../ExperienceItem/ExperienceItem';
import ExperiencePage from '../ExperiencePage/ExperiencePage';

function Search() {

    // Experience attributes filtering

    const [ experiences, setExperiences ] = useState([]);
    const [ categories, setCategories ] = useState([]);
    const [ subcategories, setSubcategories ] = useState([]);
    const [ filteredExperiences, setFilteredExperiences ] = useState([]);

    const [ searchQuery, setSearchQuery ] = useState('');
    const [ genre, setGenre ] = useState('All');
    const [ subGenre, setSubGenre ] = useState('All');
    const [ maxPlayers, setMaxPlayers ] = useState(null);
    const [ year, setYear ] = useState('All');
    const [sortBy, setSortBy] = useState('Ascending Added');

    const fetchExperiences = async () => {
        try {
            const response = await axios.get('/api/experiences/fetch_experiences/');
            setExperiences(response.data)
        } catch(error) {
            console.error("Error fetching experiences:", error)
        }
    }
    const fetchCategories = async () => {
        try {
            const response = await axios.get('/api/categories/fetch_categories/');
            setCategories(response.data);
        } catch(error) {
            console.error("Error fetching categories:", error);
        }
    }
    const fetchSubcategories = async () => {
        try {
            const response = await axios.get('/api/categories/fetch_subcategories/');
            setSubcategories(response.data);
        } catch(error) {
            console.error("Error fetching subcategories:", error);
        }
    }

    useEffect(() => {
        fetchExperiences();
        fetchCategories();
        fetchSubcategories();
    }, []);

    useEffect(() => {
        let exps = [...experiences];
        if (searchQuery) {
            exps = exps.filter((experience) => 
                experience.name.toLowerCase().includes(searchQuery.toLowerCase())
                || experience.description.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
        if (genre && genre !== 'All') {
            exps = exps.filter((experience) => experience.genre === genre || (experience.genre_l1 === genre) || (experience.genre_l2 === genre));
        }
        if (subGenre && subGenre !== 'All') {
            exps = exps.filter((experience) => (experience.genre === subGenre) || (experience.genre_l1 === subGenre) || (experience.genre_l2 === subGenre));
        }
        if (maxPlayers && maxPlayers !== 'All') {
            exps = exps.filter((experience) => experience.maxPlayers === parseInt(maxPlayers));
        }
        if (year && year !== 'All') {
            exps = exps.filter((experience) => new Date(experience.created).getFullYear() <= parseInt(year));
        }

        if (sortBy === 'Ascending Added') {
            exps.sort((a, b) => new Date(a.added) - new Date(b.added));
        }
        else if (sortBy === 'Descending Added') {
            exps.sort((a,b) => new Date(b.added) - new Date(a.added));
        } else if (sortBy === 'Oldest Release') {
            exps.sort((a,b) => new Date(a.created) - new Date(b.created));
        } else if (sortBy === 'Latest Release') {
            exps.sort((a,b) => new Date(b.created) - new Date(a.created));
        }

        setFilteredExperiences(exps);

    }, [experiences, categories, subcategories, searchQuery, genre, subGenre, maxPlayers, year, sortBy]);
    
    // Select Experience

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

    // Experiences per page system

    const [ experiencesPerPage, setExperiencesPerPage ] = useState(50);
    const [totalPages, setTotalPages] = useState(Math.ceil(filteredExperiences.length / experiencesPerPage));
    const [currentPage, setCurrentPage] = useState(1);
    const [paginatedExperiences, setPaginatedExperiences] = useState([]);

    useEffect(() => {
        setTotalPages(Math.ceil(filteredExperiences.length / experiencesPerPage));
        if (currentPage > totalPages) {
            setCurrentPage(totalPages);
        }
        if (currentPage < 1) {
            setCurrentPage(1);
        }
        
        const firstIndex = (currentPage - 1) * experiencesPerPage;
        const lastIndex = currentPage * experiencesPerPage;
        setPaginatedExperiences(filteredExperiences.slice(firstIndex, lastIndex));
    }, [filteredExperiences, experiencesPerPage, currentPage, totalPages]);

    return (
        <div className='Search'>
            <NavBar />
            <div className='search-container'>
                <motion.div
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 1, scale: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h1> Search Experiences </h1>
                </motion.div>
                <div className='search-content'>
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.7 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 1, scale: 0 }}
                        transition={{ duration: 0.8 }}
                        className='search-parameters'
                    >
                        <div className='search-filters'>
                            <div className='genre-filter'>
                                <label className='genre-filter-label'>Genre</label>
                                <select className='genre-filter-select' value={genre} onChange={(e) => setGenre(e.target.value)}>
                                    <option className='genre-filter-option' value='All'>All</option>
                                    {categories.filter((category) => category.name !== 'Experiences Of The Day' && category.name !== 'Featured This Week')
                                        .map((category) => {
                                            return (
                                                <option className='genre-filter-option' value={category.name}>{category.name}</option>
                                            )
                                        })
                                    }
                                </select>
                            </div>

                            <div className='subgenre-filter'>
                                <label className='subgenre-filter-label'>Sub-Genre</label>
                                <select className='subgenre-filter-select' value={subGenre} onChange={(e) => setSubGenre(e.target.value)}>
                                    <option className='subgenre-filter-option' value='All'>All</option>
                                    {subcategories.filter((subcategory) => categories.some(category => category.id === subcategory.category))
                                        .map((subcategory) => {
                                            return (
                                                <option className='subgenre-filter-option' value={subcategory.name}>{subcategory.name}</option>
                                            )
                                        })
                                    }
                                </select>
                            </div>
                            <div className='max-players-filter'>
                                <label className='max-players-filter-label'>Max Players</label>
                                <select className='max-players-filter-select' value={maxPlayers} onChange={(e) => setMaxPlayers(e.target.value)}>
                                    <option className='maxPlayers-filter-option' value='All'>All</option>
                                    {Array.from(new Set(experiences.map((experience) => experience.maxPlayers)))
                                        .sort((a,b) => b - a)
                                        .map((count) => {
                                            return (
                                                <option className='maxPlayers-filter-option' value={count}>{count}</option>
                                            )
                                        })
                                    }
                                </select>
                            </div>
                            <div className='year-filter'>
                                <label className='year-filter-label'>Year</label>
                                <select className='year-filter-select' value={(year)} onChange={(e) => setYear(e.target.value)}>
                                    <option className='year-filter-option' value='All'>All</option>
                                    {Array.from(new Set(experiences.map((experience) => new Date(experience.created).getFullYear())))
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
                        <input type='text' placeholder='Search for experiences...' className='search-input' onChange={(e) => setSearchQuery(e.target.value)} />
                        <div className='search-filters'>
                            <div className='exps-per-page'>
                                <label className='exps-per-page-label'>Count</label>
                                <select className='exps-per-page-select' value={experiencesPerPage} onChange={(e) => setExperiencesPerPage(e.target.value)}>
                                    <option className='exps-per-page-option' value={10}>10</option>
                                    <option className='exps-per-page-option' value={25}>25</option>
                                    <option className='exps-per-page-option' value={50}>50</option>
                                </select>
                            </div>
                            <div className='sort-filter'>
                                <label className='sort-filter-label'>Sort by</label>
                                <select className='sort-filter-select' value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                                    <option className='sort-filter-option' value='Ascending Added'>Ascending Added</option>
                                    <option className='sort-filter-option' value='Descending Added'>Descending Added</option>
                                    <option className='sort-filter-option' value='Oldest Release'>Oldest Release</option>
                                    <option className='sort-filter-option' value='Latest Release'>Latest Release</option>
                                </select>
                            </div>
                        </div>
                    </motion.div>
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.7 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 1, scale: 0 }}
                        transition={{ duration: 0.8 }}
                    
                        className='filter-output'
                    >
                        {
                            filteredExperiences.length > 0 ? (
                                <div>
                                    <div className='search-results'>
                                        {
                                            paginatedExperiences.map((experience) => {
                                                return (
                                                    <ExperienceItem 
                                                    key={experience.id} 
                                                    experience={experience} 
                                                    onSelectExperience={(experience_id) => handleSelectExperience(experience_id)}/>
                                                )
                                            })
                                        }
                                    </div>
                                    <div className='nav-pages'>
                                        <button className='first-page-button' 
                                            onClick={() => setCurrentPage(1)}
                                            disabled={currentPage === 1 ? true : false}
                                        >First</button>
                                        <button className='previous-page-button' 
                                            onClick={currentPage === 1 ? () => setCurrentPage(1) : () => setCurrentPage(currentPage - 1)}
                                            disabled={currentPage === 1 ? true : false}
                                        >Previous</button>
                                        <label className='current-page-label'>Page {currentPage} of {totalPages}</label>
                                        <button className='next-page-button' 
                                            onClick={currentPage === totalPages ? () => setCurrentPage(totalPages) : () => setCurrentPage(currentPage + 1)}
                                            disabled={currentPage === totalPages ? true : false}
                                        >Next</button>
                                        <button className='last-page-button' 
                                            onClick={() => setCurrentPage(totalPages)}
                                            disabled={currentPage === totalPages ? true : false}
                                        >Last</button>
                                    </div>
                                </div>
                            ) : (
                                <p>No experiences found</p>
                            )
                        }

                    </motion.div>
                </div>
            </div>
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