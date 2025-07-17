import React from 'react';
import './ManageTickets.css';
import {useState, useEffect} from 'react';
import {motion} from 'framer-motion';
import axios from 'axios';
import NotBar from '../NotBar/NotBar';

function ManageTickets({experiences, fetchExperiences}) {

    const [tickets, setTickets] = useState([]);
    const [notification, setNotification] = useState(false);
    const [NotDetails, setNotDetails] = useState([]);

    const fetchtickets = async () => {
        try {
            const response = await axios.get('/api/requests/fetch_experience_requests/')
            if (response.status === 200) {
                setTickets(response.data);
            } else {
                console.error("Failed to fetch tickets:", response.statusText);
            }
        } catch(error) {
            console.error("Error fetching tickets:", error);
        }
    }

    const addExperience = async (id, selectedURL) => {
        try {
            if (selectedURL) {
                const fetchResponse = await axios.get('/api/experiences/fetch_data/', {params: {url: selectedURL}});
                const {game_data, icon} = fetchResponse.data;
                
                const response = await axios.post('/api/experiences/insert/', {
                    rootPlaceId: game_data.rootPlaceId,
                    name: game_data.name,
                    url: selectedURL,
                    creator: game_data.creator.name,
                    description: game_data.description,
                    genre: game_data.genre,
                    genre_l1: game_data.genre_l1,
                    genre_l2: game_data.genre_l2,
                    maxPlayers: game_data.maxPlayers,
                    created: game_data.created,
                    icon : icon,
                })

                if (response.status === 201) {
                    setNotDetails({message: "Experience inserted successfully", status: "success"})
                    setNotification(true);
                    deleteTicket(id);
                    fetchtickets();
                    fetchExperiences();
                } else {
                    console.error("Error inserting experience:", response.statusText);
                    setNotDetails({message: "Error inserting experience", status: "error"})
                    setNotification(true);
                }
            } else {
                console.error("Experience URL is empty");
            }
        } catch(error) {
            console.error("Error inserting experience:", error);
        }
    }

    const deleteTicket = async (id) => {
        try {
            const response = await axios.delete(`/api/requests/delete_experience_request/${id}/`);
            if (response.status === 204) {
                setNotDetails({message: "Ticket deleted successfully", status: "success"})
                setNotification(true);
                fetchtickets();
                fetchExperiences();
            } else {
                console.error("Failed to delete ticket:", response.statusText);
            }
        } catch(error) {
            console.error("Error deleting ticket:", error);
        }
    }

    const [ticketsPerPage, setTicketsPerPage] = useState(5);
    const[totalPages, setTotalPages] = useState(0);
    const [sortedTickets, setSortedTickets] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [listOrder, setListOrder] = useState('latest');


    useEffect(() => {
        fetchtickets();
    }, []);

    useEffect(() => {
        setTotalPages(Math.ceil(tickets.length / ticketsPerPage));
    }, [tickets, ticketsPerPage]);

    useEffect(() => {
        if (currentPage > totalPages && totalPages > 0) {
            setCurrentPage(totalPages);
        } else if (currentPage < 1) {
            setCurrentPage(1);
        }
    }, [currentPage, totalPages]);

    useEffect(() => {
        const sorted = [...tickets];
        if (listOrder === 'latest') {
            sorted.sort((a,b) => new Date(b.created_at) - new Date(a.created_at));
        } else if (listOrder === 'oldest') {
            sorted.sort((a,b) => new Date(a.created_at) - new Date(b.created_at));
        }
        const startIndex = (currentPage - 1) * ticketsPerPage;
        const endIndex = currentPage * ticketsPerPage;
        setSortedTickets(sorted.slice(startIndex, endIndex));
    }, [tickets, ticketsPerPage, currentPage, listOrder]);

    return (
        <div className='manage-tickets'>
            {notification && <NotBar message={NotDetails.message} status={NotDetails.status} setNotification={setNotification} setNotDetails={setNotDetails}/>}
            {tickets.length === 0 ? (
                <h1 className='no-tickets'>No tickets available</h1>
            ) : (
                <div className='manage-tickets-panel'>
                    <div className='see-tickets'>
                        <div className='ticket-count'>Request Count: {tickets.length}</div>
                        <button className='refresh-button' onClick={() => {fetchExperiences(); fetchtickets();}}>Refresh</button>
                    </div>
                    <div className='tickets-filters'>
                        <select className='tickets-per-page-select'
                            onChange={(e) => {
                                setTicketsPerPage(parseInt(e.target.value));
                            }}
                            value={ticketsPerPage}
                        >
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={15}>15</option>
                            <option value={20}>20</option>
                        </select>

                        <select className='sort-tickets-select'
                            onChange={((e) => {
                                setListOrder(e.target.value);
                            })} 
                        >
                            <option value="latest">Latest</option>
                            <option value="oldest">Oldest</option>
                        </select>
                    </div>
                    <div className='tickets-panel'>
                        <div className='tickets-list'>
                            {sortedTickets.map((ticket, key) => (
                                <div className='ticket-instance' key={ticket.id}>
                                    <div className='ticket-exp-name'><a href={ticket.experience_url} target="_blank" rel="noopener noreferrer">{ticket.experience_url}</a></div>
                                    <div className='ticket-requester'>Requester: {ticket.username}</div>
                                    <button className='ticket-accept-button' onClick={() => addExperience(ticket.id, ticket.experience_url)}>Accept</button>
                                    <button className='ticket-decline-button' onClick={() => deleteTicket(ticket.id)}>Decline</button>
                                </div>))
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
                </div>

            )}
        </div>
    );
}

export default ManageTickets;