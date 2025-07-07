import './AddExperience.css';
import {useState, useEffect } from 'react';
import axios from 'axios';

function AddExperience({experiences, fetchExperiences}) {
    const [selectedURL, setSelectedURL] = useState('');

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
                    alert("Experience inserted successfully");
                } else {
                    console.error("Error inserting experience:", response.statusText);
                    alert("Error inserting experience");
                }
            } else {
                console.error("Experience URL is empty");
                alert("Experience URL is empty");
            }
        } catch(error) {
            console.error("Error inserting experience:", error);
            alert("Error inserting experience");
        }
        setSelectedURL('');
    }

    useEffect(() => {
        fetchExperiences();
    }, []);

    return (
        <div className='add-experience'>
            <div className='exp-count'>Experience Count: {experiences.length}</div>
            <div className='add-exp-form'>
                <input type='url' className='add-exp-form-input' placeholder='insert experience url' onChange={(e) => setSelectedURL(e.target.value)} value={selectedURL}/>
                <button className='add-exp-form-button' onClick={() => addExperience()}>Insert</button>
            </div>
        </div>
        
    );
}

export default AddExperience;