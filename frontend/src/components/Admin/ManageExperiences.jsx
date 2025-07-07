import './ManageExperiences.css';
import {useState, useEffect} from 'react';
import {motion} from 'framer-motion';
import axios from 'axios';

function ManageExperiences({experiences, fetchExperiences}) {
    const [sortBy, setSortBy] = useState('latest');
    const [sortedExperiences, setSortedExperiences] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [experiencesPerPage, setExperiencesPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchExperiences();
    });

    useEffect(() => {
        setTotalPages(Math.ceil(experiences.length / experiencesPerPage));   
    }, [experiences, experiencesPerPage]);

    useEffect(() => {
        if (currentPage > totalPages && totalPages > 0) {
            setCurrentPage(totalPages);
        } else if (currentPage < 1) {
            setCurrentPage(1);
        }
    }, [currentPage, totalPages]);

    useEffect(() => {
        let sorted = [...experiences];
        if (sortBy === 'latest') {
            sorted.sort((a,b) => new Date(b.added) - new Date(a.added));
        } else if (sortBy === 'oldest') {
            sorted.sort((a,b) => new Date(a.added) - new Date(b.added));
        }
        if (searchTerm) {
            sorted = sorted.filter((experience) => 
                experience.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        const startIndex = (currentPage - 1) * experiencesPerPage;
        const endIndex = currentPage * experiencesPerPage;
        setSortedExperiences(sorted.slice(startIndex, endIndex));
    }, [experiences, sortBy, currentPage, experiencesPerPage, searchTerm]);

    const handleUpdateExperience = async (id, url) => {
        try {
            if (url) {
                const fetchResponse = await axios.get('/api/experiences/fetch_data/', {params: {url: url}});
                const {game_data, icon} = fetchResponse.data;

                const response = await axios.put(`/api/experiences/update/${id}/`, {
                    rootPlaceId: game_data.rootPlaceId,
                    name: game_data.name,
                    url: url,
                    creator: game_data.creator.name,
                    description: game_data.description,
                    genre: game_data.genre,
                    genre_l1: game_data.genre_l1,
                    genre_l2: game_data.genre_l2,
                    maxPlayers: game_data.maxPlayers,
                    created: game_data.created,
                    icon : icon,
                })

                if (response.status === 200) {
                    alert("Experience updated successfully");
                    fetchExperiences();
                } else {
                    console.error("Error updating experience:", response.statusText);
                    alert("Error updating experience");
                }
            }
        } catch(error) {
            console.error("Error updating experience:", error);
        }
    }

    const handleDeleteExperience = async (id) => {
        try {
            const response = await axios.delete(`/api/experiences/delete/${id}/`);
            if (response.status === 204) {
                alert("Experience deleted successfully");
                fetchExperiences();
            } else {
                console.error("Failed to delete experience:", response.statusText);
                alert("Failed to delete experience");
            }
        } catch(error) {
            console.error("Error deleting experience:", error);
            alert("Error deleting experience");
        }
    }

    return (
        <div className='manage-experience'>
            {experiences.length === 0 ? (
                <div className='no-experiences'>No experiences found</div>
            ) : (
                <div className='manage-experience-panel'>
                    <div className='exp-count'>Experience Count: {experiences.length}</div> 
                    <div className='experiences-filters'>
                        <select className='experiences-per-page-select' 
                        onChange={(e) => {
                            setExperiencesPerPage(parseInt(e.target.value));
                        }}>
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={15}>15</option>
                            <option value={20}>20</option>
                        </select>
                        <input className='search-experience-input' 
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder='Search experiences...'
                        value={searchTerm}
                        />
                        <select className='sort-experiences-select'
                        onChange={(e) => setSortBy(e.target.value)}
                        value={sortBy}
                        >
                            <option value='latest'>Latest</option>
                            <option value='oldest'>Oldest</option>
                        </select>
                    </div>
                    <div className='experiences-list'>
                        {sortedExperiences.map((experience) => (
                            <div className='experience-instance'>
                                <div className='exp-name'>{experience.name}</div>
                                <div className='exp-added'>{experience.added}</div>
                                <button className='exp-update-button' onClick={() => handleUpdateExperience(experience.id, experience.url)}>Update</button>
                                <button className='exp-delete-button' onClick={() => handleDeleteExperience(experience.id)}>Delete</button>
                            </div>
                        ))}
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
            )}
        </div>

    );
}

export default ManageExperiences;