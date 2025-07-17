import './AddExperience.css';
import NotBar from '../NotBar/NotBar';
import {useState, useEffect } from 'react';
import axios from 'axios';

function AddExperience({experiences, fetchExperiences}) {
    const [selectedURL, setSelectedURL] = useState('');
    const [notification, setNotification] = useState(false);
    const [notDetails, setNotDetails] = useState({});

    const addExperience = async () => {
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
                });

                if (response.status === 201) {
                    setNotDetails({ message: "Successfully added new experience", status: "success" });
                    setNotification(true);
                } else {
                    console.error("Error inserting experience:", response.statusText);
                    setNotDetails({ message: "Error inserting experience", status: "error" });
                    setNotification(true);
                }
            } else {
                console.error("Experience URL is empty");
                setNotDetails({ message: "Experience URL is empty", status: "error" });
                setNotification(true);
            }
        } catch(error) {
            console.error("Error inserting experience:", error);
            setNotDetails({ message: "Error inserting experience", status: "error" });
            setNotification(true);
        }
        setSelectedURL('');
    }

    useEffect(() => {
        fetchExperiences();
    }, []);

    return (
        <div className='add-experience'>
            {notification && <NotBar message={notDetails.message} status={notDetails.status} setNotification={setNotification} setNotDetails={setNotDetails}/>}
            <div className='exp-count'>Experience Count: {experiences.length}</div>
            <div className='add-exp-form'>
                <input type='url' className='add-exp-form-input' placeholder='insert experience url' onChange={(e) => setSelectedURL(e.target.value)} value={selectedURL}/>
                <button className='add-exp-form-button' onClick={() => addExperience()}>Insert</button>
            </div>
        </div>
        
    );
}

export default AddExperience;